import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Chat } from '../components/layouts/Main/Chat';
import { SideBar } from '../components/layouts/Main/SideBar';

const socket = io("http://localhost:3000/");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div className='w-screen h-screen bg-slate-800 max-h-screen flex'>
      <SideBar />
      <Chat />
    </div>
  );
}

export default App;