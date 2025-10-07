import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_BACKEND_URL || 'https://live-polling-app-lp6q.onrender.com');
export default socket;