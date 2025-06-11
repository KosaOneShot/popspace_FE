// src/components/modal/AddressModal.jsx
import DaumPostcode from 'react-daum-postcode';
import styles from './AddressModal.module.css';

const AddressModal = ({ onComplete, onClose }) => (
  <div className={styles.modalContainer}>
    <div style={{ textAlign: 'right' }}>
      <button onClick={onClose} className={styles.closeButton}>
        ✕
      </button>
    </div>
    <DaumPostcode onComplete={onComplete} />
  </div>
);

export default AddressModal;
