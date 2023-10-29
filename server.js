import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let rooms = {}; //{index: value ===> socket.id: hash(room)}
let check = {}; 
let allSockets = []; //stores all sockets

io.on("connection", (socket) => {
  allSockets.push(socket);
  socket.on("move", (idx) => {
    allSockets.forEach((sock) => {
      //check all players in the same room except the player making the move himself
      if (sock.id !== socket.id && rooms[sock.id] === rooms[socket.id])  { 
        sock.emit("moved", idx);
      }
    });
  });

  let player = "Player 1";
  let i = 1;
  console.log("me");

  socket.on("code", (val, callback) => {
    console.log(i);
    i++;
   rooms[socket.id] = val;
    if(!check[val]) check[val]=[];
    check[val].push(socket.id);
    if(check[val].length > 1) player = "Player 2";
    callback(player);
    console.table(check);
    console.table(rooms);
  });

  socket.on("rematch", (callback) => {
    allSockets.forEach((sock) => {
      if (sock.id !== socket.id && rooms[sock.id] === rooms[socket.id])  { 
        sock.emit("request");
      }
    });
    callback("Rematch requested");
  })

  socket.on("yes", () => {
    allSockets.forEach((sock) => {
      if (sock.id !== socket.id && rooms[sock.id] === rooms[socket.id])  { 
        sock.emit("yes");
      }
    });
  })

  socket.on("no", () => {
    allSockets.forEach((sock) => {
      if (sock.id !== socket.id && rooms[sock.id] === rooms[socket.id])  { 
        sock.emit("no");
      }
    });
  })

  socket.on('leave', () => {
    let s_id= socket.id;
    let room= rooms[s_id];
    let arr = check[room];
    if(arr) arr = arr.filter((e) => e!== s_id);
    check[room] = arr;
    let msg= "Your opponent left the match!";
    allSockets.forEach((sock) => {
      if (sock.id !== socket.id && rooms[sock.id] === rooms[socket.id])  { 
        sock.emit("left", msg);
      }
    });
    delete rooms[s_id];
    console.table(rooms);
    console.table(check);
  })

  socket.on('disconnect', () => {
    let s_id= socket.id;
    let room= rooms[s_id];
    let arr = check[room];
    if(arr) arr = arr.filter((e) => e!== s_id);
    check[room] = arr;
    let msg= "Your opponent left the match!";
    allSockets.forEach((sock) => {
      if (sock.id !== socket.id && rooms[sock.id] === rooms[socket.id])  { 
        sock.emit("left", msg);
      }
    });
    delete rooms[s_id];
    console.table(rooms);
    console.table(check);
  })


});

io.listen(3000);