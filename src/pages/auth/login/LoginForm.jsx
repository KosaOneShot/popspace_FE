import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/context/AuthContext';
import axi from '../../../utils/axios/Axios';
import styles from './LoginForm.module.css';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const { setAuth } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const res = await axi.post('/api/auth/login', { email, password });
      const { role, nickname } = res.data;

      setAuth({ role, nickname });
      setError('');
      navigate('/main');
    } catch (err) {
      const message = err.response?.data?.message || '로그인 실패';
      setError("로그인 실패");
    }
  };

  return (
    <div className={styles.LoginFormContainer}>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>Login</h1>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.loginFormInput}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.loginFormInput}
          />
          <button type="submit" className={styles.loginFormButton}>로그인</button>
        </form>
        
        <div className={styles.loginFooterLinks}>
          <Link to="/auth/change-password" className={styles.footerLink}>
            비밀번호 찾기
          </Link>
          <Link to="/auth/register" className={styles.footerLink}>
            회원이 아니신가요?
          </Link>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
