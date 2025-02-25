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
  List,
  ListItem,
  ListIcon,
  Divider
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { OpenAIService } from '../../services/ai/openaiService';

const CodeAnalyzer = () => {
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const openAIService = new OpenAIService();

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide contract code to analyze',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const result = await openAIService.analyzeContract(code);
      setAnalysis(result);
    } catch (error) {
      toast({
        title: 'Analysis Failed',
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
      <Heading size="lg">Smart Contract Analyzer</Heading>
      
      <Box>
        <Text mb={2}>Paste your Solana contract code:</Text>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your Solana smart contract code here..."
          size="lg"
          rows={10}
          fontFamily="mono"
        />
      </Box>

      <Button
        colorScheme="blue"
        onClick={handleAnalyze}
        isLoading={loading}
        loadingText="Analyzing..."
      >
        Analyze Contract
      </Button>

      {analysis && (
        <Box borderWidth="1px" borderRadius="lg" p={4}>
          <Text mb={4} fontWeight="bold">Analysis Results:</Text>
          <Code p={4} borderRadius="md" whiteSpace="pre-wrap">
            {analysis}
          </Code>
        </Box>
      )}
    </VStack>
  );
};

export default CodeAnalyzer; 