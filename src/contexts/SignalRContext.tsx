import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import React, { createContext, useContext, useEffect, useState } from 'react';

type SignalRContextType = {
  connection: HubConnection | null;
};

const SignalRContext = createContext<SignalRContextType>({ connection: null });

export const useSignalR = () => useContext(SignalRContext);

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('http://acme.com/notifications')
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        setConnection(newConnection);
      })
      .catch(console.error);

    return () => {
      newConnection.stop();
    };
  }, []);

  return (
    <SignalRContext.Provider value={{ connection }}>
      {children}
    </SignalRContext.Provider>
  );
};