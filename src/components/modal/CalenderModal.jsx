import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function CalendarModal({ show, date, onClose, onApply }) {
  const [tmp, setTmp] = useState(date);
  if (!show) return null;

  return createPortal(
    <div
      className="modal d-block"
      style={{
        inset: 0,
        position: 'fixed',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1001
      }}
      onClick={onClose}           // 회색 배경 클릭 시 닫기
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: '300px', margin: '150px auto' }}
        onClick={e => e.stopPropagation()}  // 모달 내부 클릭 시 전파 막기
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">날짜 선택</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <input
              type="date"
              className="form-control"
              value={tmp}
              onChange={e => setTmp(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                onApply(tmp);
                onClose();
              }}
            >
                선택
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}