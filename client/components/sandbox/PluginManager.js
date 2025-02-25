import { useState, useEffect } from 'react';
import {
  VStack,
  Box,
  Heading,
  Text,
  Button,
  Switch,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton
} from '@chakra-ui/react';
import { PluginService } from '../../services/sandbox/pluginService';

const PluginManager = () => {
  const [plugins, setPlugins] = useState([]);
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();
  const pluginService = new PluginService();

  useEffect(() => {
    loadPlugins();
  }, []);

  const loadPlugins = () => {
    const installedPlugins = pluginService.getPlugins();
    setPlugins(installedPlugins);
  };

  const handleTogglePlugin = async (pluginId, enabled) => {
    try {
      pluginService.togglePlugin(pluginId, enabled);
      loadPlugins();
      
      toast({
        title: enabled ? 'Plugin Enabled' : 'Plugin Disabled',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleViewDetails = (plugin) => {
    setSelectedPlugin(plugin);
    setIsModalOpen(true);
  };

  return (
    <VStack spacing={6} align="stretch" w="full">
      <Heading size="lg">Plugin Manager</Heading>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Version</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {plugins.map(plugin => (
            <Tr key={plugin.id}>
              <Td>{plugin.name}</Td>
              <Td>{plugin.version}</Td>
              <Td>
                <Badge colorScheme={plugin.enabled ? 'green' : 'gray'}>
                  {plugin.enabled ? 'Active' : 'Disabled'}
                </Badge>
              </Td>
              <Td>
                <Switch
                  isChecked={plugin.enabled}
                  onChange={(e) => handleTogglePlugin(plugin.id, e.target.checked)}
                  mr={4}
                />
                <Button
                  size="sm"
                  onClick={() => handleViewDetails(plugin)}
                >
                  Details
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedPlugin?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="bold">Version:</Text>
                <Text>{selectedPlugin?.version}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Description:</Text>
                <Text>{selectedPlugin?.description}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Author:</Text>
                <Text>{selectedPlugin?.author}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Hooks:</Text>
                <Text>{selectedPlugin?.hooks?.length || 0} registered</Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default PluginManager; 