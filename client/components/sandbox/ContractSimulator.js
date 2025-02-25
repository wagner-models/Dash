import { useState, useEffect } from 'react';
import {
  VStack,
  Box,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Code
} from '@chakra-ui/react';
import { useConnection } from '@solana/wallet-adapter-react';
import { ContractSimulationService } from '../../services/sandbox/contractSimulationService';

const ContractSimulator = () => {
  const { connection } = useConnection();
  const [programId, setProgramId] = useState('');
  const [instructions, setInstructions] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const simulationService = new ContractSimulationService(connection);

  const handleSimulate = async () => {
    if (!programId.trim() || !instructions.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide both program ID and instructions',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      
      // First validate the program
      const programValidation = await simulationService.validateProgram(programId);
      
      if (!programValidation.exists) {
        throw new Error('Program does not exist on chain');
      }

      // Parse instructions (simplified for example)
      const parsedInstructions = JSON.parse(instructions);
      
      // Run simulation
      const result = await simulationService.simulateContract(
        programId,
        parsedInstructions
      );

      setSimulationResult(result);
    } catch (error) {
      toast({
        title: 'Simulation Failed',
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
      <Heading size="lg">Contract Simulator</Heading>

      <Box>
        <Text mb={2}>Program ID:</Text>
        <Input
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
          placeholder="Enter Solana program ID"
        />
      </Box>

      <Box>
        <Text mb={2}>Instructions (JSON format):</Text>
        <Textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Enter program instructions in JSON format"
          rows={6}
          fontFamily="mono"
        />
      </Box>

      <Button
        colorScheme="purple"
        onClick={handleSimulate}
        isLoading={loading}
        loadingText="Simulating..."
      >
        Run Simulation
      </Button>

      {simulationResult && (
        <Box borderWidth="1px" borderRadius="lg" p={4}>
          <Heading size="md" mb={4}>Simulation Results</Heading>
          
          <Table variant="simple" size="sm">
            <Tbody>
              <Tr>
                <Td fontWeight="bold">Status:</Td>
                <Td>
                  <Badge colorScheme={simulationResult.success ? 'green' : 'red'}>
                    {simulationResult.success ? 'Success' : 'Failed'}
                  </Badge>
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Compute Units:</Td>
                <Td>{simulationResult.units}</Td>
              </Tr>
            </Tbody>
          </Table>

          <Text mt={4} mb={2} fontWeight="bold">Execution Logs:</Text>
          <Code p={3} borderRadius="md" display="block" whiteSpace="pre">
            {simulationResult.logs?.join('\n')}
          </Code>

          {simulationResult.error && (
            <>
              <Text mt={4} mb={2} fontWeight="bold" color="red.500">
                Error Details:
              </Text>
              <Code p={3} borderRadius="md" display="block" whiteSpace="pre">
                {JSON.stringify(simulationResult.error, null, 2)}
              </Code>
            </>
          )}
        </Box>
      )}
    </VStack>
  );
};

export default ContractSimulator; 