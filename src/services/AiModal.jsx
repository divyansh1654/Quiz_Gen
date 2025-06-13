import { GoogleGenerativeAI } from "@google/generative-ai";


const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-05-20",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "You are an expert quiz generator. Create multiple-choice questions (MCQs) based on the following quiz details:\n\nExam Name: {examName}\nTopic/Syllabus: {syllabus}\nNumber of Questions: {numQuestions}\nTimer per Quiz: {timer} minutes\nDifficulty Level: {difficultyLevel} (Easy / Medium / Hard)\nEach question should have:\n\nFour answer options (A, B, C, D)\nOne correct answer\nAn explanation for the correct answer\nReturn the response in a structured but concise manner. In JSON format only\n"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"examName\": \"Introduction to Python Programming\",\n  \"syllabus\": \"Basic syntax, data types, control flow, functions\",\n  \"numQuestions\": 5,\n  \"timer\": 10,\n  \"difficultyLevel\": \"Easy\",\n  \"questions\": [\n    {\n      \"question\": \"What is the correct way to print 'Hello, World!' in Python?\",\n      \"options\": {\n        \"A\": \"print 'Hello, World!'\",\n        \"B\": \"Console.WriteLine('Hello, World!')\",\n        \"C\": \"System.out.println('Hello, World!')\",\n        \"D\": \"print('Hello, World!')\"\n      },\n      \"answer\": \"D\",\n      \"explanation\": \"The `print()` function in Python requires parentheses around the argument.\"\n    },\n    {\n      \"question\": \"Which of the following is a valid data type in Python?\",\n      \"options\": {\n        \"A\": \"integer\",\n        \"B\": \"float\",\n        \"C\": \"string\",\n        \"D\": \"All of the above\"\n      },\n      \"answer\": \"D\",\n      \"explanation\": \"Python supports integers, floats (floating-point numbers), and strings as fundamental data types.\"\n    },\n    {\n      \"question\": \"What will be the output of the following code: `x = 5; if x > 3: print('Greater') else: print('Smaller')`?\",\n      \"options\": {\n        \"A\": \"Greater\",\n        \"B\": \"Smaller\",\n        \"C\": \"Error\",\n        \"D\": \"None\"\n      },\n      \"answer\": \"A\",\n      \"explanation\": \"The `if` statement checks if `x` (which is 5) is greater than 3. Since it is, the code inside the `if` block is executed, printing 'Greater'.\"\n    },\n    {\n      \"question\": \"Which keyword is used to define a function in Python?\",\n      \"options\": {\n        \"A\": \"function\",\n        \"B\": \"define\",\n        \"C\": \"def\",\n        \"D\": \"func\"\n      },\n      \"answer\": \"C\",\n      \"explanation\": \"The `def` keyword is used to begin the definition of a function in Python.\"\n    },\n    {\n      \"question\": \"What does the `//` operator do in Python?\",\n      \"options\": {\n        \"A\": \"Division\",\n        \"B\": \"Floor Division\",\n        \"C\": \"Exponentiation\",\n        \"D\": \"Modulo\"\n      },\n      \"answer\": \"B\",\n      \"explanation\": \"The `//` operator performs floor division, which returns the integer part of the quotient.\"\n    }\n  ]\n}\n```"},
      ],
    },
  ],
});

