import { Routes, Route } from 'react-router-dom';
import TTT from './Components/TTT/TTT'
import Home from './Components/Home/Home'

function App(){
  return (
      <Routes>
        <Route path='/:id' element={<TTT/>}/>
        <Route path='/' element={<Home/>}/>
      </Routes>
  )
}

export default App