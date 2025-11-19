// MindFlow/src/utils/socket.js
import { io } from "socket.io-client";

// Pega a URL do servidor Express/Socket.io que você configurou
// no painel do Railway (como uma variável VITE_ no seu Front-end).
const SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL || "http://localhost:3001";

const socket = io(SERVER_URL, {
  transports: ["websocket", "polling"], 
  autoConnect: true,
});

export default socket;