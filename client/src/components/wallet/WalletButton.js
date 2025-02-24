import { Button } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletButton() {
  const { wallet, connected } = useWallet();

  return (
    <>
      <WalletMultiButton />
      {connected && (
        <Button ml={4} colorScheme="green" size="sm">
          Connected: {wallet?.adapter?.name}
        </Button>
      )}
    </>
  );
}