import React from 'react'
import cross from '../../assets/cross.png';
import zero from '../../assets/zero.png';
import './TTT.css'

interface Props{
  symbol: string;
  idx: number;
  setTable: any;
  turn: string;
  setTurn: any;
  lock: boolean;
}

const Box = ({symbol, idx, setTable, turn, setTurn, lock}: Props) => {

  const play = () => {
    if(lock) return;
    setTable((e: string[]) => {
      let t= [...e];
      if(t[idx]) return t;
      t[idx]=turn;
      setTurn(turn === 'x' ? 'o' : 'x');
      return t;
    })
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

  const reset = () => {
    setTable(["","","","","","","","",""]);
    setTurn('x');
    setLock(false);
    setMsg('Tic-Tac-Toe');
  }

  const checkWin = () => {
    let i: number;
    let data= [...table];
    //horizontal
      for(i=0; i<9; i+=3){
        if(data[i]===data[i+1] && data[i]===data[i+2] && data[i]!==""){
            return data[i];
        }
    }
    //vertical
    for(i=0; i<3; i++){
        if(data[i]===data[i+3] && data[i]===data[i+6] && data[i]!==""){
          return data[i];
        }
    }
    //diagonal 
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

  return (
    <div className='container'>
      <h1 className='heading'>{msg}</h1>
      <div className='grid'>
        {table.map((e, index) => {
          return <Box symbol={e} idx={index} setTable={setTable} turn={turn} setTurn={setTurn} lock={lock} />;
        })}
      </div>
      
      <button className='reset-button' onClick={reset} >Rematch</button>
    </div>
  )
}

export default TTT