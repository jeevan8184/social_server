
import express from 'express';
import cors from 'cors';
import {Server} from 'socket.io';
import http from 'http';
import ChatSocket from './socket/chatSocket.js';
import dotenv from 'dotenv'

const app=express();
app.use(cors());

dotenv.config()

const server=http.createServer(app);
const port=3001;
const url=process.env.FRONTEND_URL

const io=new Server(server,{
    cors:{
        origin:url,
        methods:['GET','POST']
    }
})

ChatSocket(io);

server.listen(port,()=> console.log('server connected port : 3000'));
