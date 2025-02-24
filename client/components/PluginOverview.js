import { Box, Text, VStack } from '@chakra-ui/react';

const PluginOverview = ({ plugins }) => {
  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold">Purchased Plugins</Text>
      <VStack spacing={4} align="stretch">
        {plugins.map((plugin) => (
          <Box key={plugin.id} borderWidth="1px" borderRadius="lg" p="4">
            <Text>{plugin.name}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default PluginOverview; 