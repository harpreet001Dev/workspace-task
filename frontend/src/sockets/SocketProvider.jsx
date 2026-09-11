import { useEffect } from "react";
import socket from "./socket";

function SocketProvider({ children }) {
    useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);

    return children;
}

export default SocketProvider;