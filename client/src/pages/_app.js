import { ChakraProvider } from '@chakra-ui/react'
import WalletConfig from '../components/wallet/WalletConfig'
import Navigation from '../components/common/Navigation'
import theme from '../theme'

export default function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <WalletConfig>
        <Navigation />
        <Component {...pageProps} />
      </WalletConfig>
    </ChakraProvider>
  )
} 