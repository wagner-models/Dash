import { Box, Input, HStack, Button, Wrap, WrapItem } from '@chakra-ui/react';

export default function SearchFilters({ onSearch, onFilterChange, activeFilter }) {
  const categories = ['All', 'Development', 'NFT', 'Analytics', 'Security'];

  return (
    <Box mb={8}>
      <Input
        placeholder="Search plugins..."
        mb={4}
        onChange={(e) => onSearch(e.target.value)}
      />
      <Wrap spacing={2}>
        {categories.map((category) => (
          <WrapItem key={category}>
            <Button
              colorScheme="purple"
              variant={activeFilter === category ? 'solid' : 'outline'}
              onClick={() => onFilterChange(category)}
              size="sm"
            >
              {category}
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
} 