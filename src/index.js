import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import App from './App'; // .jsx 로 확실하게 지정
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <BrowserRouter>
      {/* <AuthProvider> */}
        <App />
      {/* </AuthProvider> */}
    </BrowserRouter>
  </React.StrictMode>

);
