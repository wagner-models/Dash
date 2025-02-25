import { useState, useEffect, useRef } from 'react';
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Button,
  Code,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  IconButton,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useConnection } from '@solana/wallet-adapter-react';
import { DebugService } from '../../services/sandbox/debugService';

const DebugPanel = ({ programId }) => {
  const { connection } = useConnection();
  const [logs, setLogs] = useState([]);
  const [breakpoints, setBreakpoints] = useState([]);
  const [newBreakpoint, setNewBreakpoint] = useState('');
  const [selectedVariable, setSelectedVariable] = useState('');
  const [variableState, setVariableState] = useState(null);
  const toast = useToast();
  const debugService = useRef(new DebugService(connection));

  useEffect(() => {
    if (programId) {
      initializeDebugger();
    }
    return () => {
      // Cleanup subscriptions
    };
  }, [programId]);

  const initializeDebugger = async () => {
    try {
      await debugService.current.attachDebugger(programId);
      updateLogs();
    } catch (error) {
      toast({
        title: 'Debug Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const updateLogs = () => {
    setLogs(debugService.current.getLogs());
  };

  const addBreakpoint = () => {
    if (!newBreakpoint.trim()) return;

    try {
      const condition = new Function('debugInfo', newBreakpoint);
      const id = debugService.current.setBreakpoint(condition, (debugInfo) => {
        toast({
          title: 'Breakpoint Hit',
          description: 'Program execution paused',
          status: 'info',
          duration: null,
          isClosable: true,
        });
      });

      setBreakpoints([...breakpoints, { id, condition: newBreakpoint }]);
      setNewBreakpoint('');
    } catch (error) {
      toast({
        title: 'Invalid Breakpoint',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const removeBreakpoint = (id) => {
    debugService.current.removeBreakpoint(id);
    setBreakpoints(breakpoints.filter(bp => bp.id !== id));
  };

  const inspectVariable = async () => {
    try {
      const state = await debugService.current.getVariableState(selectedVariable);
      setVariableState(state);
    } catch (error) {
      toast({
        title: 'Inspection Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={6} align="stretch" w="full">
      <Heading size="lg">Debug Panel</Heading>

      <Tabs>
        <TabList>
          <Tab>Logs</Tab>
          <Tab>Breakpoints</Tab>
          <Tab>Variables</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <Button onClick={() => debugService.current.clearLogs()}>
                Clear Logs
              </Button>
              <Box maxH="400px" overflowY="auto">
                {logs.map((log, index) => (
                  <Code key={index} p={2} my={1} display="block">
                    {new Date(log.timestamp).toISOString()}: {log.logs.join('\n')}
                  </Code>
                ))}
              </Box>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <HStack>
                <Input
                  value={newBreakpoint}
                  onChange={(e) => setNewBreakpoint(e.target.value)}
                  placeholder="Enter breakpoint condition"
                />
                <IconButton
                  icon={<AddIcon />}
                  onClick={addBreakpoint}
                  aria-label="Add breakpoint"
                />
              </HStack>

              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Condition</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {breakpoints.map(bp => (
                    <Tr key={bp.id}>
                      <Td>{bp.condition}</Td>
                      <Td>
                        <IconButton
                          icon={<DeleteIcon />}
                          onClick={() => removeBreakpoint(bp.id)}
                          aria-label="Remove breakpoint"
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <HStack>
                <Input
                  value={selectedVariable}
                  onChange={(e) => setSelectedVariable(e.target.value)}
                  placeholder="Enter account address"
                />
                <Button onClick={inspectVariable}>Inspect</Button>
              </HStack>

              {variableState && (
                <Box borderWidth="1px" p={4} borderRadius="md">
                  <Text fontWeight="bold">Variable State:</Text>
                  <Code display="block" whiteSpace="pre" mt={2}>
                    {JSON.stringify(variableState, null, 2)}
                  </Code>
                </Box>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default DebugPanel; 