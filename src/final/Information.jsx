import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import { chatSession } from "../services/geminiAPI";
import { AI_PROMPT } from "../services/notesAi";
import { FaArrowLeft, FaBookmark } from "react-icons/fa";
import { motion } from "framer-motion";
import Button from "../components/ui/Button1";

const LearnPage = () => {
  const navigate = useNavigate();
  const quizDocId = localStorage.getItem("quizDocId");
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [learnContent, setLearnContent] = useState({
    keyConcepts: [],
    studyStrategies: [],
    importanceInExams: [],
  });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState(null);

  // Function to parse AI response
  const parseAIResponse = (responseText) => {
    try {
      // Remove potential markdown code block markers
      const cleanResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanResponse);
      
      // Validate structure and transform to our expected format
      if (!parsed.learningGuide) {
        throw new Error("Invalid structure in JSON response - missing learningGuide");
      }
      
      return {
        keyConcepts: parsed.learningGuide.keyConcepts || [],
        studyStrategies: parsed.learningGuide.studyStrategies || [],
        importanceInExams: parsed.learningGuide.importanceInExams || [],
      };
    } catch (error) {
      console.error("Error parsing AI response:", error);
      throw new Error("Failed to parse AI response. Please try again.");
    }
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!quizDocId) {
        setError("Quiz document ID is missing. Please try again.");
        setLoading(false);
        return;
      }

      try {
        // Fetch quiz data
        const quizRef = doc(db, "quizzes", quizDocId);
        const quizSnap = await getDoc(quizRef);

        if (!quizSnap.exists()) {
          setError("Quiz data not found in Firestore.");
          setLoading(false);
          return;
        }

        const quizData = quizSnap.data().quizData;
        setQuizData(quizData);

        // Check if learning content exists
        const learnRef = doc(db, "learn", quizDocId);
        const learnSnap = await getDoc(learnRef);

        if (learnSnap.exists()) {
          const data = learnSnap.data();
          setLearnContent({
            keyConcepts: data.keyConcepts || [],
            studyStrategies: data.studyStrategies || [],
            importanceInExams: data.importanceInExams || [],
          });
          setIsBookmarked(true);
        } else {
          // Generate new AI content
          const FINAL_PROMPT = AI_PROMPT
            .replace("{examName}", quizData?.examName || "")
            .replace("{syllabus}", quizData?.syllabus || "")
            .replace("{difficultyLevel}", quizData?.difficultyLevel || "");

          console.log("Sending prompt to AI:", FINAL_PROMPT);
          
          const result = await chatSession.sendMessage(FINAL_PROMPT);
          const responseText = await result.response.text();
          console.log("Raw AI Response:", responseText);

          const aiGeneratedContent = parseAIResponse(responseText);
          console.log("Processed AI Content:", aiGeneratedContent);

          // Validate minimum content
          if (!aiGeneratedContent || 
              !aiGeneratedContent.keyConcepts || 
              !aiGeneratedContent.studyStrategies ||
              !aiGeneratedContent.importanceInExams) {
            throw new Error("AI response didn't contain valid content structure");
          }

          setLearnContent(aiGeneratedContent);

          // Prepare data for Firestore
          const firestoreData = {
            keyConcepts: aiGeneratedContent.keyConcepts,
            studyStrategies: aiGeneratedContent.studyStrategies,
            importanceInExams: aiGeneratedContent.importanceInExams,
            userEmail: user?.email || "unknown",
            createdAt: new Date().toISOString(),
            quizData: {
              examName: quizData?.examName || "Unnamed Exam",
              syllabus: quizData?.syllabus || "No syllabus provided",
              difficultyLevel: quizData?.difficultyLevel || "Medium"
            }
          };

          // Save to Firestore
          await setDoc(learnRef, firestoreData);

          setIsBookmarked(true);
          console.log("AI content successfully saved to Firestore");
        }
      } catch (error) {
        console.error("Error in fetchQuizData:", error);
        setError(`Failed to generate learning content: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizDocId, user?.email]);

  const handleBookmark = async () => {
    if (!quizDocId || !learnContent || isBookmarked || !user?.email) return;

    try {
      const learnRef = doc(db, "learn", quizDocId);
      await setDoc(learnRef, {
        ...learnContent,
        userEmail: user.email,
        createdAt: new Date().toISOString(),
        quizData: quizData ? {
          examName: quizData.examName,
          syllabus: quizData.syllabus,
          difficultyLevel: quizData.difficultyLevel
        } : {}
      });

      setIsBookmarked(true);
    } catch (error) {
      console.error("Bookmark error:", error);
      setError("Error bookmarking content.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-400">Loading learning content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <Button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Go Back Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-400 hover:text-white transition mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <h1 className="text-4xl font-bold text-center mb-6 animate-bounce">
        {quizData?.examName} - Learning Page
      </h1>

      {learnContent ? (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Syllabus: {quizData?.syllabus}</h2>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Key Concepts</h2>
            <div className="space-y-6">
              {learnContent.keyConcepts?.length > 0 ? (
                learnContent.keyConcepts.map((concept, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-300 mb-2">{concept.conceptName}</h3>
                    <p className="text-gray-300 mb-3">{concept.description}</p>
                    {concept.example && (
                      <div className="bg-gray-600 p-3 rounded mb-2">
                        <p className="font-medium text-gray-200">Example:</p>
                        <p className="text-gray-300">{concept.example}</p>
                      </div>
                    )}
                    {concept.relatedTerms?.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-200">Related Terms:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {concept.relatedTerms.map((term, i) => (
                            <span key={i} className="bg-gray-600 px-2 py-1 rounded text-sm">
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No key concepts available.</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Study Strategies</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {learnContent.studyStrategies?.length > 0 ? (
                learnContent.studyStrategies.map((strategy, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-green-300 mb-2">{strategy.strategyName}</h3>
                    <p className="text-gray-300 mb-3">{strategy.description}</p>
                    {strategy.benefits?.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-200">Benefits:</p>
                        <ul className="list-disc list-inside ml-4 text-gray-300">
                          {strategy.benefits.map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No study strategies available.</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Importance in Exams</h2>
            <div className="space-y-4">
              {learnContent.importanceInExams?.length > 0 ? (
                learnContent.importanceInExams.map((importance, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-purple-300 mb-2">{importance.topic}</h3>
                    <p className="text-gray-300 mb-2">{importance.explanation}</p>
                    {importance.weightage && (
                      <p className="text-yellow-300 font-medium">Weightage: {importance.weightage}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No importance information available.</p>
              )}
            </div>
          </div>

          <Button
            className={`mt-6 px-6 py-2 rounded-lg text-white flex items-center justify-center ${
              isBookmarked ? "bg-green-500" : "bg-blue-500"
            } hover:opacity-80 transition`}
            onClick={handleBookmark}
            disabled={isBookmarked}
          >
            <FaBookmark className="mr-2" />
            {isBookmarked ? "Bookmarked ✅" : "Bookmark 🔖"}
          </Button>
        </motion.div>
      ) : (
        <p className="text-center text-gray-400">No learning content available.</p>
      )}
    </div>
  );
};

export default LearnPage;