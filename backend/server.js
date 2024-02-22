import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
dotenv.config();

import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
connectDB();
// const port = process.env.PORT || 3000;
// const port = 3000

const port = process.env.PORT || 5000

const app = express();
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))

app.listen(port,()=>{
    console.log('Server running on the port '+port)
});

app.use('/api/users',userRoutes)
app.use('/api/uploads', postRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)
// app.get("/", (req,res)=>{
//     res.send("API is running...")
// })
