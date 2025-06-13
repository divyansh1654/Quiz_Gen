export const AI_PROMPT = `
ou are an expert quiz generator. Create multiple-choice questions (MCQs) based on the following quiz details:

Exam Name: {examName}
Topic/Syllabus: {syllabus}
Number of Questions: {numQuestions}
Timer per Quiz: {timer} minutes
Difficulty Level: {difficultyLevel} (Easy / Medium / Hard)
Each question should have:

Four answer options (A, B, C, D)
One correct answer
An explanation for the correct answer
Return the response in a structured but concise manner. In JSON format only ,ensure that it is a valid JSON string without any extra characters
`;
