import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import router from './src/routes/index.js';
import errorHandler from './src/middleware/error.middleware.js';
import cookieParser from "cookie-parser";
const app = express();


app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Backend is working" });
});

app.use("/api", router);
app.use(errorHandler);

export default app;