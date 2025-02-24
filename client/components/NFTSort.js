import { Select, FormControl, FormLabel } from '@chakra-ui/react';

const NFTSort = ({ onSort }) => {
  return (
    <FormControl w="200px">
      <FormLabel>Sort By</FormLabel>
      <Select onChange={(e) => onSort(e.target.value)} defaultValue="recent">
        <option value="recent">Most Recent</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="name">Name</option>
      </Select>
    </FormControl>
  );
};

export default NFTSort; 