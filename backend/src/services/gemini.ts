import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

export async function askGemini(question: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  // Read the README for context
  const readmePath = path.join(process.cwd(), '..', 'README.md');
  let readmeContent = '';

  try {
    readmeContent = fs.readFileSync(readmePath, 'utf-8');
    console.log('README.md loaded successfully');
  } catch (err) {
    console.warn('README.md not found or unreadable. Proceeding without it.');
  }

  const prompt = `You are an AI assistant for the SurgeVenger medical application.
This app helps track surgery patient status in real-time.

Here is the README for additional context:
${readmeContent}
---
User Question: ${question}

Please provide helpful, concise answers about navigating and using this application.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get response from Gemini API');
  }
}
