import 'bootstrap/dist/css/bootstrap.min.css';     //bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; //bootstrap-icons
import './App.css';
import Chart from './page/analytics/chart';
import { Route, Routes } from 'react-router-dom';
import { Header, Footer, Layout } from './components';



function App() {
  return (
    <div>
        <Header/>
        <Layout>
          <Routes>
            {/* <Route path='/auth/register' element={<RegisterForm />} /> */}
             <Route path='/chart/data' element = {<Chart />} />
          </Routes>
          <Footer/>
      </Layout>
    </div>
  );
}

export default App;
