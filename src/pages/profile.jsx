import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../services/firebaseConfig";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle, FaChartLine, FaCalendarAlt, FaBook, FaTrophy } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
  });
  const [quizResults, setQuizResults] = useState([]);
  const [stats, setStats] = useState({ totalQuizzes: 0, avgScore: 0, bestScore: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const db = getFirestore(app);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserDetails({
        name: user.name || "Unknown",
        email: user.email || "No Email",
      });

      const fetchQuizResults = async () => {
        setLoading(true);
        try {
          const q = query(
            collection(db, "quizResults"),
            where("userEmail", "==", user.email)
          );
          const querySnapshot = await getDocs(q);
          const results = [];
          let totalScore = 0;
          let bestScore = 0;
          querySnapshot.forEach((doc) => {
            const data = { id: doc.id, ...doc.data() };
            results.push(data);
            if (data.score !== null && data.score !== undefined) {
              totalScore += data.score;
              if (data.score > bestScore) bestScore = data.score;
            }
          });
          setQuizResults(results);
          setStats({
            totalQuizzes: results.length,
            avgScore: results.length ? (totalScore / results.length).toFixed(2) : 0,
            bestScore,
          });
        } catch (error) {
          setError("Error fetching quiz results");
          console.error("❌ Error fetching quiz results:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchQuizResults();
    }
  }, [db]);

  // Prepare data for the progress tracker graph
  const graphData = {
    labels: quizResults.map((_, index) => `Quiz ${index + 1}`),
    datasets: [
      {
        label: "Scores",
        data: quizResults.map((result) => result.score),
        borderColor: "#4F46E5",
        backgroundColor: "#6366F1",
        pointBackgroundColor: "#4F46E5",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        tension: 0.3,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Progress Tracker",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="profile-page p-6 max-w-5xl mx-auto text-white"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Profile
        </h1>
        <button className="bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-all">
          <FiLogOut /> Logout
        </button>
      </motion.div>

      {/* User Details */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="user-details bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg flex items-center gap-6 mb-8 shadow-xl hover:shadow-2xl transition-shadow"
      >
        <FaUserCircle className="text-8xl text-purple-400" />
        <div>
          <h2 className="text-3xl font-bold">{userDetails.name}</h2>
          <p className="text-gray-400">{userDetails.email}</p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="stats grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-8"
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <p className="text-3xl font-bold">{stats.totalQuizzes}</p>
          <p className="text-gray-200">Total Quizzes</p>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <p className="text-3xl font-bold">{stats.avgScore}%</p>
          <p className="text-gray-200">Avg Score</p>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-purple-600 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <p className="text-3xl font-bold">{stats.bestScore}%</p>
          <p className="text-gray-200">Best Score</p>
        </div>
      </motion.div>

      {/* Progress Tracker Graph */}
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="progress-tracker bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaChartLine className="text-purple-400" /> Progress Tracker
        </h2>
        {quizResults.length > 0 ? (
          <Line data={graphData} options={graphOptions} />
        ) : (
          <p className="text-gray-400">No quiz results found to display progress.</p>
        )}
      </motion.div>

      {/* Quiz Results Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="quiz-results bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaTrophy className="text-purple-400" /> Quiz Results
        </h2>
        {quizResults.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Topic</th>
                <th className="py-3 px-4 text-left">Syllabus</th>
                <th className="py-3 px-4 text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {quizResults.map((result) => (
                <tr key={result.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                  <td className="py-4 px-4">{new Date(result.date).toLocaleString()}</td>
                  <td className="py-4 px-4">{result.topic || "Unknown Topic"}</td>
                  <td className="py-4 px-4">{result.syllabus || "Not Available"}</td>
                  <td className="py-4 px-4 font-bold text-purple-400">{result.score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400">No quiz results found.</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Profile;
