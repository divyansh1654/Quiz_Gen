import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaPencilAlt, FaGamepad, FaChartBar, FaUserCircle, FaPalette, FaTrophy, FaMobileAlt, FaLanguage, FaBrain } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const FeaturePage = () => {
  const [activeSection, setActiveSection] = useState('features');

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' }
  };

  const features = [
    { icon: <FaRobot />, title: "AI-Powered Quiz Generation", description: "Generate quizzes using Gemini AI API with customizable parameters." },
    { icon: <FaPencilAlt />, title: "Manual Quiz Creation", description: "Create quizzes manually with multiple-choice questions." },
    { icon: <FaGamepad />, title: "Interactive Quiz Experience", description: "Enjoy a sleek UI/UX with real-time feedback and timer-based challenges." },
    { icon: <FaChartBar />, title: "Result & Explanation Page", description: "Get instant scores and AI-powered explanations for correct answers." },
    { icon: <FaUserCircle />, title: "User Dashboard", description: "Track quiz history, performance, and manage bookmarks and notes." },
    { icon: <FaPalette />, title: "Modern UI with Animated Background", description: "Experience beautiful particle animations and dark/light mode support." }
  ];

  const futureEnhancements = [
    { icon: <FaTrophy />, title: "Leaderboard & Competitions", description: "Allow users to challenge friends and compete globally." },
    { icon: <FaMobileAlt />, title: "Mobile App Version", description: "Access QuizGen on-the-go with native Android & iOS apps." },
    { icon: <FaLanguage />, title: "Multilingual Support", description: "Generate and take quizzes in multiple languages." },
    { icon: <FaBrain />, title: "AI-based Adaptive Learning", description: "Get personalized quizzes based on your performance and learning curve." }
  ];

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white py-20 px-6 sm:px-10 lg:px-16">
      {/* Navigation */}
      <nav className="mb-16">
        <ul className="flex justify-center space-x-6">
          {['Features', 'Tech Stack', 'How It Works', 'Future'].map((item) => (
            <li key={item}>
              <button
                className={`text-lg font-semibold px-4 py-2 rounded-full transition-all duration-300 ${
                  activeSection === item.toLowerCase() ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setActiveSection(item.toLowerCase())}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero Section */}
      <motion.div 
        className="max-w-6xl mx-auto text-center mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1 className="text-6xl sm:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500" {...fadeInUp}>
          QuizGen Features
        </motion.h1>
        
        <motion.p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto" {...fadeInUp}>
          Revolutionize learning with AI-powered quizzes for students, educators, and quiz enthusiasts.
        </motion.p>
      </motion.div>

      {/* Features Grid */}
      {activeSection === 'features' && (
        <motion.div 
          ref={ref} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {}
          }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-lg hover:bg-opacity-20 transition-all duration-300 hover:shadow-xl transform hover:scale-105"
              variants={fadeInUp}
            >
              <div className="text-5xl text-blue-400 mb-6 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">{feature.title}</h3>
              <p className="text-gray-900 text-center text-lg">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Tech Stack Section */}
      {activeSection === 'tech stack' && (
        <motion.div className="mt-20 text-center" {...fadeInUp}>
          <h2 className="text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Cutting-Edge Tech Stack
          </h2>
          <motion.div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-12 shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-3xl font-semibold mb-6 text-blue-400">Frontend</h3>
                <ul className="space-y-4 text-xl text-gray-900 text-left">
                  <li>⚛️ React.js</li>
                  <li>🎨 Tailwind CSS</li>
                  <li>✨ Framer Motion</li>
                  <li>🌠 tsparticles</li>
                </ul>
              </div>
              <div>
                <h3 className="text-3xl font-semibold mb-6 text-blue-400">Backend & AI</h3>
                <ul className="space-y-4 text-xl text-gray-900 text-left">
                  <li>🤖 Gemini AI API</li>
                  <li>🔥 Firebase Auth</li>
                  <li>💾 Firestore Database</li>
                  <li>🚀 Vercel Deployment</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* How It Works Section */}
      {activeSection === 'how it works' && (
        <motion.div className="mt-20 text-center" {...fadeInUp}>
          <h2 className="text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            How QuizGen Works
          </h2>
          <motion.div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            {['Choose', 'Create', 'Take', 'Learn', 'Improve'].map((step, index) => (
              <motion.div 
                key={index}
                className="bg-white bg-opacity-10 backdrop-blur-lg rounded-full w-32 h-32 flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.5)' }}
              >
                <span className="text-2xl font-bold">{step}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Future Enhancements Section */}
      {activeSection === 'future' && (
        <motion.div className="mt-20 text-center" {...fadeInUp}>
          <h2 className="text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Future Enhancements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {futureEnhancements.map((enhancement, index) => (
              <motion.div 
                key={index}
                className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl text-blue-400 mb-4">{enhancement.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{enhancement.title}</h3>
                <p className="text-gray-900">{enhancement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div 
        className="mt-32 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold mb-6">Ready to Revolutionize Your Learning?</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 px-8 rounded-full transition-colors duration-300">
          Get Started Now
        </button>
      </motion.div>
      
    </div>

  );
};

export default FeaturePage;
