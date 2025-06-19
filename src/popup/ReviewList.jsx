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
  const [page, setPage] = useState(1);
  const size = 3;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetchReviewPage(popupId, page, size);
        setReviews(response.reviewList || []);
        setTotalCount(response.totalCount || 0);
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
        <h6 className="fw-bold mb-3">리뷰</h6>
        <p className="text-muted small">로딩 중...</p>
      </div>
    );
  }
  console.log('?????????reviews:', reviews);
  

  if (reviews == null || reviews.length === 0) {
    return (
      <div className="mb-5">
        <h6 className="fw-bold mb-3">리뷰 0</h6>
        <p className="text-muted small">리뷰가 없습니다</p>
      </div>
    );
  }

  const avg =
    reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;

  return (
    <div className="mb-5">
      <h6 className="fw-bold mb-3">
        리뷰 {reviews.totalCount}
      </h6>
      <div className="d-flex align-items-center mb-2">
        <i className="bi bi-star-fill text-warning me-1" />
        <span className="fw-bold me-2">{avg.toFixed(1)}</span>
        <span className="text-muted small">(전체 {totalCount}개)</span>
      </div>
      {paginatedReviews.map((rev, idx) => (
        <ReviewItem
          key={rev.reviewId ?? idx}  // reviewId가 없으면 인덱스 사용
          rating={rev.rating}
          content={rev.content}
          createdAt={rev.createdAt}
        />
      ))}
      <nav>
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Page {page}
            </span>
          </li>
          <li className={`page-item ${reviews.length < size ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setPage(page + 1)}
              disabled={reviews.length < size}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ReviewList;