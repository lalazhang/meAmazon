import { useContext, useState } from 'react';
import { Store } from '../Store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import { ListGroup, ListGroupItem, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
//./means this folder, ../ means go back to parent folder
function CartScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  return (
    <div>
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <MessageBox variant="secondary">
          YOUR CART IS EMPTY
          <Nav className="justify-content-center">
            <Link to="/">Go Shopping</Link>
          </Nav>
        </MessageBox>
      ) : (
        <Row>
          <ListGroup>
            {' '}
            {cartItems.map((item) => (
              <ListGroupItem key={item.product._id}>
                {' '}
                <Row>
                  <Col md="4">
                    <img
                      className="img-fluid rounded img-thumbnail"
                      src={item.product.image}
                      alt={item.product.name}
                    ></img>{' '}
                    <Link to={`/product/${item.product.slug}`}>
                      {item.product.name}
                    </Link>
                  </Col>
                </Row>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Row>
      )}
    </div>
  );
}

export default CartScreen;
