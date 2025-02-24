import { Box, Container, Heading } from '@chakra-ui/react';

export default function Sandbox() {
  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Development Sandbox</Heading>
      <Box>
        {/* Sandbox content will go here */}
      </Box>
    </Container>
  );
} 