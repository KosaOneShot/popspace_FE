import { Route, Routes } from 'react-router-dom';
import './App.css';
import RegisterForm from './pages/auth/register/RegisterFrom';
import LoginForm from './pages/auth/login/LoginForm';
import React from 'react';





function App() {
  return (
    <div>
      {/* <PageHeader /> */}
      <Routes>
        {/* <Route path='/auth/register' element={<RegisterForm />} /> */}
        {/* <Route path='/auth/login' element={<LoginForm />} /> */}
        {/* <Route path='/main' element = {<Main /> }/> */}
      </Routes>
    </div>
  );
}

export default App;
