import { askGemini, testGemini } from '../services/gemini';
import { Request, Response } from 'express';

// Test function using the @google/generative-ai package
export const testApiKey = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const answer = await testGemini();
    return res.json({ success: true, answer });
  } catch (err: any) {
    console.error('API Key test failed:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Unknown error occurred',
    });
  }
};

export const geminiRouter = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const answer = await askGemini(question);
    return res.json({ answer });
  } catch (err: any) {
    console.error('Gemini error:', err);
    return res
      .status(500)
      .json({ error: err.message || 'Something went wrong with Gemini API' });
  }
};
