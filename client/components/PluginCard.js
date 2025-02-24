import { Box, Button, Text } from '@chakra-ui/react';

const PluginCard = ({ plugin, onPurchase }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="6">
      <Text fontWeight="bold" fontSize="xl">{plugin.name}</Text>
      <Text mt="2">{plugin.description}</Text>
      <Button mt="4" colorScheme="teal" onClick={() => onPurchase(plugin)}>
        Purchase
      </Button>
    </Box>
  );
};

export default PluginCard; 