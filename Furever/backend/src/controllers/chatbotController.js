import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const getChatResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful pet adoption assistant. You help users find their perfect pet match and answer questions about pet adoption, care, and the adoption process. Keep responses concise and friendly."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "gpt-3.5-turbo",
    });

    const response = completion.choices[0].message.content;

    res.json({ response });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Failed to get response from chatbot' });
  }
}; 