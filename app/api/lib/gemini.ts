import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

interface GenerateRevisionNoteParams {
  problemName: string;
  language?: string;
  sourceCode: string;
}

export async function generateRevisionNote({
  problemName,
  language = 'Unspecified',
  sourceCode,
}: GenerateRevisionNoteParams): Promise<string> {
  const prompt = `
You are an expert DSA mentor. Analyze the following solution for the DSA problem "${problemName}".

Language: ${language}
Code:
\`\`\`${language}${sourceCode}
\`\`\`

Generate a clear, high-yield revision note tailored for quick review:
1. **Core Intuition / Approach**: 2-3 sentences explaining the core logic and pattern used (e.g., Two Pointers, Monotonic Stack, DP state).
2. **Key Steps & Invariants**: Bullet points summarizing the algorithm's critical steps.
3. **Complexity**: Time and Space Complexity with brief justifications.
4. **Edge Cases & Gotchas**: Subtle edge cases handled or things to watch out for.

Keep it concise, structured, and easy to read in 60 seconds.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: prompt,
  });

  return response.text ?? '';
}