import { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Checkbox,
  Button,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image
} from '@chakra-ui/react';

const BatchOperations = ({ nfts, onBatchList, onBatchTransfer, onBatchBurn }) => {
  const [selectedNFTs, setSelectedNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSelect = (nftId) => {
    if (selectedNFTs.includes(nftId)) {
      setSelectedNFTs(selectedNFTs.filter(id => id !== nftId));
    } else {
      setSelectedNFTs([...selectedNFTs, nftId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedNFTs.length === nfts.length) {
      setSelectedNFTs([]);
    } else {
      setSelectedNFTs(nfts.map(nft => nft.id));
    }
  };

  const handleBatchOperation = async (operation) => {
    try {
      setLoading(true);
      switch (operation) {
        case 'list':
          await onBatchList(selectedNFTs);
          break;
        case 'transfer':
          await onBatchTransfer(selectedNFTs);
          break;
        case 'burn':
          await onBatchBurn(selectedNFTs);
          break;
      }
      toast({
        title: 'Success',
        description: `Batch ${operation} completed successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setSelectedNFTs([]);
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
    <VStack spacing={4} w="full">
      <HStack justify="space-between" w="full">
        <Checkbox
          isChecked={selectedNFTs.length === nfts.length}
          onChange={handleSelectAll}
        >
          Select All
        </Checkbox>
        <HStack>
          <Button
            colorScheme="purple"
            isDisabled={selectedNFTs.length === 0}
            onClick={() => handleBatchOperation('list')}
            isLoading={loading}
          >
            List Selected
          </Button>
          <Button
            colorScheme="blue"
            isDisabled={selectedNFTs.length === 0}
            onClick={() => handleBatchOperation('transfer')}
            isLoading={loading}
          >
            Transfer Selected
          </Button>
          <Button
            colorScheme="red"
            isDisabled={selectedNFTs.length === 0}
            onClick={() => handleBatchOperation('burn')}
            isLoading={loading}
          >
            Burn Selected
          </Button>
        </HStack>
      </HStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Image</Th>
            <Th>Name</Th>
            <Th>Collection</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {nfts.map((nft) => (
            <Tr key={nft.id}>
              <Td>
                <Checkbox
                  isChecked={selectedNFTs.includes(nft.id)}
                  onChange={() => handleSelect(nft.id)}
                />
              </Td>
              <Td>
                <Image
                  src={nft.image}
                  alt={nft.name}
                  boxSize="50px"
                  objectFit="cover"
                  borderRadius="md"
                />
              </Td>
              <Td>{nft.name}</Td>
              <Td>{nft.collection}</Td>
              <Td>{nft.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default BatchOperations; 