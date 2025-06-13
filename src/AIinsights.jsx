import React, { useEffect } from 'react';
import TextTransition, { presets } from "react-text-transition";
// import CreateMan from "./CreateMan";

const AIInsights = () => {
  const [textIndex, setTextIndex] = React.useState(0);

  const TEXTS = [
    "Create engaging quizzes effortlessly with our AI-powered generator.",
    "Customize your quizzes with multiple question types and multimedia elements.",
    "Track progress and analyze results in real-time for better insights.",
    "Prevent cheating with our advanced proctoring features.",
    "Integrate seamlessly with popular learning management systems."
  ];

  useEffect(() => {
    const intervalId = setInterval(
      () => setTextIndex(index => index + 1),
      3000 // every 3 seconds
    );
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-16">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">AI Assistant Insights</h2>
      <div className="bg-gray-700 p-6 rounded-lg">
        <TextTransition springConfig={presets.wobbly}>
          {TEXTS[textIndex % TEXTS.length]}
        </TextTransition>
      </div>
      {/* <CreateMan /> */}
    </div>
  );
};

export default AIInsights;
