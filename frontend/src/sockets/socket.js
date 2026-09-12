import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URI || "http://localhost:5000", {
    withCredentials: true,
    autoConnect: false,
});

export default socket;