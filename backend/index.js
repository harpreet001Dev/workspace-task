import 'dotenv/config';
import app from './app.js';
import connectDB from './src/config/db.js';
import { createServer } from 'http';
import { initializeSocket } from './src/sockets/index.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectDB();

        const httpServer = createServer(app);
        
        //socket server
        const io=initializeSocket(httpServer);
        app.set("io", io);

        httpServer.listen(PORT, "0.0.0.0", () => {
            console.log(`Backend is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

startServer();