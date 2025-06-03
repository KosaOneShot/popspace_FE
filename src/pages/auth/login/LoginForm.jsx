import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/context/AuthContext';
import axi from '../../../utils/axios/Axios';
import './LoginForm.css';

const LoginForm = () => {
  const { setAuth } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axi.post('/auth/login', formData);
      const { role, nickname } = result.data;

      setAuth({ role, nickname });
      setSuccess('로그인 성공!');
      setError('');
      setFormData({ email: '', password: '' });
      navigate('/main');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || '로그인 실패');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">로그인</button>
      </form>

      <div className="login-footer-links">
        <span>비밀번호 찾기</span>
        <span>회원이 아니신가요?</span>
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default LoginForm;
