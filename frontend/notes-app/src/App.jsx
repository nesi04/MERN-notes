import React from 'react'
import Home from './pages/Home/Home'
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom'
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';

const routes =(
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path='/dashboard' exact element={<Home/>}/>
      <Route path='/login' exact element={<Login/>}/>
      <Route path='/signup' exact element={<SignUp/>}/>
      
    </Routes>
  </Router>
);

const App = () => {
  return (
    <div className="">{routes}</div>
  )
}

export default App