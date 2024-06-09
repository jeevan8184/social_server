
import express from 'express';
import cors from 'cors';
import {Server} from 'socket.io';
import http from 'http';
import ChatSocket from './socket/chatSocket.js';
import dotenv from 'dotenv'

const app=express();
app.use(cors());

dotenv.config();

const server=http.createServer(app);
const port=5000;
const url=process.env.FRONTEND_URL

console.log(url);
const io=new Server(server);
//     cors:{
//         origin:"http://social-1fh3osnfk-jeevan8184s-projects.vercel.app/sign-in",
//         methods:['GET','POST']
//     }
// })

ChatSocket(io);

io.on('connection',(socket)=>{
    console.log('socket',socket);
})

app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

server.listen(port,()=> console.log('server connected port : 5000'));
