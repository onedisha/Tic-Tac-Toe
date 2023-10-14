import { useState } from 'react';
import { useRef } from 'react';
import {MouseEvent} from 'react';
import zero from '../../assets/zero.png';
import cross from '../../assets/cross.png';
import './TicTacToe.css'

let data = ["", "", "", "", "", "", "", "", ""];

function TicTacToe(){
    let [count, setCount] = useState(0);
    let [lock, setLock] = useState(false);
    let titleRef = useRef<HTMLHeadingElement>(null);
    let box1 = useRef(null);
    let box2 = useRef(null);
    let box3 = useRef(null);
    let box4 = useRef(null);
    let box5 = useRef(null);
    let box6 = useRef(null);
    let box7 = useRef(null);
    let box8 = useRef(null);
    let box9 = useRef(null);
    let box_array = [box1, box2, box3, box4, box5, box6, box7, box8, box9];

    const Toggle = (e: MouseEvent, num:number) => {
        if(lock) return;
        const target = e.target as Element;
        if(data[num]!="") return;
        if(count%2==0){
            target.innerHTML= `<img src = '${cross}'>`;
            data[num]='x';
        }
        else{
            target.innerHTML = `<img src = '${zero}'>`;
            data[num]='o';
        }
        setCount(++count);
        checkWin();
    }

    const gameOver = (winner: string) => {
        setLock(true);
        if(winner === "x" && titleRef.current){
            titleRef.current.innerHTML = `Congrats! <img src= '${cross}'> won the match!`         
        }
        else if(winner === "o" && titleRef.current){
            titleRef.current.innerHTML = `Congrats! <img src= '${zero}'> won the match!`  
        }

        else if(count===9 && titleRef.current){
            titleRef.current.innerHTML = "It's a draw!";
        }
    }

    const reset = () => {
        setLock(false);
        data = ["", "", "", "", "", "", "", "", ""];
        setCount(0);
        if(titleRef.current) titleRef.current.innerHTML = "Tic Tac Toe";
        box_array.map((e) => {
            if(e.current){
                let current = e.current as Element;
                current.innerHTML = "";
            }
        })
    }

    const checkWin = () => {
        let i:number;
        //horizontal
        for(i=0; i<9; i+=3){
            if(data[i]===data[i+1] && data[i]===data[i+2] && data[i]!==""){
                gameOver(data[i]);
                return;
            }
        }
        //vertical
        for(i=0; i<3; i++){
            if(data[i]===data[i+3] && data[i]===data[i+6] && data[i]!==""){
                gameOver(data[i]);
                return;
            }
        }
        //diagonal 
        if(data[0]===data[4] && data[0]===data[8] && data[0]!==""){
            gameOver(data[0]);
            return;
        }

        if(data[2]===data[4] && data[2]===data[6] && data[2]!==""){
            gameOver(data[2]);
            return;
        }

        if(count===9) gameOver("");
    }

    return( 
        <div className="container">
            <h1 className='title' ref={titleRef}>Tic Tac Toe</h1>
            <div className="grid">
                <div className="rows">
                    <div className="boxes" ref={box1} onClick={(e) => Toggle(e, 0)}></div>
                    <div className="boxes" ref={box2} onClick={(e) => Toggle(e, 1)}></div>
                    <div className="boxes" ref={box3} onClick={(e) => Toggle(e, 2)}></div>
                </div>
                <div className="rows">
                    <div className="boxes" ref={box4} onClick={(e) => Toggle(e, 3)}></div>
                    <div className="boxes" ref={box5} onClick={(e) => Toggle(e, 4)}></div>
                    <div className="boxes" ref={box6} onClick={(e) => Toggle(e, 5)}></div>
                </div>
                <div className="rows">
                    <div className="boxes" ref={box7} onClick={(e) => Toggle(e, 6)}></div>
                    <div className="boxes" ref={box8} onClick={(e) => Toggle(e, 7)}></div>
                    <div className="boxes" ref={box9} onClick={(e) => Toggle(e, 8)}></div>
                </div>
            </div>
            <button className='reset-btn' onClick={() => reset()} >Reset</button>
        </div>
    )
}

export default TicTacToe;