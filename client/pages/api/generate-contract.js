import OpenAI from 'openai';

// Mock response for development
const MOCK_MODE = true; // Set to false when you want to use real OpenAI API

const mockGenerateContract = (description) => {
  return `// Mock Solana contract generated for: ${description}
use anchor_lang::prelude::*;

declare_id!("your_program_id");

#[program]
pub mod basic_token {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn mint(ctx: Context<Mint>, amount: u64) -> Result<()> {
        Ok(())
    }

    pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Mint<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub user: Signer<'info>,
}

#[account]
pub struct TokenAccount {
    pub balance: u64,
}`;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { description } = req.body;

  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Invalid description provided' });
  }

  try {
    if (MOCK_MODE) {
      // Use mock response
      const mockContent = mockGenerateContract(description);
      return res.status(200).json({ content: mockContent });
    }

    // Real OpenAI API call
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a Solana smart contract expert. Generate secure, optimized smart contract code based on requirements."
        },
        {
          role: "user",
          content: description
        }
      ],
      temperature: 0.7,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    res.status(200).json({ content: response.choices[0].message.content });
  } catch (error) {
    console.error('Full OpenAI API error:', error);
    
    res.status(500).json({ 
      error: 'Failed to generate contract',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        stack: error.stack,
        cause: error.cause
      } : undefined
    });
  }
} 