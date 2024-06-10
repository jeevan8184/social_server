
import express from 'express';
import cors from 'cors';
import {Server} from 'socket.io';
import http from 'http';
import ChatSocket from './socket/chatSocket.js';
import dotenv from 'dotenv'

dotenv.config();
const url=process.env.FRONTEND_URL

const app=express();
app.use(cors());

const server=http.createServer(app);
const port=5000;

console.log(url);
const io=new Server(server,{
    cors: {
        origin: true,
        credentials: true,
      },
      allowEIO3: true,
})

ChatSocket(io);

app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

server.listen(port,()=> console.log('server connected port : 5000'));
