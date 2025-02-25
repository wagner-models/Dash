import { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Button,
  Input,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Code,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { DeploymentService } from '../../services/deployment/deploymentService';

const DeploymentPanel = ({ contractCode }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [deploying, setDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState(null);
  const [costEstimate, setCostEstimate] = useState(null);
  const toast = useToast();
  
  const deploymentService = new DeploymentService(connection, wallet);

  const handleEstimateCost = async () => {
    try {
      const estimate = await deploymentService.estimateDeploymentCost(contractCode);
      setCostEstimate(estimate);
    } catch (error) {
      toast({
        title: 'Estimation Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeploy = async () => {
    if (!wallet.connected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to deploy the contract',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setDeploying(true);
      const result = await deploymentService.deployContract(contractCode);
      setDeploymentResult(result);
      
      toast({
        title: 'Deployment Successful',
        description: `Program ID: ${result.programId}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Deployment Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setDeploying(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch" w="full">
      <Heading size="md">Deploy Contract</Heading>

      <Button
        colorScheme="blue"
        onClick={handleEstimateCost}
        isDisabled={!contractCode}
      >
        Estimate Deployment Cost
      </Button>

      {costEstimate && (
        <Box borderWidth="1px" borderRadius="lg" p={4}>
          <Stat>
            <StatLabel>Estimated Cost</StatLabel>
            <StatNumber>{costEstimate.estimatedSol} SOL</StatNumber>
            <StatHelpText>Program Size: {costEstimate.programSize} bytes</StatHelpText>
          </Stat>
        </Box>
      )}

      <Button
        colorScheme="green"
        onClick={handleDeploy}
        isLoading={deploying}
        loadingText="Deploying..."
        isDisabled={!contractCode || !wallet.connected}
      >
        Deploy Contract
      </Button>

      {deploymentResult && (
        <Box borderWidth="1px" borderRadius="lg" p={4}>
          <Text fontWeight="bold" mb={2}>Deployment Result:</Text>
          <Code p={3} borderRadius="md" display="block" whiteSpace="pre-wrap">
            {JSON.stringify(deploymentResult, null, 2)}
          </Code>
        </Box>
      )}
    </VStack>
  );
};

export default DeploymentPanel; 