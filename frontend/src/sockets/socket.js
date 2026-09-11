import { io } from "socket.io-client";

const socket = io(process.env.VITE_BACKEND_URI, {
    withCredentials: true,
    autoConnect: false,
});

export default socket;