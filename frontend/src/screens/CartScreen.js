import { useContext, useState } from 'react';
import { Store } from '../Store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import { Button, ListGroup, ListGroupItem, Nav } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

//./means this folder, ../ means go back to parent folder
function CartScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const navigate = useNavigate();
  const updateCartHandler = async (item, newQuantity) => {
    //check if parased product is out of stock
    // await axios.get needs to be inside of try, otherwise 404 error
    try {
      const { data } = await axios.get(
        `/api/products/haha/${item.product._id}`
      );
      if (data.product.countInStock < newQuantity) {
        window.alert('Sorry, this Item is Out of Stock, sad face');
        return;
      }
    } catch (error) {
      console.log(error);
    }

    const product = item.product;

    ctxDispatch({
      type: 'ADD_TO_CART1',
      //payload:{...item, quantity: newQuantity}
      payload: { product, quantity: newQuantity },
    });
  };

  const removeItemHandler = (item) => {
    //item is {product{}, quantity:}
    ctxDispatch({ type: 'REMOVE_ITEM', payload: item.product });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };
  return (
    <div>
      <Helmet>
        <title>Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <MessageBox variant="secondary">
          You Cart is Empty
          <Nav className="justify-content-center">
            <Link to="/">Go Shopping</Link>
          </Nav>
        </MessageBox>
      ) : (
        <Row>
          <Col md="8">
            <ListGroup>
              {' '}
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product._id}>
                  {' '}
                  <Row>
                    <Col md="4">
                      {' '}
                      <img
                        className="img-fluid rounded img-thumbnail"
                        src={item.product.image}
                        alt={item.product.name}
                      ></img>{' '}
                      <Link to={`/product/${item.product.slug}`}>
                        {item.product.name}
                      </Link>
                    </Col>
                    <Col md="4">
                      <Button
                        variant="light"
                        disabled={item.quantity === 1}
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                      >
                        {' '}
                        <i className="fas fa-minus-circle "></i>
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="light"
                        disabled={item.quantity === item.product.countInStock}
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                      >
                        <i className="fas fa-plus-circle "></i>
                      </Button>
                    </Col>
                    <Col md="2">${item.product.price}</Col>
                    <Col md="2">
                      <Button
                        variant="light"
                        onClick={() => removeItemHandler(item)}
                      >
                        <i className="fa fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md="4">
            <Card>
              <Card.Body>
                <ListGroup>
                  <ListGroup.Item>
                    <h1>
                      Subtotal:{cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </h1>
                    <h3>
                      Total:$
                      {cartItems.reduce(
                        (a, c) => a + c.product.price * c.quantity,
                        0
                      )}
                    </h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className='="d-grid'>
                      <Button
                        type="button"
                        variant="info"
                        disabled={cartItems.length === 0}
                        onClick={checkoutHandler}
                      >
                        {' '}
                        Proceed to Checkout
                      </Button>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default CartScreen;
