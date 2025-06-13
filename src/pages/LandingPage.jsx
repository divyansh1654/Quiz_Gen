import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaRobot, 
  FaBook, 
  FaBookmark, 
  FaChartBar, 
  FaFileExport, 
  FaUsers, 
  FaBrain, 
  FaLayerGroup 
} from "react-icons/fa";

function Landing() {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 overflow-hidden mt-16">
      
      {/* Hero Section */}
      {/* Hero Section */}
<motion.section
  className="relative h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
>
  {/* Animated background */}
  <div className="absolute inset-0 z-0">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
        style={{
          backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 300 + 50}px`,
          height: `${Math.random() * 300 + 50}px`,
          animationDuration: `${Math.random() * 10 + 10}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </div>

  <div className="text-center relative z-10">
    <motion.h1
      className="text-4xl sm:text-6xl font-extrabold mb-4 text-white text-shadow-lg"
      {...fadeInUp}
    >
      Welcome to QuizGenerator
    </motion.h1>
    <motion.p
      className="text-xl mb-8 text-white text-shadow-md max-w-3xl mx-auto"
      {...fadeInUp}
    >
      Create engaging quizzes effortlessly! Whether you want AI-powered
      quiz generation or prefer manual quiz creation, we have you covered.
    </motion.p>
    <motion.div
      className="flex flex-col sm:flex-row gap-4 justify-center"
      {...fadeInUp}
    >
      <button
        onClick={() => navigate("/AiGenQ")}
        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
      >
        Generate AI Quiz
      </button>
      <button
        onClick={() => navigate("/ManualCreate")}
        className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
      >
        Create Own Quiz
      </button>
    </motion.div>
  </div>
</motion.section>


      {/* Features Section */}
<motion.section
  className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 bg-opacity-50"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8, delay: 0.2 }}
>
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12 text-white">
      Powerful Learning Features
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          icon: <FaRobot className="text-5xl mb-4 text-blue-500" />,
          title: "AI-Powered Quizzes",
          description: "Generate quizzes tailored to your needs using advanced AI algorithms.",
        },
        {
          icon: <FaBook className="text-5xl mb-4 text-yellow-500" />,
          title: "Smart Learning Guides",
          description: "Comprehensive study guides with key concepts and exam strategies.",
        },
        {
          icon: <FaBookmark className="text-5xl mb-4 text-red-500" />,
          title: "Smart Bookmarks",
          description: "Save and organize important questions for later review.",
        },
        {
          icon: <FaChartBar className="text-5xl mb-4 text-indigo-500" />,
          title: "Performance Analytics",
          description: "Detailed insights into your learning progress and weak areas.",
        },
        {
          icon: <FaFileExport className="text-5xl mb-4 text-green-500" />,
          title: "Multi-Format Export",
          description: "Download materials in PDF, CSV, or text formats.",
        },
        {
          icon: <FaUsers className="text-5xl mb-4 text-blue-400" />,
          title: "Collaborative Learning",
          description: "Study with peers through shared groups and materials.",
        },
        {
          icon: <FaBrain className="text-5xl mb-4 text-purple-400" />,
          title: "Adaptive Learning",
          description: "Automatically adjusts difficulty based on your performance.",
        },
        {
          icon: <FaLayerGroup className="text-5xl mb-4 text-orange-500" />,
          title: "Smart Flashcards",
          description: "Auto-generated flashcards from your study content.",
        },
      ].map((feature, index) => (
        <motion.div
          key={index}
          className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {feature.icon}
          <h3 className="text-2xl font-bold mb-4 text-white">
            {feature.title}
          </h3>
          <p className="text-gray-400">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-white text-center">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "QuizGenerator has revolutionized the way I create quizzes. The AI-powered feature is a game-changer!",
                author: "John Doe",
              },
              {
                quote:
                  "I love the flexibility of creating my own quizzes. It's so intuitive and easy to use!",
                author: "Jane Smith",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
                whileHover={{ scale: 1.03 }}
              >
                <p className="text-gray-400 italic mb-4">
                  "{testimonial.quote}"
                </p>
                <p className="text-gray-300 font-semibold">
                  - {testimonial.author}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Ready to create amazing quizzes?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Join thousands of educators and quiz enthusiasts today!
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            Get Started for Free
          </button>
        </div>
      </motion.section>
    </div>
  );
}

export default Landing;
