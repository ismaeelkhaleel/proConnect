import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postsRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(postsRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));

const start = async () => {
    const connectDB = await mongoose.connect(process.env.MONGO_URL);

    app.listen(8800, () => {
        console.log("Server is running on port 8800");
    });
}

start();