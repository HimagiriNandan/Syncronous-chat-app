import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setUpSocket from "./socket.js";
import messagesRoutes from "./routes/MessageRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";
dotenv.config();
const app = express();

const port = process.env.PORT || 3001;
const dbUrl = process.env.DATABASE_URL;

const corsOptions = {
  origin: process.env.ORIGIN,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], 
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use("/uploads/profiles", cors(corsOptions), express.static("uploads/profiles"));
app.use("/uploads/files", cors(corsOptions), express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

setUpSocket(server);

mongoose.connect(dbUrl).then(() => {
  console.log('Database connected');
}).catch(err => console.log(err.message));