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
const ReviewList = ({ reviews }) => {
  if (!reviews.length) return null;

  const avg =
    reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;

  return (
    <div className="mb-5">
      <h6 className="fw-bold mb-3">리뷰 {reviews.length}</h6>
      <div className="d-flex align-items-center mb-2">
        <i className="bi bi-star-fill text-warning me-1" />
        <span className="fw-bold me-2">{avg.toFixed(1)}</span>
        <span className="text-muted small">(전체 {reviews.length}개)</span>
      </div>
      {reviews.map((rev) => (
        <ReviewItem
          key={rev.review_id}
          rating={rev.rating}
          content={rev.content}
          createdAt={rev.created_at}
        />
      ))}
    </div>
  );
};

export default ReviewList;