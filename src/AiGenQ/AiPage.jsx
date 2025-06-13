import React, { useState, useEffect, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import axios from "axios";

import {
  FaRobot,
  FaClock,
  FaClipboardList,
  FaQuestionCircle,
  FaInfoCircle,
  FaBrain,
} from "react-icons/fa";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";

import Button1 from "../components/ui/Button1";
import Input1 from "../components/ui/Input1";
import Card1 from "../components/ui/Card1";
import RangeSlider from "../components/ui/RangeSlider";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import { AI_PROMPT } from "../services/options";
import { chatSession } from "../services/AiModal";
import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import { useNavigate} from "react-router-dom";

const AiPage = () => {
  const [examName, setExamName] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [timer, setTimer] = useState(30);
  const [isAdvancedSettings, setIsAdvancedSettings] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState("medium");
  const [showInfo, setShowInfo] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: { repeat: Infinity, duration: 2 },
    });
  }, [controls]);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("✅ Google Login Success:", tokenResponse);
  
      try {
        const { data: userInfo } = await axios.get(
          "https://www.googleapis.com/oauth2/v1/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
  
        console.log("👤 User Profile:", userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));
    
        if (typeof setOpenDialog === "function") {
          setOpenDialog(false); // Close dialog after successful login
          handleGenerateQuiz();
        }
  
        // You can redirect or trigger further actions here
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
      }
    },
    onError: (error) => {
      console.log("❌ Login Error:", error);
    },
  });
  
  const formData = {
    examName,
    syllabus,
    numQuestions,
    timer,
    isAdvancedSettings,
    difficultyLevel,
  };
  
  const handleGenerateQuiz = async () => {
    const user = localStorage.getItem("user");
 
    console.log("User from localStorage:", user);

    // If no user is found in localStorage, show the login dialog
    if (!user) {
      console.log("User not found, opening login dialog...");
      setOpenDialog(true);
      return;
    }

    console.log("Quiz Generation Data:", formData);

    if (
      !formData?.examName ||
      !formData?.syllabus ||
      !formData?.numQuestions ||
      !formData?.timer
    ) {
      alert("Failed to generate quiz. Try again!");
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replace("{examName}", formData?.examName)
      .replace("{syllabus}", formData?.syllabus)
      .replace("{numQuestions}", formData?.numQuestions)
      .replace("{timer}", formData?.timer)
      .replace("{difficultyLevel}", formData?.difficultyLevel);

    console.log(FINAL_PROMPT);
    
    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = await result.response.text();
      console.log(responseText);
      setLoading (false);
      SaveQuizData(responseText);
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
    // You can keep the alert or replace it with your quiz generation logic
    alert(
      `Generating Quiz: ${examName}, ${syllabus}, ${numQuestions} questions, Timer: ${timer} min, Difficulty: ${difficultyLevel}`
    );
  };

  const SaveQuizData = async (QuizData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    const cleanedQuizData = QuizData.replace(/```json/g, '').replace(/```/g, '').trim();

    // Parse the cleaned JSON string
    const parsedQuizData = JSON.parse(cleanedQuizData);
    await setDoc(doc(db, "quizzes", docId), {
      userSelection: formData,

      quizData: parsedQuizData,
      userEmail: user?.email,
      id: docId,
    });
    localStorage.setItem("quizDocId", docId);
    setLoading(false);
    navigate("/Exam/" + docId);
    console.log("Stored docId:", localStorage.getItem("quizDocId"));


  };

  const handleDifficultyChange = (level) => {
    setDifficultyLevel(level);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white flex flex-col items-center py-12 px-6 mt-16 relative overflow-hidden">
      {/* AI-themed background animation */}
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-500 rounded-full opacity-20"
            style={{
              width: Math.random() * 20 + 10,
              height: Math.random() * 20 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="max-w-4xl w-full text-center z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl font-bold mb-6 flex items-center justify-center gap-4"
          animate={controls}
        >
          <FaBrain className="text-blue-400" />
          AI-Generated Quiz
        </motion.h1>
        <p className="text-lg mb-6">
          Customize your quiz parameters and let AI generate an engaging test!
        </p>

        <Card1 className="bg-gradient-to-br from-white to-blue-100 bg-opacity-10 p-8 rounded-lg shadow-lg backdrop-blur-md text-black">
          {/* Exam Name Input */}
          <div className="mb-6">
            <label className="text-lg flex items-center gap-2 text-black">
              <FaRobot className="text-blue-400" /> Exam Name:
            </label>
            <Input1
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="Enter exam name..."
              className="mt-2 bg-white bg-opacity-20 border border-blue-300 rounded-md p-2 w-full text-black placeholder-gray-400"
            />
          </div>
          {/* Syllabus Input */}
          <div className="mb-6">
            <label className="text-lg flex items-center gap-2  text-black">
              <FaClipboardList className="text-green-400" /> Syllabus:
            </label>
            <Input1
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              placeholder="Enter syllabus..."
              className="mt-2 bg-white bg-opacity-20 border border-blue-300 rounded-md p-2 w-full text-black placeholder-gray-400"
            />
          </div>
          {/* Number of Questions */}
          <div className="mb-6">
            <label className="text-lg flex items-center gap-2  text-black">
              <FaQuestionCircle className="text-purple-400" /> Number of
              Questions:
            </label>
            <div className="flex items-center gap-4 mt-2">
              <RangeSlider
                min={5}
                max={50}
                value={numQuestions}
                onChange={(value) => setNumQuestions(value)}
                className="flex-grow"
              />
              <span className="bg-purple-500  text-black px-3 py-1 rounded-full">
                {numQuestions}
              </span>
            </div>
          </div>
          {/* Timer Input */}
          <div className="mb-6">
            <label className="text-lg flex items-center gap-2  text-black">
              <FaClock className="text-yellow-400" /> Timer (minutes):
            </label>
            <div className="flex items-center gap-4 mt-2">
              <RangeSlider
                min={10}
                max={180}
                value={timer}
                onChange={(value) => setTimer(value)}
                className="flex-grow"
              />
              <span className="bg-yellow-500  text-black px-3 py-1 rounded-full">
                {timer}
              </span>
            </div>
          </div>
          {/* Advanced Settings Toggle */}
          <div className="mb-6">
            <ToggleSwitch
              label="Advanced Settings"
              isOn={isAdvancedSettings}
              handleToggle={() => setIsAdvancedSettings(!isAdvancedSettings)}
              className="text-white"
            />
          </div>
          {/* Advanced Settings */}
          {isAdvancedSettings && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4  text-black">
                Advanced Settings
              </h3>
              <div className="space-y-4">
                {/* Difficulty Level */}
                <div>
                  <label className="text-lg  text-black">
                    Difficulty Level:
                  </label>
                  <div className="flex gap-4 mt-2">
                    {["easy", "medium", "hard"].map((level) => (
                      <Button1
                        key={level}
                        onClick={() => handleDifficultyChange(level)}
                        className={`w-full transition-colors duration-300 ${
                          difficultyLevel === level
                            ? level === "easy"
                              ? "bg-green-500 hover:bg-green-600"
                              : level === "medium"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-red-500 hover:bg-red-600"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button1>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* Info Button */}{" "}
          <Button1
            onClick={() => setShowInfo(!showInfo)}
            className="mt-6 bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded-full flex items-center justify-center gap-2"
          >
            {" "}
            <FaInfoCircle /> {showInfo ? "Hide Info" : "Show Info"}{" "}
          </Button1>{" "}
          {/* Info Section */}{" "}
          {showInfo && (
            <motion.div
              className="mt-6 bg-indigo-900 bg-opacity-50 p-4 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {" "}
              <h3 className="text-xl font-semibold mb-2 text-white">
                How It Works
              </h3>{" "}
              <p className="text-white">
                Our AI-powered quiz generator uses advanced algorithms to create
                personalized quizzes based on your input. It analyzes the
                syllabus, difficulty level, and other parameters to generate
                relevant and challenging questions.
              </p>{" "}
            </motion.div>
          )}
          {/* Generate Quiz Button */}
          {/* Generate Quiz Button */}
<Button1
  onClick={handleGenerateQuiz}
  className="w-full mt-6 bg-blue-500 hover:bg-blue-600 py-3 text-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
  disabled={loading} // Disable button during loading
>
  {loading ? (
    <>
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Generating...
    </>
  ) : (
    <>
      <FaRobot className="text-2xl" /> Generate AI Quiz
    </>
  )}
</Button1>
        </Card1>
      </motion.div>
      {/* Google Login Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-blue-900 text-white rounded-lg p-8 shadow-xl max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Sign In With Google
              </span>
            </DialogTitle>
            <DialogDescription className="text-center text-gray-300 mb-6">
              <FaRobot className="text-5xl text-blue-400 mx-auto mb-4" />
              <span>
                Access AI-powered quiz generation with Google authentication
              </span>
            </DialogDescription>
          </DialogHeader>
          <Button1
            onClick={login}
            className="w-full py-3 flex gap-4 items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 transform text-lg font-semibold"
          >
            <FcGoogle className="h-6 w-6" />
            Sign In With Google
          </Button1>
          <DialogFooter className="mt-6 text-center text-sm text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating AI Assistant */}
      <motion.div
        className="fixed bottom-4 right-4 bg-blue-500 rounded-full p-4 cursor-pointer shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => alert("AI Assistant at your service!")}
      >
        <FaRobot className="text-3xl" />
      </motion.div>
    </div>
  );
};

export default AiPage;
