import React from 'react';
import Login from './Login';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Signup from './Signup';
import Home from './Home';
import Settings from './Settings'
import Analysis from './Analysis';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/settings' element={<Settings />}></Route>
        <Route path='/analysis' element={<Analysis />}></Route>
      </Routes>
    </BrowserRouter> 
  );
}

export default App;