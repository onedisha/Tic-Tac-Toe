import React from 'react';
import cross from '../../assets/cross.png';
import zero from '../../assets/zero.png';
import './TTT.css'
import { socket } from '../../socket';
import { useNavigate } from "react-router-dom";

interface Props{
  symbol: string;
  idx: number;
  setTable: any;
  turn: string;
  setTurn: any;
  lock: boolean;
  table: string[];
  start: boolean;
}

const Box = ({symbol, idx, table, setTable, turn, setTurn, lock, start}: Props) => {
  const play = () => {
    if(lock) return;
    if(!start) return;
    let t= [...table];
    if(t[idx]) return;
    t[idx]=turn;
    setTable(t);
    setTurn(turn === 'x' ? 'o' : 'x');
    socket.emit('move', t);
  }
  return(
    <div className='box' onClick={play}>
      {symbol!=='' && <img className='box-img' src={symbol === 'x' ? cross : zero} alt="" />}
    </div>
  )
}

const TTT = () => {
  let [table, setTable] = React.useState(["","","","","","","","",""]);
  let [turn, setTurn] = React.useState('x');
  let [lock, setLock] = React.useState(false);
  let [start, setStart] = React.useState(false);
  let [msg, setMsg] = React.useState('Tic-Tac-Toe');
  let [player, setPlayer] = React.useState(".");
  let [boxdisplay, setBoxdisplay] = React.useState("rematch-request hidden");
  let [overlay, setOverlay] = React.useState("overlay hidden");
  let navigate = useNavigate();

  const reset = () => {
    setTable(["","","","","","","","",""]);
    setTurn('x');
    setLock(false);
    setMsg('Tic-Tac-Toe');
  }

  const rematchReq = () => {
    socket.emit('rematch', (msg : any) => {
      alert(msg);
    });
  }

  socket.on('request', ()=>{
    setBoxdisplay("rematch-request");
  });

  const onYes = () => {
    reset();
    socket.emit("yes");
    setBoxdisplay("rematch-request hidden");
  }

  const onNo = () => {
    socket.emit("no");
    setBoxdisplay("rematch-request hidden");
  }

  socket.on("yes", reset);
  socket.on("no", () => {
    alert("Request denied");
  })

  const leaveMatch = () => {
    socket.emit('leave');
    setOverlay("overlay");
  }

  React.useEffect(() => {
    function onLeftEvent(msg: string) {
      console.log("h");
      alert(msg);
      reset(); 
    }
    socket.on("left", onLeftEvent);
    return () => {
      socket.off("left", onLeftEvent);
    };
  }, [])

  socket.on('start', (msg:boolean) => {
    setStart(msg);
  })

  const onJoin = () => {
    navigate("/");
  }

  const checkWin = () => {
    let i: number;
    let data= [...table];
      for(i=0; i<9; i+=3){
        if(data[i]===data[i+1] && data[i]===data[i+2] && data[i]!==""){
            return data[i];
        }
    }
    for(i=0; i<3; i++){
        if(data[i]===data[i+3] && data[i]===data[i+6] && data[i]!==""){
          return data[i];
        }
    }
    if(data[0]===data[4] && data[0]===data[8] && data[0]!==""){
      return data[0];
    }

    if(data[2]===data[4] && data[2]===data[6] && data[2]!==""){
      return data[2];
    }

    for(i=0; i<9; i++){
      if(data[i]=="") return "";
    }
    return "draw";
  }

  const settingLock = () => {
    if(player=='Player 1' && turn == 'o') setLock(true);
    if(player=='Player 2' && turn == 'x') setLock(true);
    if(player=='Player 1' && turn == 'x') setLock(false);
    if(player=='Player 2' && turn == 'o') setLock(false);
  }

  React.useEffect(() => {
    settingLock();
  }, [table, player]);

  React.useEffect(() => {
    if(checkWin()==='x'){
      setMsg('Congrats! X won the match!');
    }
    else if(checkWin()==='o'){
      setMsg('Congrats! O won the match!');
    }
    else if(checkWin()=== 'draw'){
      setMsg("It's a draw!");
    }
    if(checkWin()!=""){
      setLock(true);
    }
  }, [table]);

  socket.on('setplayer', (msg: string) => {
    setPlayer(msg);
  })

  React.useEffect(() => {
    function onMoveEvent(value:any) {
      setTable(value);
      setTurn((e:any) => {
        if(e=='x') return 'o';
        return 'x';
      });
    }
    socket.on("moved", onMoveEvent);
    return () => {
      socket.off("moved", onMoveEvent);
    };
  }, []);

  return (
    <>
    <div className='container'>
      <div className="title">
        <h1 className='heading1'>{msg}</h1>
        <button className='leave-btn' onClick={leaveMatch}>Leave</button>
      </div>
      <h2 className='heading2'>{player}</h2>
      <div className='grid'>
        {table.map((e, index) => {
          return <Box symbol={e} key={index} idx={index} setTable={setTable} turn={turn} setTurn={setTurn} lock={lock} table={table} start={start} />;
        })}
      </div>

    <div className={boxdisplay}>
      <h1 className='rematch-msg'>Do you want a rematch?</h1>
      <div className='options'>
        <button className='option-btn' onClick={onYes}>Yess</button>
        <button className='option-btn' onClick={onNo}>Naah</button>
      </div>
    </div>  

      <button className='reset-button' onClick={rematchReq}>Request Rematch</button>
    </div>
    <div className={overlay}>
        <h1 className="left-msg">You left the match!</h1>
        <div className="btn"><button className='join-btn' onClick={onJoin}>Join Another Match</button></div>
    </div>
    </>
  )
}

export default TTT