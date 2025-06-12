import 'bootstrap-icons/font/bootstrap-icons.css'; //bootstrap-icons
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Footer, Header, Layout } from './components';
import AdminPage from './pages/admin/AdminPage';
import Chart from './pages/analytics/chart';
import ChangePasswordForm from './pages/auth/chage-password/ChangePasswordForm';
import LoginForm from './pages/auth/login/LoginForm';
import RegisterForm from './pages/auth/register/RegisterFrom';
import NoticeForm from "./pages/notification/NoticeForm";
import NoticePopupContainer from "./pages/notification/NoticePopupContainer";
import { ReservationList, ReservationDetail } from "./reservation";
import QrScan from "./pages/qr/QrScan";
import { PopupDetail, PopupList } from "./popup";
import AdminPopupStatistics from './pages/admin/statistics/AdminPopupStatistics';


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
          <Route path='/chart/data' element={<Chart />} />
          <Route path="/auth/change-password" element={<ChangePasswordForm />} />
          <Route path="/qr-scan" element={<QrScan />} />
          <Route path="/popup/detail/:popupId" element={<PopupDetail />} />
          <Route path="/popup/list" element={<PopupList />} />
          <Route path="/auth/register" element={<RegisterForm />} />
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/qr-scan" element={<QrScan />} />
          <Route path="/mypage/register-noti" element={<NoticeForm />} />
          <Route path="/reservation/list" element={<ReservationList />} />
          <Route path="/reservation/detail/:reserveId" element={<ReservationDetail />} />
          <Route path="/admin/popup/list" element={<AdminPage />} />
          <Route path="/admin/popup/statistics/:popupId" element={<AdminPopupStatistics />} />
        </Routes>
        <Footer />
      </Layout>
    </div>
  );
}

export default App;
