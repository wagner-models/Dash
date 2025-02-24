import { Box, Flex, Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import WalletButton from '../wallet/WalletButton';

export default function Navigation() {
  return (
    <Box as="nav" bg="gray.800" color="white" py={4}>
      <Flex maxW="container.xl" mx="auto" px={4} justify="space-between">
        <Flex gap={6} align="center">
          <NextLink href="/" passHref>
            <Button variant="ghost" fontSize="xl" fontWeight="bold">DASH</Button>
          </NextLink>
          <NextLink href="/marketplace" passHref>
            <Button variant="ghost">Marketplace</Button>
          </NextLink>
          <NextLink href="/nft-dashboard" passHref>
            <Button variant="ghost">NFT Dashboard</Button>
          </NextLink>
          <NextLink href="/sandbox" passHref>
            <Button variant="ghost">Sandbox</Button>
          </NextLink>
        </Flex>
        <WalletButton />
      </Flex>
    </Box>
  );
} 