import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge
} from '@chakra-ui/react';

const CollectionPerformance = ({ collections }) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Collection</Th>
          <Th>NFTs</Th>
          <Th>Value</Th>
          <Th>Performance</Th>
        </Tr>
      </Thead>
      <Tbody>
        {collections?.map((collection, index) => (
          <Tr key={index}>
            <Td>{collection.name}</Td>
            <Td>{collection.nftCount}</Td>
            <Td>{collection.value} SOL</Td>
            <Td>
              <Badge
                colorScheme={collection.performance.startsWith('+') ? 'green' : 'red'}
              >
                {collection.performance}
              </Badge>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default CollectionPerformance; 