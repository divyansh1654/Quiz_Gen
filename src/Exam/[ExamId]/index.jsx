import { db } from "@/services/firebaseConfig";
import { doc, getDoc, collection, addDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExamInfo from "../components/ExamInfo";
import QuizCard from "../components/QuizCard";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function ViewExam() {
  const { ExamId } = useParams();
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [markedForReview, setMarkedForReview] = useState([]);
  const navigate = useNavigate();
  const startTime = Date.now(); // Record start time
// Helper function to format time
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} minutes ${remainingSeconds} seconds`;
};
  useEffect(() => {
    if (ExamId) {
      GetQuizData();
      // fetchBookmarkedQuestions();
    }
  }, [ExamId]);

  useEffect(() => {
    if (exam?.timer) {
      setTimeLeft(exam.timer * 60);
    }
  }, [exam]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  const GetQuizData = async () => {
    const docRef = doc(db, "quizzes", ExamId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setExam(docSnap.data().quizData);
    } else {
      toast.error("No exam found!");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.numQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerSelect = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleMarkForReview = () => {
    if (markedForReview.includes(currentQuestionIndex)) {
      setMarkedForReview((prev) =>
        prev.filter((id) => id !== currentQuestionIndex)
      );
    } else {
      setMarkedForReview((prev) => [...prev, currentQuestionIndex]);
    }
  };

  const handleSubmit = async () => {
    if (!exam) return;
  
    let score = 0;
    let resultDetails = [];
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // Calculate time in seconds
  
    exam.questions.forEach((question, index) => {
      const correctAnswer = question.answer;
      const selectedAnswerKey = answers[index]; // User's selected option (A, B, C, D)
  
      const isCorrect = selectedAnswerKey === correctAnswer;
      if (isCorrect) score += 1;
  
      resultDetails.push({
        question: question.question,
        selectedAnswer: question.options[selectedAnswerKey] || "Not Answered",
        correctAnswer: question.options[correctAnswer],
        isCorrect,
        explanation: question.explanation,
      });
    });
  
    toast.success("Exam submitted successfully!");
    navigate("/result", {
      state: { score, total: exam.numQuestions, resultDetails, timeTaken },
    });
  };
  

  if (!exam) {
    return (
      <div className="text-center text-lg font-semibold h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b  from-gray-900 to-gray-800 p-8 mt-16 max-w-7xl mx-auto flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {/* Left Column: ExamInfo */}
        <div className="col-span-1 bg-gray-700 rounded-lg p-4 shadow-lg">
          <ExamInfo
            examName={exam.examName}
            syllabus={exam.syllabus}
            numQuestions={exam.numQuestions}
            timeLeft={exam.timer}
            selectedQuestions={
              answers.filter((answer) => answer !== null).length
            }
            notSelectedQuestions={
              exam.numQuestions -
              answers.filter((answer) => answer !== null).length
            }
            markedForReview={markedForReview.length}
          />
        </div>

        {/* Right Column: QuizCard and Navigation */}
        <div className="col-span-2 bg-gray-700 rounded-lg p-4 shadow-lg">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="my-4 text-lg font-semibold text-center text-gray-200"
          >
            Question {currentQuestionIndex + 1} of {exam.numQuestions}
          </motion.div>

          {exam.questions && (
            <QuizCard
              question={exam.questions[currentQuestionIndex]}
              selectedAnswer={answers[currentQuestionIndex]}
              onAnswerSelect={handleAnswerSelect}
            />
          )}

          <div className="flex justify-between my-6">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition-transform hover:scale-105`}
            >
              Previous
            </button>

            <button
              onClick={handleMarkForReview}
              className={`px-4 py-2 ${
                markedForReview.includes(currentQuestionIndex)
                  ? "bg-yellow-500"
                  : "bg-red-500"
              } text-white rounded-lg transition-transform hover:scale-105`}
            >
              {markedForReview.includes(currentQuestionIndex)
                ? "Unmark Review"
                : "Mark for Review"}
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === exam.numQuestions - 1}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 transition-transform hover:scale-105 ${
                currentQuestionIndex === exam.numQuestions - 1
                  ? "opacity-50"
                  : ""
              }`}
            >
              Next
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg transition-transform hover:scale-105"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


