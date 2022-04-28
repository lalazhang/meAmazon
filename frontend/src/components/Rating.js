function Rating(props) {
  const { rating, numReviews } = props;
  return (
    <div className="rating">
      <p>{`Rating:${rating} Reviews:${numReviews}`}</p>
      <span>
        {rating >= 1 ? (
          <i className="fa fa-star"></i>
        ) : rating >= 0.5 ? (
          <i className="fas fa-star-half-alt"></i>
        ) : (
          <i className="far fa-star"></i>
        )}
      </span>
      <span>
        {rating >= 2 ? (
          <i className="fa fa-star"></i>
        ) : rating >= 1.5 ? (
          <i className="fas fa-star-half-alt"></i>
        ) : (
          <i className="far fa-star"></i>
        )}
      </span>
      <span>
        {rating >= 3 ? (
          <i className="fa fa-star"></i>
        ) : rating >= 2.5 ? (
          <i className="fas fa-star-half-alt"></i>
        ) : (
          <i className="far fa-star"></i>
        )}
      </span>
      <span>
        {rating >= 4 ? (
          <i className="fa fa-star"></i>
        ) : rating >= 3.5 ? (
          <i className="fas fa-star-half-alt"></i>
        ) : (
          <i className="far fa-star"></i>
        )}
      </span>
      <span>
        {rating >= 5 ? (
          <i className="fa fa-star"></i>
        ) : rating >= 4.5 ? (
          <i className="fas fa-star-half-alt"></i>
        ) : (
          <i className="far fa-star"></i>
        )}
      </span>
      <span>{` ${numReviews} reviews`}</span>
    </div>
  );
}

export default Rating;
