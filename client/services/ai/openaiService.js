export class OpenAIService {
  async generateSmartContract(description) {
    try {
      const response = await fetch('/api/generate-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate contract');
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error generating smart contract:', error);
      throw error;
    }
  }

  async analyzeContract(code) {
    try {
      const response = await fetch('/api/analyze-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze contract');
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error analyzing contract:', error);
      throw error;
    }
  }
} 