import { useState } from 'react';
import {
  VStack,
  Box,
  Textarea,
  Button,
  Text,
  useToast,
  Code,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { OpenAIService } from '../../services/ai/openaiService';

const ContractGenerator = () => {
  const [description, setDescription] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const toast = useToast();
  const openAIService = new OpenAIService();

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a contract description',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setErrorDetails(null);
      const response = await fetch('/api/generate-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to generate contract');
      }

      setGeneratedContract(data.content);
    } catch (error) {
      setError(error.message);
      setErrorDetails(error);
      toast({
        title: 'Generation Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch" w="full">
      <Heading size="lg">AI Smart Contract Generator</Heading>
      
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Generation Failed</AlertTitle>
          <AlertDescription>
            {error}
            {errorDetails && (
              <Code mt={2} display="block" whiteSpace="pre-wrap">
                {JSON.stringify(errorDetails, null, 2)}
              </Code>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Box>
        <Text mb={2}>Describe your smart contract requirements:</Text>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Example: Create a token vesting contract with a 6-month cliff and 2-year linear vesting schedule"
          size="lg"
          rows={6}
        />
      </Box>

      <Button
        colorScheme="purple"
        onClick={handleGenerate}
        isLoading={loading}
        loadingText="Generating..."
      >
        Generate Contract
      </Button>

      {generatedContract && (
        <Box>
          <Text mb={2} fontWeight="bold">Generated Smart Contract:</Text>
          <Code p={4} borderRadius="md" whiteSpace="pre-wrap">
            {generatedContract}
          </Code>
        </Box>
      )}
    </VStack>
  );
};

export default ContractGenerator; 