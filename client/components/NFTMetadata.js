import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Link,
  Badge
} from '@chakra-ui/react';

const NFTMetadata = ({ nft }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <VStack spacing={4} align="stretch">
        <Image
          src={nft.image}
          alt={nft.name}
          borderRadius="md"
          maxH="400px"
          objectFit="cover"
        />
        
        <Text fontSize="2xl" fontWeight="bold">{nft.name}</Text>
        <Text>{nft.description}</Text>

        <HStack>
          <Text fontWeight="bold">Mint Address:</Text>
          <Link href={`https://explorer.solana.com/address/${nft.mint}`} isExternal>
            {nft.mint.slice(0, 8)}...{nft.mint.slice(-8)}
          </Link>
        </HStack>

        {nft.attributes && nft.attributes.length > 0 && (
          <Box>
            <Text fontWeight="bold" mb={2}>Attributes:</Text>
            <HStack wrap="wrap" spacing={2}>
              {nft.attributes.map((attr, index) => (
                <Badge key={index} colorScheme="purple">
                  {attr.trait_type}: {attr.value}
                </Badge>
              ))}
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default NFTMetadata; 