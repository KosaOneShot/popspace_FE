import { Route, Routes } from 'react-router-dom';
import './App.css';
import Chart from './page/analytics/chart';





function App() {
  return (
    <div>
      {/* <PageHeader /> */}
      <Routes>
        {/* <Route path='/auth/register' element={<RegisterForm />} /> */}
        {/* <Route path='/auth/login' element={<LoginForm />} /> */}
        {/* <Route path='/main' element = {<Main /> }/> */}
        <Route path='/chart/data' element = {<Chart />} />
      </Routes>
    </div>
  );
}

export default App;
