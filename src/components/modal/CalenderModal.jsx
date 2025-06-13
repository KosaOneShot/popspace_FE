import { useState } from 'react';

export default function CalendarModal({ show, date, onClose, onApply }) {
  const [tmp, setTmp] = useState(date);
  if (!show) return null;
  return (
    <div className="modal d-block" style={{ inset: 0, position: 'fixed', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1001 }}>
      <div className="modal-dialog"
           style={{ maxWidth: '300px', marginTop: '150px' }}>
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
            <button className="btn btn-secondary" onClick={onClose}>취소</button>
            <button className="btn btn-primary" onClick={() => { onApply(tmp); onClose(); }}>
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}