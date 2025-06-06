import "bootstrap-icons/font/bootstrap-icons.css"; //bootstrap-icons
import "bootstrap/dist/css/bootstrap.min.css"; //bootstrap
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Footer, Header, Layout } from "./components";
import LoginForm from "./pages/auth/login/LoginForm";
import RegisterForm from "./pages/auth/register/RegisterFrom";
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
          <Route path="/auth/register" element={<RegisterForm />} />
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/mypage/register-noti" element={<NoticeForm />} />
        </Routes>
        <Footer />
      </Layout>
    </div>
  );
}

export default App;
