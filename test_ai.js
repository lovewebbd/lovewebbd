import { GoogleGenAI, Type } from '@google/genai';
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function test() {
  try {
    const prompt = `The user wants to build a website.
Idea: "restaurant"
Package: Regular.
You MUST generate detailed descriptions for exactly 4 pages (e.g., Home, About, Services, Contact, etc.).
Make the descriptions detailed and tailored to the idea. Write in Bengali (বাংলা).

Return a JSON array of strings, where each string is the detailed description of a specific page. The length of the array must be exactly 4.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite", // fallback
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          },
          description: "An array of page descriptions in Bengali."
        }
      }
    });

    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}
test();
