import React from 'react';
import { useNavigate } from "react-router-dom";
import './Home.css'
import { socket } from '../../socket';

const Home = () => {
    let [createRoomValue, setCreateRoomValue] = React.useState("");
    let [enterRoomValue, setEnterRoomValue] = React.useState("");
    let roomCreate = createRoomValue;
    let roomEnter = enterRoomValue;
    let navigate = useNavigate();

    const onCreate = () => {
        socket.emit("create", roomCreate, (msg : any) => {
            if(msg){
                alert("Room created!");
                navigate(`/${msg}`);
                socket.emit("setplayer", "Player 1");
            }
            else{
                alert("Room already exists, Enter another code!");
            }
        })
    }

    const onEnter = () => {
        socket.emit("enter", roomEnter, (msg: any, p: any) => {
            if(msg){
                alert("You entered the room!");
                navigate(`/${msg}`);
                socket.emit("setplayer", `Player ${p}`);
            }
            else{
                alert("Either the room is full or no such room exists, Enter another code!");
            }
        })
    }

    return(
        <>
        <h1 className='heading'>Tic-Tac-Toe</h1>
        <div className='join-room'>
            <h1 className='question'>Create a room with a code:</h1>
            <input type='text' className='input-box' onChange={(e) => {
                setCreateRoomValue(e.target.value);
            }} />
            <button className='home-page-btn' onClick={onCreate}>Create</button>
        </div>
        <div className='join-room'>
            <h1 className='question'>Enter a room with a code:</h1>
            <input type='text' className='input-box' onChange={(e) => {
                setEnterRoomValue(e.target.value);
            }} />
            <button className='home-page-btn' onClick={onEnter}>Enter</button>
        </div>
        </>
    )
}

export default Home