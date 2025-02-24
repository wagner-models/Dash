import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Button,
  useToast
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { ReportService } from '../services/reportService';
import NFTValueChart from './NFTValueChart';
import CollectionPerformance from './CollectionPerformance';

const AnalyticsReport = () => {
  const [portfolioReport, setPortfolioReport] = useState(null);
  const [marketReport, setMarketReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { connection } = useConnection();
  const wallet = useWallet();
  const toast = useToast();
  const reportService = new ReportService(connection, wallet);

  useEffect(() => {
    if (wallet.connected) {
      loadReports();
    }
  }, [wallet.connected]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [portfolio, market] = await Promise.all([
        reportService.generatePortfolioReport(),
        reportService.generateMarketReport()
      ]);
      setPortfolioReport(portfolio);
      setMarketReport(market);
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
      <Heading>Analytics Reports</Heading>

      <Tabs w="full">
        <TabList>
          <Tab>Portfolio Analysis</Tab>
          <Tab>Market Overview</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={6}>
              <SimpleGrid columns={4} spacing={6} w="full">
                <Stat>
                  <StatLabel>Total Value</StatLabel>
                  <StatNumber>{portfolioReport?.summary.totalValue} SOL</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    23.36%
                  </StatHelpText>
                </Stat>
                {/* More portfolio stats */}
              </SimpleGrid>

              <Box w="full">
                <Heading size="md" mb={4}>Value Over Time</Heading>
                <NFTValueChart />
              </Box>

              <Box w="full">
                <Heading size="md" mb={4}>Collection Performance</Heading>
                <CollectionPerformance collections={portfolioReport?.collections} />
              </Box>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6}>
              <SimpleGrid columns={4} spacing={6} w="full">
                <Stat>
                  <StatLabel>Market Volume</StatLabel>
                  <StatNumber>{marketReport?.marketOverview.totalVolume} SOL</StatNumber>
                </Stat>
                {/* More market stats */}
              </SimpleGrid>

              {/* Market charts and tables */}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default AnalyticsReport; 