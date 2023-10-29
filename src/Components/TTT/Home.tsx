import React from 'react';
import './TTT.css'
import { socket } from '../../socket';

const Home = () => {

    return(
        <>
        <h1 className='heading'>Tic-Tac-Toe</h1>
        <div className='create-room'>
            <h1>Create a room with a code</h1>
            <input type='text' className='input-box'/>
            <button class-name='home-page-btn'>Create</button>
        </div>
        <div className='join-room'>
            <h1>Enter a room with a code</h1>
            <input type='text' className='input-box'/>
            <button class-name='home-page-btn'>Enter</button>
        </div>
        </>
    )
}

export default Home