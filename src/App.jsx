import 'bootstrap-icons/font/bootstrap-icons.css'; //bootstrap-icons
import './App.css';
import Chart from './pages/analytics/chart';
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Footer, Header, Layout } from './components';
import LoginForm from './pages/auth/login/LoginForm';
import RegisterForm from './pages/auth/register/RegisterFrom';
import QrScan from "./pages/qr/QrScan";



function App() {
  return (
    <div>
      <Header />
      <Layout>
        <Routes>
          {/* <Route path='/auth/register' element={<RegisterForm />} /> */}
          <Route path='/auth/register' element={<RegisterForm />} />
          <Route path='/auth/login' element={<LoginForm />} />
           <Route path='/chart/data' element = {<Chart />} />
            <Route path="/qr-scan" element={<QrScan />} />
        </Routes>
        <Footer />
      </Layout>
    </div >
  );
}

export default App;
