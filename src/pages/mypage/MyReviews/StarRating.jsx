import { BsFillMoonStarsFill, BsMoonStars } from "react-icons/bs";

function StarRating({ rating, onChange, readOnly }) {
  return (
    <div className="d-flex gap-1">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= rating ? (
          <BsFillMoonStarsFill
            key={i}
            onClick={() => !readOnly && onChange(i)}
            className={`text-warning ${!readOnly ? "cursor-pointer" : ""}`}
          />
        ) : (
          <BsMoonStars
            key={i}
            onClick={() => !readOnly && onChange(i)}
            className={`text-secondary ${!readOnly ? "cursor-pointer" : ""}`}
          />
        )
      )}
    </div>
  );
}

export default StarRating;
