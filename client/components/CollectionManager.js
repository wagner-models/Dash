import { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Heading,
  Button,
  Grid,
  Text,
  Image,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { CollectionService } from '../services/collectionService';
import CreateCollectionModal from './CreateCollectionModal';

const CollectionManager = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { connection } = useConnection();
  const wallet = useWallet();
  const toast = useToast();
  const collectionService = new CollectionService(connection, wallet);

  const handleCreateCollection = async (collectionData) => {
    try {
      setLoading(true);
      const collection = await collectionService.createCollection(collectionData);
      setCollections([...collections, collection]);
      toast({
        title: 'Collection Created',
        description: `Successfully created ${collection.name}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={8} w="full">
      <HStack justify="space-between" w="full">
        <Heading size="lg">My Collections</Heading>
        <Button colorScheme="purple" onClick={onOpen}>
          Create Collection
        </Button>
      </HStack>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6} w="full">
        {collections.map((collection) => (
          <Box
            key={collection.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
          >
            <Image
              src={collection.image}
              alt={collection.name}
              borderRadius="md"
              mb={4}
            />
            <Heading size="md" mb={2}>{collection.name}</Heading>
            <Text mb={4}>{collection.description}</Text>
            <Text color="gray.500">
              NFTs: {collection.nfts.length}
            </Text>
          </Box>
        ))}
      </Grid>

      <CreateCollectionModal
        isOpen={isOpen}
        onClose={onClose}
        onCreate={handleCreateCollection}
        isLoading={loading}
      />
    </VStack>
  );
};

export default CollectionManager; 