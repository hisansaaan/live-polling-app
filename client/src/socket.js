import { io } from 'socket.io-client';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://live-polling-app-lp6q.onrender.com';

const socket = io(BACKEND_URL, {
  transports: ['websocket'],
});

export default socket;