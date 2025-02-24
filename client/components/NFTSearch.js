import {
  HStack,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Box
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const NFTSearch = ({ onSearch, onFilter }) => {
  return (
    <HStack spacing={4} w="full" mb={8}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search NFTs..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </InputGroup>
      
      <Select
        w="200px"
        onChange={(e) => onFilter(e.target.value)}
        defaultValue="all"
      >
        <option value="all">All NFTs</option>
        <option value="listed">Listed</option>
        <option value="owned">Owned</option>
        <option value="created">Created</option>
      </Select>
    </HStack>
  );
};

export default NFTSearch; 