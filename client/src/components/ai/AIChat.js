import { Box, VStack, Input, Button } from '@chakra-ui/react';
import { useState } from 'react';

export default function AIChat() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // AI chat functionality will be implemented here
    console.log('Message sent:', message);
    setMessage('');
  };

  return (
    <Box>
      <VStack spacing={4}>
        <Box w="100%" h="400px" borderWidth="1px" borderRadius="lg" p={4}>
          {/* Chat messages will appear here */}
        </Box>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <Button type="submit" mt={2} colorScheme="blue">
            Send
          </Button>
        </form>
      </VStack>
    </Box>
  );
} 