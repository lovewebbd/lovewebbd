import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function list() {
  try {
    const response = await ai.models.list();
    for (const model of response.items) {
      console.log(model.name);
    }
  } catch (e) {
    console.error(e);
  }
}
list();
