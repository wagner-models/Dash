import { Box, Button, Text, VStack } from '@chakra-ui/react';

const PluginManagement = ({ plugins, onEdit, onDelete }) => {
  return (
    <VStack spacing={4} align="stretch">
      {plugins.map((plugin) => (
        <Box key={plugin.id} borderWidth="1px" borderRadius="lg" p="4">
          <Text fontWeight="bold">{plugin.name}</Text>
          <Text>{plugin.description}</Text>
          <Button colorScheme="blue" mt="2" onClick={() => onEdit(plugin)}>
            Edit
          </Button>
          <Button colorScheme="red" mt="2" ml="2" onClick={() => onDelete(plugin.id)}>
            Delete
          </Button>
        </Box>
      ))}
    </VStack>
  );
};

export default PluginManagement; 