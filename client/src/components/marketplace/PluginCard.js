import { Box, Heading, Text, Button, VStack, Badge, HStack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { purchasePlugin } from '../../utils/marketplace';

export default function PluginCard({ plugin }) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const toast = useToast();

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const result = await purchasePlugin(plugin);
      toast({
        title: result.success ? 'Success!' : 'Error',
        description: result.message,
        status: result.success ? 'success' : 'error',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to purchase plugin',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setIsPurchasing(false);
  };

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      p={6}
      _hover={{ 
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
        transition: 'all 0.2s'
      }}
    >
      <VStack align="start" spacing={4}>
        <Badge colorScheme="purple">{plugin.category}</Badge>
        <Heading size="md">{plugin.name}</Heading>
        <Text color="gray.600">{plugin.description}</Text>
        <HStack justify="space-between" width="100%">
          <Text fontWeight="bold" fontSize="lg">{plugin.price}</Text>
          <Button 
            colorScheme="purple" 
            size="md"
            isLoading={isPurchasing}
            onClick={handlePurchase}
            _hover={{
              transform: 'scale(1.05)'
            }}
          >
            Purchase
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
} 