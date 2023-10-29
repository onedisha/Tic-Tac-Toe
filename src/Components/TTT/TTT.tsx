import React from 'react';
import cross from '../../assets/cross.png';
import zero from '../../assets/zero.png';
import './TTT.css'
import { socket } from '../../socket';

interface Props{
  symbol: string;
  idx: number;
  setTable: any;
  turn: string;
  setTurn: any;
  lock: boolean;
  table: string[];
}

const Box = ({symbol, idx, table, setTable, turn, setTurn, lock}: Props) => {
  const play = () => {
    if(lock) return;
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
  let [msg, setMsg] = React.useState('Tic-Tac-Toe');
  let [player, setPlayer] = React.useState(".");
  let [boxdisplay, setBoxdisplay] = React.useState("rematch-request hidden");
  let [overlay, setOverlay] = React.useState("overlay hidden");

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

  socket.on('left', (msg: string) => {alert(msg)});

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


  React.useEffect(() => {
    socket.emit('code', window.location.hash, (p : string) =>{
      setPlayer(p);
    });
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
      <h1 className='heading'>{msg}</h1>
      <h2 className='heading2'>{player}</h2>
      <button className='leave-btn' onClick={leaveMatch}>Leave</button>
      <div className='grid'>
        {table.map((e, index) => {
          return <Box symbol={e} key={index} idx={index} setTable={setTable} turn={turn} setTurn={setTurn} lock={lock} table={table} />;
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
        <h1 className="heading">You left the match!</h1>
    </div>
    </>
  )
}

export default TTT