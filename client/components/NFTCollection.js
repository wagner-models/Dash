import {
  Grid,
  Box,
  Image,
  Text,
  Badge,
  VStack,
  Button
} from '@chakra-ui/react';

const NFTCollection = ({ nfts = [], onSelect }) => {
  return (
    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6} p={4}>
      {nfts.map((nft) => (
        <Box
          key={nft.id}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          transition="transform 0.2s"
          _hover={{ transform: 'scale(1.02)' }}
        >
          <Image
            src={nft.image}
            alt={nft.name}
            height="200px"
            width="100%"
            objectFit="cover"
          />
          <VStack p={4} align="start">
            <Text fontWeight="bold" fontSize="xl">{nft.name}</Text>
            <Text noOfLines={2}>{nft.description}</Text>
            <Badge colorScheme="purple">{nft.status}</Badge>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => onSelect(nft)}
            >
              View Details
            </Button>
          </VStack>
        </Box>
      ))}
    </Grid>
  );
};

export default NFTCollection; 