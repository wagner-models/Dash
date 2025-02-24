import { useState, useEffect } from 'react';
import {
  VStack,
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Badge,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { HistoryService } from '../services/historyService';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { connection } = useConnection();
  const wallet = useWallet();
  const toast = useToast();
  const historyService = new HistoryService(connection, wallet);

  useEffect(() => {
    if (wallet.connected) {
      loadTransactionHistory();
    }
  }, [wallet.connected]);

  const loadTransactionHistory = async () => {
    try {
      setLoading(true);
      const history = await historyService.getTransactionHistory();
      setTransactions(history);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'green';
      case 'processing': return 'yellow';
      default: return 'red';
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <VStack spacing={4} w="full">
      <Box overflowX="auto" w="full">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Amount (SOL)</Th>
              <Th>Status</Th>
              <Th>Signature</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((tx) => (
              <Tr key={tx.signature}>
                <Td>{tx.timestamp.toLocaleString()}</Td>
                <Td>
                  <Badge colorScheme={tx.type === 'nft' ? 'purple' : 'blue'}>
                    {tx.type}
                  </Badge>
                </Td>
                <Td>{tx.amount.toFixed(4)}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(tx.status)}>
                    {tx.status}
                  </Badge>
                </Td>
                <Td>
                  <Link 
                    href={`https://explorer.solana.com/tx/${tx.signature}`}
                    isExternal
                    color="blue.500"
                  >
                    {tx.signature.slice(0, 8)}...
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default TransactionHistory; 