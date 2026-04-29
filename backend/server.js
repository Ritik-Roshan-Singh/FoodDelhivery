import express from 'express'
import cors from 'cors'
import dotenv from "dotenv";
import fs from "fs";

import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
// Load env variables FIRST
dotenv.config();

// Ensure uploads directory exists
fs.mkdirSync('uploads', { recursive: true });

//app config
const app = express();
const port = process.env.PORT || 4000;

// Global error handlers to surface startup/runtime issues in the console
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

//middlewares
app.use(express.json());
app.use(cors());

//db connection
connectDB();

//api endpoints
app.use("/api/food", foodRouter)
app.use("/images", express.static("uploads"))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

app.get("/", (req, res)=>{
    res.send("API Working")
})

app.listen(port, ()=>{
    console.log(`Server Started on http://localhost:${port}`)
})