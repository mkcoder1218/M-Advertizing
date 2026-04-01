import { io } from 'socket.io-client';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const socket = io(baseURL, {
  autoConnect: false,
  transports: ['websocket'],
});
