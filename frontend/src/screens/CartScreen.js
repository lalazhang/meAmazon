import { useContext, useState } from 'react';
import { Store } from '../Store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//./means this folder, ../ means go back to parent folder
function CartScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  return (
    <div>
      <h1>Shopping Cart</h1>
      <Row>
        {cartItems.map((item) => (
          <div>
            {' '}
            <Col md="3">{item.product.name}</Col>
          </div>
        ))}
      </Row>
    </div>
  );
}

export default CartScreen;
