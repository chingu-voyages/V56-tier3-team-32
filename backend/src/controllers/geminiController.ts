import { askGemini } from '../services/gemini';
import { Request, Response } from 'express';

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