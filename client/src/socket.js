import { io } from 'socket.io-client';

// Connect to your backend server
const socket = io('http://localhost:4000');

export default socket;