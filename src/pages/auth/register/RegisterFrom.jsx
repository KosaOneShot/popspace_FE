import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axi from '../../../utils/axios/Axios';
import './RegisterForm.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    phone: '',
    birth: '',
    zipcode: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axi.post('/auth/register', formData);
      setError('');
      setSuccess('회원가입 성공!');
      setFormData({
        email: '', password: '', nickname: '',
        phone: '', birth: '', zipcode: '', address: ''
      });
      navigate('/auth/login');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || '오류 발생');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Sign Up</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form className="register-form" onSubmit={handleSubmit}>
        
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="button" className="check-button">중복 확인</button>
        </div>

        <input
          type="password"
          name="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="input-group">
          <input
            type="text"
            name="nickname"
            placeholder="nickname"
            value={formData.nickname}
            onChange={handleChange}
            required
          />
          <button type="button" className="check-button">중복 확인</button>
        </div>

        <input
          type="tel"
          name="phone"
          placeholder="phone-number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="birth"
          placeholder="생년월일"
          value={formData.birth}
          onChange={handleChange}
        />

        <div className="input-group">
          <input
            type="text"
            name="zipcode"
            placeholder="우편번호"
            value={formData.zipcode}
            onChange={handleChange}
          />
          <button type="button" className="check-button">우편번호 찾기</button>
        </div>

        <input
          type="text"
          name="address"
          placeholder="상세 주소"
          value={formData.address}
          onChange={handleChange}
        />

        <button type="submit">가입하기</button>
      </form>
    </div>
  );
};

export default RegisterForm;
