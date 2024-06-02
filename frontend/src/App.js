import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Settings from './Settings';
import Analysis from './Analysis';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/home' element={<Home />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/analysis' element={<Analysis />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
