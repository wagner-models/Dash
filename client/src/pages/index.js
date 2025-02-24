import { Box, Heading, Container } from '@chakra-ui/react';

export default function HomePage() {
  return (
    <Container maxW="container.xl">
      <Box padding="4">
        <Heading>Welcome to DASH</Heading>
        <Box mt="4">
          Your AI-Powered Web3 Development Platform
        </Box>
      </Box>
    </Container>
  );
} 