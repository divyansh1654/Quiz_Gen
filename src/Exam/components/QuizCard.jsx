import React from 'react';
import { motion } from 'framer-motion';

const QuizCard = ({ question, selectedAnswer, onAnswerSelect }) => {
  const handleOptionClick = (key) => {
    onAnswerSelect(key === selectedAnswer ? null : key);
  };

  return (
    <motion.div 
      className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-6">{question.question}</h3>
      <div className="mt-4 space-y-4">
        {Object.entries(question.options).map(([key, value]) => (
          <motion.div 
            key={key} 
            className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
              selectedAnswer === key 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptionClick(key)}
          >
            <label className="flex items-center cursor-pointer w-full">
              <input
                type="radio"
                name="answer"
                value={key}
                checked={selectedAnswer === key}
                onChange={() => handleOptionClick(key)}
                className="hidden"
              />
              <span className="text-lg">{value}</span>
            </label>
          </motion.div>
        ))}
      </div>
      {selectedAnswer && (
        <motion.p 
          className="mt-6 text-lg font-semibold text-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your Answer: <span className="text-blue-600">{question.options[selectedAnswer]}</span>
        </motion.p>
      )}
    </motion.div>
  );
};

export default QuizCard;