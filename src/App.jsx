import 'bootstrap-icons/font/bootstrap-icons.css'; //bootstrap-icons
import './App.css';
import Chart from './pages/analytics/chart';
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Footer, Header, Layout } from './components';
import LoginForm from './pages/auth/login/LoginForm';
import RegisterForm from './pages/auth/register/RegisterFrom';
import ChangePasswordForm from './pages/auth/chage-password/ChangePasswordForm';
import "bootstrap-icons/font/bootstrap-icons.css"; //bootstrap-icons
import "bootstrap/dist/css/bootstrap.min.css"; //bootstrap
import { Route, Routes } from "react-router-dom";
import { Header, Footer, Layout } from "./components";
import { PopupDetail, PopupList } from "./popup";
import "./App.css";
import LoginForm from "./pages/auth/login/LoginForm";
import RegisterForm from "./pages/auth/register/RegisterFrom";
import QrScan from "./pages/qr/QrScan";
import NoticeForm from "./pages/notification/NoticeForm";
import NoticePopupContainer from "./pages/notification/NoticePopupContainer";


function App() {
  return (
    <div>
      <Header />
      <Layout>
        {/* <NoticePopupContainer /> */}
        <Routes>
          {/* <Route path='/auth/register' element={<RegisterForm />} /> */}
          <Route path='/auth/register' element={<RegisterForm />} />
          <Route path='/auth/login' element={<LoginForm />} />
           <Route path='/chart/data' element = {<Chart />} />
          <Route path="/auth/change-password" element={<ChangePasswordForm />} />
            <Route path="/qr-scan" element={<QrScan />} />
          <Route path="/popup/detail/:popupId" element={<PopupDetail />} />
          <Route path="/popup/list" element={<PopupList />} />
          <Route path="/auth/register" element={<RegisterForm />} />
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/qr-scan" element={<QrScan />} />
          <Route path="/mypage/register-noti" element={<NoticeForm />} />
        </Routes>
        <Footer />
      </Layout>
    </div>
  );
}

export default App;
