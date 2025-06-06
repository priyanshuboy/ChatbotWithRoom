import { WebSocketServer, WebSocket } from "ws";

const ws = new WebSocketServer({ port: 5500 });

interface User {
  socket: WebSocket;
  room: string;
}

let allSocket: User[] = [];

ws.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log(message)
    let Message: any;

    try {
      Message = JSON.parse(message.toString().trim());
    } catch (e) {
      console.error("Invalid JSON", message);
      return;
    }

    if (Message.type === "join") {
      console.log("User joined:", Message.payload.room.trim());
      allSocket.push({
        socket,
        room: Message.payload.room.trim(),
      });
    }

    if (Message.type === "chat") {
      console.log("Chat received");

      const user = allSocket.find((x) => x.socket === socket);
      if (!user) return;

      const userRoom = user.room;

      for (let i = 0; i < allSocket.length; i++) {
        if (allSocket[i].room === userRoom) {
          allSocket[i].socket.send(Message.payload.message);
        }
      }
    }
  });

  socket.on("close", () => {
    console.log("User disconnected");
    allSocket = allSocket.filter((x) => x.socket !== socket);
  });
});

// const ws  = new WebSocketServer({ port: 5500 });
// let userCount = 0;
// let allSocket : WebSocket[] =[]; // this array will store socket for every new user connected we ith socket in const then send res to every user who are currently on server 
// //socket will work as req and res
// ws.on('connection' ,(socket)=>{ 
//     allSocket.push(socket);
//     console.log('user connected');
//     userCount++;
  
//    //this socket will run every new user whenever the new message comes it response
//    socket.on('message' ,(event)=>{
//     console.log('message recived :' + event.toString()); //client message 
//     for(let i =0; i<allSocket.length; i++){
//         const s =allSocket[i];
//         s.send(event.toString()) // server responsed
//     }
//    })
// })