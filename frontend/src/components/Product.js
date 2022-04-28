import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';
export default function Product(props) {
  const product = props.product;
  return (
    <Card key={product.slug}>
      {' '}
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} alt="top"></img>
      </Link>{' '}
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title> {product.name}</Card.Title>
          <Card.Title>{product.brand}</Card.Title>
        </Link>
        <Card.Text>{`CAD ${product.price}`}</Card.Text>
        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
        ></Rating>
        <Button variant="outline-secondary">Add to cart</Button>
      </Card.Body>
    </Card>
  );
}
