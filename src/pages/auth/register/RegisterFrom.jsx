import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressModal from '../../../components/modal/AddressModal';
import axi from '../../../utils/axios/Axios';
import './RegisterForm.css';

const initialFormData = {
  email: '', password: '', nickname: '',
  memberName: '', sex: '', birthDate: '',
  phoneNumber: '', zipcode: '',
  roadAddress: '', detailAddress: '',
  agreement: false,
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isDaumPostOpen, setIsDaumPostOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const handleComplete = (data) => {
    setFormData(prev => ({
      ...prev,
      zipcode: data.zonecode,
      roadAddress: data.roadAddress,
    }));
    setIsDaumPostOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'birthDate') {
      // 숫자만 남기고 최대 8자리 추출
      const digits = value.replace(/\D/g, '').slice(0, 8);

      let formatted = digits;
      if (digits.length >= 5 && digits.length < 7) {
        formatted = `${digits.slice(0, 4)}.${digits.slice(4)}`;
      } else if (digits.length >= 7) {
        formatted = `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
      }

      setFormData(prev => ({ ...prev, birthDate: formatted }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        memberName: formData.memberName,
        sex: formData.sex,
        birthDate: formData.birthDate,
        phoneNumber: formData.phoneNumber,
        roadAddress: formData.roadAddress,
        detailAddress: formData.detailAddress,
        agreement: formData.agreement ? 'Y' : 'N',
      };

      await axi.post('/auth/register', payload);
      setError('');
      setSuccess('회원가입 성공!');
      setFormData({
        email: '', password: '', nickname: '',
        memberName: '', sex: '', birthDate: '',
        phoneNumber: '', zipcode: '',
        roadAddress: '', detailAddress: '',
        agreement: false,
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
          <input type="email" name="email" placeholder="Email" required autoComplete="username" />
          <button type="button" className="check-button">중복 확인</button>
        </div>

        <input type="password" autoComplete="new-password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

        <div className="input-group">
          <input type="text" name="nickname" placeholder="Nickname" value={formData.nickname} onChange={handleChange} required />
          <button type="button" className="check-button">중복 확인</button>
        </div>

        <input type="text" name="memberName" placeholder="이름" value={formData.memberName} onChange={handleChange} required />

        <div className="sex-birth-group">
          <select name="sex" value={formData.sex} onChange={handleChange} required>
            <option value="">성별 선택</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>

          <input
            type="text"
            name="birthDate"
            placeholder="YYYY.MM.DD"
            inputMode="numeric"  // 모바일에서 숫자 키패드
            value={formData.birthDate}
            onChange={handleChange}
            maxLength={10}
            required
          />


        </div>
        <input type="tel" name="phoneNumber" placeholder="전화번호" value={formData.phoneNumber} onChange={handleChange} required />

        <div className="input-group">
          <input
            type="text"
            name="zipcode"
            placeholder="우편번호"
            value={formData.zipcode}
            onChange={handleChange}
            readOnly
          />
          <button type="button" className="check-button" onClick={() => setIsDaumPostOpen(true)}>
            우편번호 찾기
          </button>
        </div>

        {isDaumPostOpen && (
          <AddressModal onComplete={handleComplete} onClose={() => setIsDaumPostOpen(false)} />
        )}

        <input
          type="text"
          name="roadAddress"
          placeholder="도로명 주소"
          value={formData.roadAddress}
          onChange={handleChange}
          readOnly
        />
        <input type="text" name="detailAddress" placeholder="상세 주소" value={formData.detailAddress} onChange={handleChange} required />

        <label className="checkbox-group">
          <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} />
          개인정보 처리방침에 동의합니다
        </label>

        <button type="submit">가입하기</button>
      </form>
    </div>
  );
};

export default RegisterForm;
