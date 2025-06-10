import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressModal from '../../../components/modal/AddressModal';
import axi from '../../../utils/axios/Axios';
import styles from './RegisterForm.module.css';
import birthDateFormat from "../../../utils/birthDateFormat";

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
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);
  const [emailCheckMessage, setEmailCheckMessage] = useState('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');

  const [error, setError] = useState('');

  const handleAddressComplete = (data) => {
    setFormData(prev => ({
      ...prev,
      zipcode: data.zonecode,
      roadAddress: data.roadAddress,
    }));
    setIsDaumPostOpen(false);
  };

  const handleChange = ({ target: { name, value, type, checked } }) => {
    const nextValue =
      name === 'birthDate'
        ? birthDateFormat(value)
        : type === 'checkbox'
          ? checked
          : value;

    setFormData(prev => ({
      ...prev,
      [name]: nextValue,
    }));

    if (name === 'email') {
      setIsEmailAvailable(null);
      setEmailCheckMessage('');
    }
    if (name === 'nickname') {
      setIsNicknameAvailable(null);
      setNicknameCheckMessage('');
    }
  };

  const handleCheckEmail = async () => {
    try {
      console.log(formData.email);

      const res = await axi.post('/auth/email/check-duplication', {
        email: formData.email
      });

      if (res.status === 200) {
        setIsEmailAvailable(true);
        setEmailCheckMessage('사용 가능한 이메일입니다.');
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setIsEmailAvailable(false);
        setEmailCheckMessage('이미 사용 중인 이메일입니다.');
      } else {
        setIsEmailAvailable(false);
        setEmailCheckMessage('검증 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCheckNickname = async () => {
    try {
      console.log(formData.nickname);

      const res = await axi.post('/auth/nickname/check-duplication', {
        nickname: formData.nickname
      });

      if (res.status === 200) {
        setIsNicknameAvailable(true);
        setNicknameCheckMessage('사용 가능한 닉네임입니다.');
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setIsNicknameAvailable(false);
        setNicknameCheckMessage('이미 사용 중인 닉네임입니다.');
      } else {
        setIsNicknameAvailable(false);
        setNicknameCheckMessage('검증 중 오류가 발생했습니다.');
      }
    }
  };

  const buildPayload = () => ({
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
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 이메일 중복 확인 안 했거나 실패한 경우
    if (isEmailAvailable !== true) {
      setError('이메일 중복 확인을 완료해주세요.');
      return;
    }

    // 닉네임 중복 확인 안 했거나 실패한 경우
    if (isNicknameAvailable !== true) {
      setError('닉네임 중복 확인을 완료해주세요.');
      return;
    }

    try {
      const payload = buildPayload();
      console.log(payload);

      await axi.post('/auth/register', payload);
      setError('');
      setFormData(initialFormData);
      navigate('/auth/login');
    } catch (err) {
      console.log('❌ Error response:', err.response);
      setError(err.response?.data?.message || '오류 발생');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.registerTitle}>Sign Up</h2>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className={styles.input} />
          <button type="button" className={styles.checkButton} onClick={handleCheckEmail}>중복 확인</button>
        </div>
        {emailCheckMessage && (
          <p className={isEmailAvailable ? styles.successMessage : styles.errorMessage
          }>
            {emailCheckMessage}
          </p>
        )}

        <input type="password" autoComplete="new-password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className={styles.input} />

        <div className={styles.inputGroup}>
          <input type="text" name="nickname" placeholder="Nickname" value={formData.nickname} onChange={handleChange} required className={styles.input} />
          <button type="button" className={styles.checkButton} onClick={handleCheckNickname}>중복 확인</button>
        </div>
        {nicknameCheckMessage && (
          <p className={isNicknameAvailable ? styles.successMessage : styles.errorMessage}>
            {nicknameCheckMessage}
          </p>
        )}

        <input type="text" name="memberName" placeholder="이름" value={formData.memberName} onChange={handleChange} required className={styles.input} />

        <div className={styles.sexBirthGroup}>
          <select name="sex" value={formData.sex} onChange={handleChange} required>
            <option value="">성별 선택</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>

          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <input type="tel" name="phoneNumber" placeholder="전화번호" value={formData.phoneNumber} onChange={handleChange} required className={styles.input} />

        <div className={styles.inputGroup}>
          <input
            type="text"
            name="zipcode"
            placeholder="우편번호"
            value={formData.zipcode}
            onChange={handleChange}
            readOnly
            className={styles.input}
          />
          <button type="button" className={styles.checkButton} onClick={() => setIsDaumPostOpen(true)}>
            우편번호 찾기
          </button>
        </div>

        {isDaumPostOpen && (
          <AddressModal onComplete={handleAddressComplete} onClose={() => setIsDaumPostOpen(false)} />
        )}

        <input
          type="text"
          name="roadAddress"
          placeholder="도로명 주소"
          value={formData.roadAddress}
          onChange={handleChange}
          readOnly
          className={styles.input}
        />
        <input type="text" name="detailAddress" placeholder="상세 주소" value={formData.detailAddress} onChange={handleChange} required className={styles.input} />

        <label className={styles.checkboxGroup}>
          <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} />
          개인정보 처리방침에 동의합니다
        </label>

        <button type="submit" className={styles.submitButton}>가입하기</button>
      </form>
    </div>
  );
};

export default RegisterForm;
