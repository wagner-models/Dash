import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Image,
  Textarea,
  useToast
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { NFTService } from '../services/nftService';

const NFTCreator = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    attributes: []
  });
  const toast = useToast();
  const { connection } = useConnection();
  const wallet = useWallet();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!wallet.connected) {
        toast({
          title: 'Wallet not connected',
          description: 'Please connect your wallet to mint NFTs',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const nftService = new NFTService(connection, wallet);
      
      toast({
        title: 'NFT Creation Started',
        description: 'Please approve the transaction in your wallet',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

      const result = await nftService.mintNFT({
        name: formData.name,
        description: formData.description,
        image: formData.image,
        attributes: formData.attributes
      });

      toast({
        title: 'NFT Created Successfully',
        description: `Mint address: ${result.mint}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>NFT Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter NFT name"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your NFT"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Upload Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </FormControl>

          {formData.image && (
            <Image
              src={formData.image}
              alt="NFT Preview"
              boxSize="200px"
              objectFit="cover"
            />
          )}

          <Button
            type="submit"
            colorScheme="purple"
            width="full"
          >
            Create NFT
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default NFTCreator; 