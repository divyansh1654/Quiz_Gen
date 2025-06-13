import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import { motion } from "framer-motion";
import { FaStar, FaRegStar, FaHome, FaRedo, FaBookOpen } from "react-icons/fa";

const ResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState({});
  const [userEmail, setUserEmail] = useState(null); // State to store the signed-in user's email
  const [quizData, setQuizData] = useState(null); // State to store quiz data

  // Extract quizId from state (if available)
  const { score, total, resultDetails, quizId } = state || {};

  useEffect(() => {
    if (state?.score === state?.total) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    // Fetch the signed-in user's email from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserEmail(parsedUser.email); // Set the user's email
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Fetch quiz data from Firestore
    const fetchQuizData = async () => {
      const quizDocId = localStorage.getItem("quizDocId");
      if (quizDocId) {
        try {
          const quizRef = doc(db, "quizzes", quizDocId);
          const quizSnapshot = await getDoc(quizRef);
          if (quizSnapshot.exists()) {
            setQuizData(quizSnapshot.data().quizData);
          } else {
            console.error("Quiz data not found.");
          }
        } catch (error) {
          console.error("Error fetching quiz data:", error);
        }
      }
    };

    fetchQuizData();

    const fetchBookmarks = async () => {
      try {
        const bookmarksQuery = query(collection(db, "bookmarks"));
        const querySnapshot = await getDocs(bookmarksQuery);

        const bookmarksData = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          bookmarksData[data.questionId] = true; // Mark questions as bookmarked
        });

        setIsBookmarked(bookmarksData);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    fetchBookmarks();
  }, [state, quizId]);

  // Store quiz result in Firestore
  // console.log(quizData.userEmail);
  

useEffect(() => {
  const storeQuizResult = async () => {
    if (!userEmail || score === undefined || total === undefined) return;

    try {
      // Retrieve quizDocId from localStorage
      const quizDocId = localStorage.getItem("quizDocId");
      console.log("📌 Fetching quiz data for ID:", quizDocId);
      if (!quizDocId) {
        console.error("❌ Quiz Document ID not found in localStorage.");
        return;
      }

      

      // Fetch quiz data from Firestore
      const quizRef = doc(db, "quizzes", quizDocId);
      const quizSnapshot = await getDoc(quizRef);

      if (!quizSnapshot.exists()) {
        console.error("❌ Quiz document not found in Firestore.");
        return;
      }

      const quizData = quizSnapshot.data().quizData; // Retrieved quiz details
      console.log("✅ Fetched Quiz Data:", quizData); // Debugging

      // Store quiz result in Firestore
      await addDoc(collection(db, "quizResults"), {
        userEmail: userEmail,
        topic: quizData.examName || "❓ Unknown Topic",
        syllabus: quizData.syllabus || "❓ Not Available",
        score: ((score / total) * 100).toFixed(2), // Calculate percentage with 2 decimals
        date: new Date().toISOString(),
      });

      console.log("✅ Quiz result stored successfully!");
    } catch (error) {
      console.error("❌ Error storing quiz result:", error);
    }
  };

  storeQuizResult();
}, [userEmail, score, total]);

  

  const handleBookmark = async (questionId, question, correctAnswer, explanation) => {
    if (!userEmail) {
      console.error("User email is not available.");
      return;
    }

    try {
      if (isBookmarked[questionId]) {
        // If already bookmarked, remove the bookmark
        const bookmarkQuery = query(
          collection(db, "bookmarks"),
          where("questionId", "==", questionId),
          where("userEmail", "==", userEmail) // Ensure only the current user's bookmark is deleted
        );
        const querySnapshot = await getDocs(bookmarkQuery);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        setIsBookmarked((prev) => ({ ...prev, [questionId]: false }));
      } else {
        // If not bookmarked, add the bookmark
        await addDoc(collection(db, "bookmarks"), {
          questionId,
          question,
          correctAnswer,
          explanation,
          userEmail, // Include the user's email in the bookmark data
        });
        setIsBookmarked((prev) => ({ ...prev, [questionId]: true }));
      }
    } catch (error) {
      console.error("Error handling bookmark:", error);
    }
  };

  const handleLearnTopic = async () => {
    const docId = localStorage.getItem("quizDocId");
    navigate("/Learn/" + docId);
  };

  if (!state)
    return (
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-xl font-bold mt-10 text-red-500"
      >
        No result data found.
      </motion.p>
    );

  const percentage = Math.round((score / total) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8 flex flex-col items-center overflow-hidden mt-16">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
      >
        Quiz Results
      </motion.h2>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="text-2xl font-semibold mb-6"
      >
        Score: {score} / {total} ({percentage}%)
      </motion.div>

      {/* Circular Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative w-48 h-48 mb-8"
      >
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-700 stroke-current"
            strokeWidth="10"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
          ></circle>
          <circle
            className="text-blue-500 progress-ring__circle stroke-current"
            strokeWidth="10"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 * (1 - percentage / 100)}
          ></circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
          {percentage}%
        </div>
      </motion.div>

      {/* Scrollable Result Details */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        {resultDetails.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg mb-4 ${
              item.isCorrect
                ? "bg-gradient-to-r from-green-600 to-green-700"
                : "bg-gradient-to-r from-red-600 to-red-700"
            }`}
          >
            <div className="flex justify-between items-start">
              <p className="text-lg font-semibold">{item.question}</p>
              <button
                onClick={() =>
                  handleBookmark(
                    index,
                    item.question,
                    item.correctAnswer,
                    item.explanation
                  )
                }
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                {isBookmarked[index] ? <FaStar /> : <FaRegStar />}
              </button>
            </div>
            <p>
              Your Answer:{" "}
              <span className="font-bold">{item.selectedAnswer}</span>
            </p>
            <p>
              Correct Answer:{" "}
              <span className="font-bold">{item.correctAnswer}</span>
            </p>
            <p className="italic text-sm mt-2">📖 {item.explanation}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-8 flex gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg flex items-center"
        >
          <FaHome className="mr-2" /> Home
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-purple-500 text-white font-semibold rounded-lg flex items-center"
        >
          <FaRedo className="mr-2" /> Retry Quiz
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLearnTopic}
          className="px-5 py-2 bg-green-500 text-white font-semibold rounded-lg flex items-center"
        >
          <FaBookOpen className="mr-2" /> Learn Topic
        </motion.button>
      </motion.div>

      {/* Celebration Message */}
      {percentage >= 80 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
          className="mt-8 text-2xl font-bold text-yellow-400"
        >
          🎉 Congratulations! You aced it! 🎉
        </motion.div>
      )}
    </div>
  );
};

export default ResultPage;