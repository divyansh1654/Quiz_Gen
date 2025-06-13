export const AI_PROMPT = `
Generate a detailed learning guide for the exam: {examName}.
Syllabus: {syllabus}.
Difficulty Level: {difficultyLevel}.

Provide the following:
1. Key Concepts: A detailed explanation of the core concepts.
2. Study Strategies: A list of effective study strategies.
3. Importance in Exams: Explain why this topic is important for the exam.

Return only JSON. No additional text outside JSON format.
`;
