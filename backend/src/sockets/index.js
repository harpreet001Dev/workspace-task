import { Server } from "socket.io";

export function initializeSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
}