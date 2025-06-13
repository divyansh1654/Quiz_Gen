import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ExamInfo = ({
  examName,
  syllabus,
  numQuestions,
  timeLeft,
  selectedQuestions,
  notSelectedQuestions,
  markedForReview,
}) => {
  const initialTime = timeLeft * 60;
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => setTime(time - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <motion.div
      className="bg-blue-100 p-6 rounded-2xl shadow-md text-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-2">{examName}</h2>
      <p className="text-gray-700 font-medium mb-1">
        Syllabus: <span className="font-semibold text-gray-900">{syllabus}</span>
      </p>
      <p className="text-gray-700 font-medium mb-1">
        Number of Questions:{" "}
        <span className="font-semibold text-gray-900">{numQuestions}</span>
      </p>

      <motion.div
        className="mt-4 py-2 px-4 rounded-lg text-white font-semibold bg-red-500 inline-block"
        initial={{ scale: 1 }}
        animate={{ scale: time % 2 === 0 ? 1.1 : 1 }}
        transition={{ duration: 0.5 }}
      >
        Time Left: {formatTime(time)}
      </motion.div>

      <div className="mt-6 space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <p className="text-gray-700 font-medium">
            Selected Questions:{" "}
            <span className="font-semibold text-green-600">{selectedQuestions}</span>
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <p className="text-gray-700 font-medium">
            Not Selected Questions:{" "}
            <span className="font-semibold text-red-600">{notSelectedQuestions}</span>
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <p className="text-gray-700 font-medium">
            Marked for Review:{" "}
            <span className="font-semibold text-yellow-600">{markedForReview}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ExamInfo;