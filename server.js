import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let idRooms = {}; 
let data = {};

io.on("connection", (socket) => {
  console.table(data);
  socket.on("move", (idx) => {
    let room = idRooms[socket.id];
    if(data[room]){
      data[room].forEach((s) => {
        if (s['id'] !== socket.id) { 
          s['sock'].emit("moved", idx);
        }
      });
  }
  });

  socket.on("create", (room, callback) => {
    if(data[room]){
      callback(false);
    }
    else{
      idRooms[socket.id] = room;
      data[room] = [];
      data[room].push({'player': 1, 'id': socket.id, 'sock': socket});
      callback(room);
    }
  });

  socket.on("enter", (room, callback) => {
    if(data[room] === undefined){
       callback(false, 0);
    } 
    else{
      if(data[room].length > 1) callback(false, 0);
      else{
        let p = 2;
        if(data[room][0]){
          if(data[room][0]['player'] === 2) p = 1;
          idRooms[socket.id] = room;
          data[room].push({'player': p, 'id': socket.id, 'sock': socket});
          callback(room, p);
          if(data[room].length === 2){
            if(data[room]){
              data[room].forEach((s) => {
                  s['sock'].emit("start", true);
              });
            }
          }
        }
      }
    }
  });

  socket.on('setplayer', (p) => {
    socket.emit('setplayer', p);
  })

  socket.on("rematch", (callback) => {
    let room = idRooms[socket.id];
    if(data[room]){
      data[room].forEach((s) => {
        if (s['id'] !== socket.id) { 
          s['sock'].emit("request");
        }
      });
    }
    callback("Rematch requested");
  })

  socket.on("yes", () => {
    let room = idRooms[socket.id];
    if(data[room]){
      data[room].forEach((s) => {
        if (s['id'] !== socket.id) { 
          s['sock'].emit("yes");
        }
      });
    }
  })

  socket.on("no", () => {
    let room = idRooms[socket.id];
    if(data[room]){
      data[room].forEach((s) => {
        if (s['id'] !== socket.id) { 
          s['sock'].emit("no");
        }
      });
    }
  })

  socket.on('leave', () => {
    let room = idRooms[socket.id];
    let arr = data[room];
    if(arr){ 
      arr = arr.filter((s) => s['id']!== socket.id);
      data[room] = arr;
      let msg= "Your opponent left the match!";
      arr.forEach((s) => {
        if (s['id'] !== socket.id) { 
          s['sock'].emit("left", msg);
          s['sock'].emit("start", false);
        }
      });
    }
    if(data[room].length === 0) delete data[room];
    delete idRooms[socket.id];
  })

  socket.on('disconnect', () => {
    let room = idRooms[socket.id];
    let arr = data[room];
    if(arr){ 
      arr = arr.filter((s) => s['id']!== socket.id);
      data[room] = arr;
      let msg= "Your opponent left the match!";
      arr.forEach((s) => {
        if (s['id'] !== socket.id) { 
          s['sock'].emit("left", msg);
          s['sock'].emit("start", false);
        }
      });
    }
    if(data[room].length === 0) delete data[room];
    delete idRooms[socket.id];
  })
});

io.listen(3000);