import 'bootstrap-icons/font/bootstrap-icons.css'; //bootstrap-icons
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Footer, Header, Layout } from './components';
import LoginForm from './pages/auth/login/LoginForm';
import RegisterForm from './pages/auth/register/RegisterFrom';


function App() {
  return (
    <div>
      <Header />
      <Layout>
        <Routes>
          {/* <Route path='/auth/register' element={<RegisterForm />} /> */}
          <Route path='/auth/register' element={<RegisterForm />} />
          <Route path='/auth/login' element={<LoginForm />} />
        </Routes>
        <Footer />
      </Layout>
    </div >
  );
}

export default App;
