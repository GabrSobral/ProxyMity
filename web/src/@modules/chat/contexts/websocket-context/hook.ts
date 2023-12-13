import { useContext } from 'react';
import { WebSocketContext } from './context';

export const useWebSocket = () => useContext(WebSocketContext);
