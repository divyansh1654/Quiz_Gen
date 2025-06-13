import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaPlus, FaPlay } from "react-icons/fa";
import Button from "../components/ui/Button1";
import Input from "../components/ui/Input1";
import Card from "../components/ui/Card1";

const CreateMan = () => {
  const navigate = useNavigate();
  const [examName, setExamName] = useState("");
  const [timer, setTimer] = useState(10);
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswer = (qIndex, optIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = optIndex;
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    navigate("/quiz", { state: { examName, timer, questions } });
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-gray-900 to-blue-900 text-white p-6 mt-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto p-8 bg-gray-800 rounded-2xl shadow-2xl"
      >
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Create Your Epic Quiz
        </h2>

        <div className="flex flex-col space-y-6">
          {/* Exam Name Input */}
          <Card className="w-full p-6 bg-gray-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/30">
            <h3 className="text-xl font-semibold text-purple-300 mb-3">Quiz Title</h3>
            <Input
              placeholder="Enter an exciting quiz name"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full p-3 bg-gray-600 border-2 border-purple-500 rounded-lg text-white focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </Card>

          {/* Timer Input */}
          <Card className="w-full p-6 bg-gray-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-blue-500/30">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Time Limit (minutes)</h3>
            <Input
              type="number"
              placeholder="Ex. 10"
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
              className="w-full p-3 bg-gray-600 border-2 border-blue-500 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </Card>

          {/* Questions Section */}
          <AnimatePresence>
            {questions.map((q, qIndex) => (
              <motion.div
                key={qIndex}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="w-full p-6 bg-gray-700 rounded-xl shadow-lg relative transition-all duration-300 hover:shadow-green-500/30">
                  {/* Delete Icon */}
                  <button
                    onClick={() => handleDeleteQuestion(qIndex)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete question"
                  >
                    <FaTrash size={20} />
                  </button>
                  <h3 className="text-xl font-semibold text-green-300 mb-3">Question {qIndex + 1}</h3>
                  <Input
                    placeholder="Enter your question here"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    className="w-full p-3 bg-gray-600 border-2 border-green-500 rounded-lg text-white focus:ring-2 focus:ring-lime-500 transition-all"
                  />
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-3 mt-4">
                      <Input
                        placeholder={`Option ${optIndex + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                        className="w-full p-3 bg-gray-600 border-2 border-teal-500 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                      <input
                        type="radio"
                        checked={q.correctAnswer === optIndex}
                        onChange={() => handleCorrectAnswer(qIndex, optIndex)}
                        className="form-radio h-5 w-5 text-pink-500 focus:ring-2 focus:ring-pink-500 transition-all"
                        aria-label={`Correct answer for question ${qIndex + 1}`}
                      />
                    </div>
                  ))}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex justify-center gap-6 mt-8">
            <Button
              onClick={addQuestion}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              <FaPlus /> Add Question
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-105"
            >
              <FaPlay /> Start Quiz
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateMan;
