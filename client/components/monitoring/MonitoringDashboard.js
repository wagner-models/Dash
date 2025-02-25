import { useState, useEffect, useRef } from 'react';
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast
} from '@chakra-ui/react';
import { useConnection } from '@solana/wallet-adapter-react';
import { MonitoringService } from '../../services/monitoring/monitoringService';

const MonitoringDashboard = ({ programId }) => {
  const { connection } = useConnection();
  const [metrics, setMetrics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const toast = useToast();
  const monitoringService = useRef(new MonitoringService(connection));

  useEffect(() => {
    if (programId) {
      startMonitoring();
      return () => {
        monitoringService.current.stopMonitoring(programId);
      };
    }
  }, [programId]);

  const startMonitoring = async () => {
    try {
      const initialMetrics = await monitoringService.current.startMonitoring(programId);
      setMetrics(initialMetrics);
      setTransactions(initialMetrics.transactions);

      // Set up alerts
      monitoringService.current.setAlert(
        (metrics) => metrics.computeUnits.peak > 200000,
        () => {
          toast({
            title: 'High Compute Usage',
            description: 'Program is experiencing high compute unit usage',
            status: 'warning',
            duration: null,
            isClosable: true,
          });
        }
      );
    } catch (error) {
      toast({
        title: 'Monitoring Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!metrics) return null;

  return (
    <VStack spacing={6} align="stretch" w="full">
      <Heading size="lg">Program Monitor</Heading>

      <SimpleGrid columns={4} spacing={4}>
        <Stat>
          <StatLabel>Active Accounts</StatLabel>
          <StatNumber>{metrics.accountCount}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Total Data Size</StatLabel>
          <StatNumber>{(metrics.totalDataSize / 1024).toFixed(2)} KB</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Compute Units</StatLabel>
          <StatNumber>{metrics.computeUnits.average}</StatNumber>
          <StatHelpText>Average per transaction</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Peak Usage</StatLabel>
          <StatNumber>{metrics.computeUnits.peak}</StatNumber>
          <StatHelpText>Maximum compute units</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Box>
        <Heading size="md" mb={4}>Recent Transactions</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Signature</Th>
              <Th>Slot</Th>
              <Th>Time</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map(tx => (
              <Tr key={tx.signature}>
                <Td>{tx.signature.slice(0, 8)}...</Td>
                <Td>{tx.slot}</Td>
                <Td>{new Date(tx.timestamp * 1000).toLocaleString()}</Td>
                <Td>
                  <Badge colorScheme={tx.error ? 'red' : 'green'}>
                    {tx.error ? 'Failed' : 'Success'}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default MonitoringDashboard; 