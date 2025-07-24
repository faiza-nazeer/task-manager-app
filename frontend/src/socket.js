import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Update if using deployed backend

export default socket;

