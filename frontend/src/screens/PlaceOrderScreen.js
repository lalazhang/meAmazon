import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../components/CheckoutSteps';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';
import { Store } from '../Store';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button, ListGroup, ListGroupItem, Nav, Toast } from 'react-bootstrap';
import { getError } from '../util/util';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  //reducer is independant of useReducer() component
  const reducer = (state, action) => {
    switch (action.type) {
      case 'CREATE_REQUEST':
        return { ...state, loading: true };
      case 'CREATE_SUCCESS':
        return { ...state, loading: false };
      case 'CREATE_FAIL':
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  //does Store export a useReducer?
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart,
    cart: { cartItems, shippingAddress, paymentMethodName },
  } = state;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.product.price * c.quantity, 0)
  );
  //cart.itemsPrice = round2(cartItems.reduce((a.c)=>a+c.quantity*c.price,0));
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(7.99);
  cart.taxPrice = round2(0.13 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      //sendOrder is receiving an object so no need to {sendOrder}
      const sendOrder = await axios.post(
        '/api/orders/',
        {
          orderItems: cartItems,
          //try cart.shippingAddress??
          shippingAddress: cart.shippingAddress,
          paymentMethod: paymentMethodName,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },

        //custom headers
        //authentication is the process of verifying who someone is
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
        //authorization is the process of verifying what specific applications, files, and data a user has access to
      );
      //ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      //localStorage.removeItem('items');
      console.log(
        'after removing local.Storage items',
        JSON.parse(localStorage.getItem('items'))
      );
      console.log(sendOrder);
      navigate(`/order/${sendOrder.data._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err.response.data));
    }
  };

  useEffect(() => {
    console.log(cart.cartItems);
    if (!cart.paymentMethodName) {
      navigate('/payment');
    }
  }, [cart.cartItems, navigate]);

  //mb-3 marginbottom, my-3 y-for both *-top *bottom
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Place Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping to</Card.Title>
              <Card.Subtitle>
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city},
                {shippingAddress.postalCode} <br />
                {shippingAddress.country}
              </Card.Subtitle>
              <Card.Text>
                <strong>Name: </strong>
                {shippingAddress.fullName}
              </Card.Text>
              <Link className="link-text-color" to="/shipping">
                Edit
              </Link>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Items:</Card.Title>
              <ListGroup variant="flush">
                {
                  //list.map(()=>{})does not work
                  cartItems.map((item) => (
                    <ListGroupItem key={item.product._id}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          {' '}
                          <img
                            className="img-fluid rounded img-thumbnail"
                            src={item.product.image}
                            alt={item.product.name}
                          ></img>
                          <Link
                            className="link-text-color"
                            to={`/product/${item.product.slug}`}
                          >
                            {item.product.name}
                          </Link>
                        </Col>
                        <Col md={3}>{item.quantity}</Col>
                        <Col md={3}>CA${item.product.price}</Col>
                      </Row>
                    </ListGroupItem>
                  ))
                }
              </ListGroup>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method: </strong>
                {paymentMethodName.paymentMethod}
              </Card.Text>
              <Link className="link-text-color" to="/payment">
                Edit
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Text>
              <Card.Title> Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${cart.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${cart.shippingPrice}</Col>
                    <span className="span-text-color">
                      free shipping with purchase over CA$100
                    </span>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>13% (HST)</Col>
                    <Col>${cart.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Order Total</Col>
                    <Col>${cart.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      className="button-style"
                      type="button"
                      onClick={placeOrderHandler}
                      diabled={cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                    <div>{loading && <LoadingBox></LoadingBox>}</div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
