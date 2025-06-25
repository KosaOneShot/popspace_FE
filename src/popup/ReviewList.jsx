import React, { useState, useEffect } from 'react';
import { fetchReviewPage } from './popupAxios';

/** 리뷰 한개 렌더링하는 컴포넌트 */
const ReviewItem = ({ rating, content, createdAt }) => (
  <div className="mb-4">
    <div className="d-flex align-items-center mb-1">
      <i className="bi bi-star-fill text-warning me-1" />
      <span className="fw-bold me-2">{rating}</span>
      <span className="text-muted small">
        {new Date(createdAt).toLocaleDateString()}
      </span>
    </div>
    <p className="mb-1">{content}</p>
  </div>
);

/** 리뷰 목록을 렌더링하는 컴포넌트 */
const ReviewList = ({ popupId }) => {
  const [reviews, setReviews] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [page, setPage] = useState(1);
  const size = 3;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetchReviewPage(popupId, page, size);
        setReviews(response.reviewList || []);
        setTotalCount(response.reviewCountAvg.totalCount || 0);
        setAverageRating(response.reviewCountAvg.averageRating || 0);
        console.log('리뷰 목록:', response.reviewList);
        console.log('총 리뷰 수:', response.totalCount);
      } catch (error) {
        setReviews([]);
      }
      setLoading(false);
    };
    fetchReviews();
  }, [popupId, page]);

  const paginatedReviews = reviews;

  if (loading) {
    return (
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold m-0">리뷰 ({totalCount})</h5>
          <div className="d-flex align-items-center">
            <span className="me-2">사용자 총 평점</span>
            <span className="fw-bold me-3">{averageRating.toFixed(1)}</span>
          </div>
        </div>
        <div className="card shadow-sm p-4 text-center text-muted">
          로딩 중...
        </div>
      </div>
    );
  }
  console.log('받은 review 목록:', reviews);

  if (reviews.length === 0) {
    return (
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold m-0">리뷰 ({totalCount})</h5>
          <div className="d-flex align-items-center">
            <span className="me-2">사용자 총 평점</span>
            <span className="fw-bold me-3">{averageRating.toFixed(1)}</span>
          </div>
        </div>
        <div className="card shadow-sm p-4 text-center text-muted">
          리뷰가 없습니다
        </div>
      </div>
    );
  }

  const avg =
    reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold m-0">리뷰 ({totalCount})</h5>
        <div className="d-flex align-items-center">
          <span className="me-2">사용자 총 평점</span>
          <span className="fw-bold me-3">{averageRating.toFixed(1)}</span>
        </div>
      </div>
      <div className="row g-4">
        {paginatedReviews.map((rev, idx) => (
          <div key={rev.reviewId ?? idx} className="col-12">
            <div className="card mb-3 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(rev.nickname)}&background=f3c5ff&color=fff&rounded=true&size=40`}
                    alt={rev.nickname}
                    className="rounded-circle me-3 shadow-sm"
                    width="40"
                    height="40"
                  />
                  <div className="fw-semibold" style={{color : '#a178df'}}>{rev.nickname}</div>
                  <small className="text-muted ms-auto">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <div className="mb-2 d-flex align-items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i
                      key={i}
                      className={`bi me-1 ${
                        i < rev.rating ? 'bi-star-fill text-warning' : 'bi-star text-warning'
                      }`}
                    />
                  ))}
                  <span className="card-text text-body-secondary ms-2">{rev.content}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button
              type="button"
              className="page-link"
              style={{ color: '#000', border: '1px solid #dee2e6' }}
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              onFocus={e => e.target.style.backgroundColor = '#ccc'}
              onBlur={e => e.target.style.backgroundColor = ''}
            >
              &lt;
            </button>
          </li>
          {Array.from({ length: Math.ceil(totalCount / size) }, (_, i) => (
            <li key={i + 1} className="page-item">
              <button
                type="button"
                className="page-link"
                style={{
                  color: '#000',
                  backgroundColor: page === (i + 1) ? '#ccc' : '',
                  border: '1px solid #dee2e6'
                }}
                onClick={() => setPage(i + 1)}
                onFocus={e => e.target.style.backgroundColor = '#929292'}
                onBlur={e => e.target.style.backgroundColor = ''}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${page === Math.ceil(totalCount / size) ? 'disabled' : ''}`}>
            <button
              type="button"
              className="page-link"
              style={{ color: '#000', border: '1px solid #dee2e6' }}
              onClick={() => setPage(page + 1)}
              disabled={page === Math.ceil(totalCount / size)}
              onFocus={e => e.target.style.backgroundColor = '#929292'}
              onBlur={e => e.target.style.backgroundColor = ''}
            >
              &gt;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ReviewList;