import 'bootstrap/dist/css/bootstrap.min.css';     //bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; //bootstrap-icons
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Header, Footer, Layout } from './components'
import { PopupDetail, PopupList } from './popup';

function App() {
  return (
    <div>
        <Header/>
        <Layout>
          <Routes>
            <Route path="/popup/detail/:popupId" element={<PopupDetail />} />
            <Route path='/popup/list' element={<PopupList/>} />
            {/* <Route path='/auth/register' element={<RegisterForm />} /> */}
          </Routes>
          <Footer/>
      </Layout>
    </div>
  );
}

export default App;
