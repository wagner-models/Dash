import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Remove NEXT_PUBLIC_ prefix
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a smart contract security expert. Analyze the provided Solana contract code for security issues and optimization opportunities."
        },
        {
          role: "user",
          content: `Analyze this smart contract:\n${code}`
        }
      ],
      temperature: 0.7,
    });

    res.status(200).json({ content: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Error analyzing contract' });
  }
} 