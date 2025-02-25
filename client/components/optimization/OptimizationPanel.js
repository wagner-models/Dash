import { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Button,
  Progress,
  List,
  ListItem,
  ListIcon,
  Badge,
  useToast,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, InfoIcon } from '@chakra-ui/icons';
import { OptimizationService } from '../../services/optimization/optimizationService';

const OptimizationPanel = ({ contractCode }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const toast = useToast();
  const optimizationService = new OptimizationService();

  const handleAnalyze = async () => {
    if (!contractCode) {
      toast({
        title: 'No Contract Code',
        description: 'Please generate or input a contract to analyze',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setAnalyzing(true);
      const analysisResults = await optimizationService.analyzeContract(contractCode);
      setResults(analysisResults);
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  return (
    <VStack spacing={6} align="stretch" w="full">
      <Heading size="md">Contract Optimization</Heading>

      <Button
        colorScheme="teal"
        onClick={handleAnalyze}
        isLoading={analyzing}
        loadingText="Analyzing..."
        isDisabled={!contractCode}
      >
        Analyze & Optimize
      </Button>

      {results && (
        <>
          <SimpleGrid columns={3} spacing={4}>
            <Stat>
              <StatLabel>Storage Efficiency</StatLabel>
              <StatNumber>{results.metrics.storageEfficiency}%</StatNumber>
              <Progress value={results.metrics.storageEfficiency} colorScheme="green" />
            </Stat>

            <Stat>
              <StatLabel>Compute Efficiency</StatLabel>
              <StatNumber>{results.metrics.computeEfficiency}%</StatNumber>
              <Progress value={results.metrics.computeEfficiency} colorScheme="blue" />
            </Stat>

            <Stat>
              <StatLabel>Security Score</StatLabel>
              <StatNumber>{results.metrics.securityScore}%</StatNumber>
              <Progress value={results.metrics.securityScore} colorScheme="purple" />
            </Stat>
          </SimpleGrid>

          <Box>
            <Heading size="sm" mb={3}>Optimization Suggestions:</Heading>
            <List spacing={3}>
              {results.suggestions.map((suggestion, index) => (
                <ListItem key={index}>
                  <HStack>
                    <ListIcon 
                      as={suggestion.severity === 'critical' ? WarningIcon : InfoIcon} 
                      color={getSeverityColor(suggestion.severity)} 
                    />
                    <Text>{suggestion.message}</Text>
                    <Badge colorScheme={getSeverityColor(suggestion.severity)}>
                      {suggestion.severity}
                    </Badge>
                  </HStack>
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
    </VStack>
  );
};

export default OptimizationPanel; 