
import { Server } from "socket.io";

const ChatSocket=(io)=> {

    let onlineUsers=[];
    let notifications=[];

    io.on('connection',(socket)=> {
        socket.on('newUser',(userId)=> {

            if(!onlineUsers.some((u)=> u?.userId===userId)) {
                onlineUsers.push({userId,socketId:socket.id,isTyping:false});
            }
            io.emit('onlineUsers',onlineUsers);
            console.log('onlineUsers',onlineUsers);

            const receiverSocket=onlineUsers.find((u)=> u.userId===userId);
            const userNotifies=notifications.filter((n)=> n.receiverId===userId);

            userNotifies.forEach((n)=> {
                io.to(receiverSocket.socketId).emit('notify',n);
            })
            notifications=notifications.filter((n)=> n.receiverId===userId);

        })

        socket.on('newMsg',({newMsg,senderId,receiverId,name})=> {
            
            const receiverSocket=onlineUsers.find((u)=> u.userId===receiverId);
            const senderSocket=onlineUsers.find((u)=> u.userId===senderId);

            if(senderSocket) {
                io.to(senderSocket.socketId).emit('receiveMsg',newMsg);
            }
            const newNotify={newMsg,senderId,receiverId,name,isRead:false,date:new Date()};
            onlineUsers=onlineUsers.map((u)=> u.userId===senderId ? {...u,isTyping:false}:u);
 
            if(receiverSocket) {
                io.to(receiverSocket.socketId).emit('receiveMsg',newMsg);
                io.to(receiverSocket.socketId).emit('notify',newNotify);
                io.to(receiverSocket.socketId).emit('onlineUsers',onlineUsers);
            }else {
                notifications.push(newNotify);
            }
        })

        socket.on('startTyping',({senderId,receiverId})=> {
            const receiverSocket=onlineUsers.find((u)=> u.userId===receiverId);
            const senderSocket=onlineUsers.find((u)=> u.userId===senderId);

            onlineUsers=onlineUsers.map((u)=> u.userId===senderId ? {...u,isTyping:true}:u);
            console.log('onlineUsers',onlineUsers);

            if(receiverSocket) {
                io.to(receiverSocket.socketId).emit('onlineUsers',onlineUsers);
            }
            if(senderSocket) {
                io.to(senderSocket.socketId).emit('onlineUsers',onlineUsers);
            }
        })

        socket.on('stopTyping',({senderId,receiverId})=> {
            const receiverSocket=onlineUsers.find((u)=> u.userId===receiverId);
            const senderSocket=onlineUsers.find((u)=> u.userId===senderId);

            onlineUsers=onlineUsers.map((u)=> u.userId===senderId ? {...u,isTyping:false}:u);
            console.log('onlineUsers',onlineUsers);

            if(receiverSocket) {
                io.to(receiverSocket.socketId).emit('onlineUsers',onlineUsers);
            }
            if(senderSocket) {
                io.to(senderSocket.socketId).emit('onlineUsers',onlineUsers);
            }
        })

        socket.on('deleteMultiple',({msgs,senderId,receiverId})=> {
            const receiverSocket=onlineUsers.find((u)=> u.userId===receiverId);
            const senderSocket=onlineUsers.find((u)=> u.userId===senderId);

            if(receiverSocket) {
                io.to(receiverSocket.socketId).emit('delmsgs',msgs);
            }
            if(senderSocket) {
                io.to(senderSocket.socketId).emit('delmsgs',msgs);
            }
        })

        socket.on('deleteMsg',({deleteId,senderId,receiverId})=> {
            const receiverSocket=onlineUsers.find((u)=> u.userId===receiverId);
            const senderSocket=onlineUsers.find((u)=> u.userId===senderId);

            if(receiverSocket) {
                io.to(receiverSocket.socketId).emit('delete',deleteId);
            }
            if(senderSocket) {
                io.to(senderSocket.socketId).emit('delete',deleteId);
            }
        })

        socket.on('setEmoji',({msg,senderId,receiverId})=> {
            const receiverSocket=onlineUsers.find((u)=> u.userId===receiverId);
            const senderSocket=onlineUsers.find((u)=> u.userId===senderId);

            if(receiverSocket) {
                io.to(receiverSocket.socketId).emit('emoji',msg);
            }
            if(senderSocket) {
                io.to(senderSocket.socketId).emit('emoji',msg);
            }
        })

        socket.on('disconnect',()=> {
            onlineUsers=onlineUsers.filter((u)=> u.socketId !==socket.id);
            io.emit('onlineUsers',onlineUsers);
            console.log('onlineUsers',onlineUsers);

        })
        
    })
}

export default ChatSocket;
