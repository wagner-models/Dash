import { useState, useEffect, useMemo } from 'react';
import {
  Grid,
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  Input,
  InputGroup,
  InputRightElement,
  HStack
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { MarketplaceService } from '../services/marketplaceService';
import NFTMetadata from './NFTMetadata';
import TransactionHistory from './TransactionHistory';
import NFTSearch from './NFTSearch';
import NFTSort from './NFTSort';
import { useRealTime } from '../contexts/RealTimeContext';
import { useDisclosure } from '@chakra-ui/react';
import ExportData from './ExportData';

const NFTMarketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { connection } = useConnection();
  const wallet = useWallet();
  const toast = useToast();
  const marketplaceService = new MarketplaceService(connection, wallet);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const { subscribe, unsubscribe } = useRealTime();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const filteredListings = useMemo(() => {
    return listings
      .filter(listing => {
        // Apply search term
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            listing.nft.name.toLowerCase().includes(searchLower) ||
            listing.nft.description.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .filter(listing => {
        // Apply filter
        switch (filter) {
          case 'listed':
            return listing.seller === wallet.publicKey?.toString();
          case 'owned':
            return listing.owner === wallet.publicKey?.toString();
          case 'created':
            return listing.creator === wallet.publicKey?.toString();
          default:
            return true;
        }
      });
  }, [listings, searchTerm, filter, wallet.publicKey]);

  const sortedListings = useMemo(() => {
    return [...filteredListings].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.nft.name.localeCompare(b.nft.name);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [filteredListings, sortBy]);

  const handleList = async (nft, price) => {
    try {
      setLoading(true);
      const listing = await marketplaceService.listNFT(nft, price);
      setListings([...listings, listing]);
      toast({
        title: 'NFT Listed',
        description: `Listed ${nft.name} for ${price} SOL`,
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
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (listing) => {
    try {
      setLoading(true);
      await marketplaceService.buyNFT(listing);
      setListings(listings.filter(l => l.id !== listing.id));
      toast({
        title: 'NFT Purchased',
        description: `Successfully purchased ${listing.nft.name}`,
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
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (filterType) => {
    setFilter(filterType);
  };

  useEffect(() => {
    if (wallet.connected) {
      const handleAccountUpdate = (accountInfo) => {
        // Update marketplace data based on account changes
        loadMarketplaceData();
      };

      subscribe('accountUpdate', handleAccountUpdate);

      return () => {
        unsubscribe('accountUpdate', handleAccountUpdate);
      };
    }
  }, [wallet.connected]);

  return (
    <VStack spacing={8} w="full">
      <HStack justify="space-between" w="full">
        <Heading>NFT Marketplace</Heading>
        <Button
          leftIcon={<DownloadIcon />}
          colorScheme="purple"
          variant="outline"
          onClick={onOpen}
        >
          Export Data
        </Button>
      </HStack>
      
      <HStack w="full" justify="space-between">
        <NFTSearch 
          onSearch={handleSearch}
          onFilter={handleFilter}
        />
        <NFTSort onSort={setSortBy} />
      </HStack>
      
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6} w="full">
        {sortedListings.map((listing) => (
          <Box key={listing.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
            <NFTMetadata nft={listing.nft} />
            <Box p={4}>
              <Text fontWeight="bold">{listing.price} SOL</Text>
              <Button
                colorScheme="purple"
                width="full"
                mt={2}
                onClick={() => handleBuy(listing)}
                isLoading={loading}
                disabled={!wallet.connected || listing.seller === wallet.publicKey?.toString()}
              >
                Buy Now
              </Button>
            </Box>
          </Box>
        ))}
      </Grid>

      <Box w="full" mt={8}>
        <Heading size="lg" mb={4}>Transaction History</Heading>
        <TransactionHistory />
      </Box>

      <ExportData
        data={listings}
        isOpen={isOpen}
        onClose={onClose}
      />
    </VStack>
  );
};

export default NFTMarketplace; 