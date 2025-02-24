import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Grid,
  Box,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useToast
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { AnalyticsService } from '../services/analyticsService';
import ActivityFeed from './ActivityFeed';
import NFTValueChart from './NFTValueChart';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { connection } = useConnection();
  const wallet = useWallet();
  const toast = useToast();
  const analyticsService = new AnalyticsService(connection, wallet);

  useEffect(() => {
    if (wallet.connected) {
      loadDashboardStats();
    }
  }, [wallet.connected]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const dashboardStats = await analyticsService.getDashboardStats();
      setStats(dashboardStats);
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

  return (
    <VStack spacing={8} w="full">
      <Heading>Dashboard</Heading>

      <Grid templateColumns="repeat(4, 1fr)" gap={6} w="full">
        <Stat>
          <StatLabel>Wallet Balance</StatLabel>
          <StatNumber>{stats?.balance.toFixed(2)} SOL</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>NFTs Owned</StatLabel>
          <StatNumber>{stats?.nftStats.owned}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>NFTs Listed</StatLabel>
          <StatNumber>{stats?.nftStats.listed}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Value</StatLabel>
          <StatNumber>{stats?.nftStats.totalValue} SOL</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>
      </Grid>

      <Grid templateColumns="2fr 1fr" gap={8} w="full">
        <Box>
          <Heading size="md" mb={4}>NFT Value Over Time</Heading>
          <NFTValueChart />
        </Box>
        <Box>
          <Heading size="md" mb={4}>Recent Activity</Heading>
          <ActivityFeed activities={stats?.recentActivity || []} />
        </Box>
      </Grid>
    </VStack>
  );
};

export default Dashboard; 