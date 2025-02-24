import { Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import PluginGrid from '../components/marketplace/PluginGrid';
import SearchFilters from '../components/marketplace/SearchFilters';

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (category) => {
    setActiveFilter(category);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack align="start" spacing={4} mb={8}>
        <Heading>AI Plugin Marketplace</Heading>
        <Text color="gray.600" fontSize="lg">
          Discover and integrate powerful AI-powered tools for your Web3 development workflow
        </Text>
      </VStack>
      <SearchFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
      />
      <PluginGrid searchQuery={searchQuery} activeFilter={activeFilter} />
    </Container>
  );
} 