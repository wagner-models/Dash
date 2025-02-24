import { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { WebSocketService } from '../services/websocketService';

const RealTimeContext = createContext({});

export function RealTimeProvider({ children }) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [wsService, setWsService] = useState(null);

  useEffect(() => {
    if (connection && wallet) {
      const service = new WebSocketService(connection, wallet);
      service.connect();
      setWsService(service);

      return () => {
        service.disconnect();
      };
    }
  }, [connection, wallet]);

  const subscribe = (event, callback) => {
    wsService?.subscribe(event, callback);
  };

  const unsubscribe = (event, callback) => {
    wsService?.unsubscribe(event, callback);
  };

  return (
    <RealTimeContext.Provider value={{ subscribe, unsubscribe }}>
      {children}
    </RealTimeContext.Provider>
  );
}

export function useRealTime() {
  return useContext(RealTimeContext);
} 