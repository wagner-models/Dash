import { Box, Container, VStack, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import ContractGenerator from '../components/ai/ContractGenerator';
import CodeAnalyzer from '../components/ai/CodeAnalyzer';
import ContractSimulator from '../components/sandbox/ContractSimulator';
import PluginManager from '../components/sandbox/PluginManager';
import MonitoringDashboard from '../components/monitoring/MonitoringDashboard';

export default function Home() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Tabs width="100%">
          <TabList>
            <Tab>Contract Generator</Tab>
            <Tab>Code Analyzer</Tab>
            <Tab>Simulator</Tab>
            <Tab>Plugins</Tab>
            <Tab>Monitor</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ContractGenerator />
            </TabPanel>
            <TabPanel>
              <CodeAnalyzer />
            </TabPanel>
            <TabPanel>
              <ContractSimulator />
            </TabPanel>
            <TabPanel>
              <PluginManager />
            </TabPanel>
            <TabPanel>
              <MonitoringDashboard />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
} 