import { RealTimeProvider } from '../contexts/RealTimeContext';

function MyApp({ Component, pageProps }) {
  return (
    <WalletProvider>
      <RealTimeProvider>
        <Component {...pageProps} />
      </RealTimeProvider>
    </WalletProvider>
  );
}

export default MyApp; 