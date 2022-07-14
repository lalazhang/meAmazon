import React, { useContext, useEffect, useReducer } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store.js';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../util/util';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { PromiseProvider } from 'mongoose';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
function reducer(state, action) {
  switch (action.type) {
    //fetching order info
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '', order: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return {
        ...state,
        loadingPay: false,
        successPay: false,
        error: action.payload,
      };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
}
export default function OrderScreen() {
  const [{ loading, error, order, loadingPay, successPay }, orderDispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
      order: {},
      loadingPay: false,
      successPay: false,
    });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const { _id: orderId } = useParams();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderId) => {
        return orderId;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        orderDispatch({ type: 'PAY_REQUEST' });
        //update payment information in backend
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        orderDispatch({ type: 'PAY_SUCCESS' });
      } catch (error) {
        orderDispatch({ type: 'PAY_FAIL', payload: getError(error) });
        toast.error(getError(error));
      }
    });
  };
  const onError = (error) => {
    toast.error(getError(error));
  };
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/orders');
    }
    //fetchData fetch the order details
    const fetchData = async () => {
      try {
        orderDispatch({ type: 'FETCH_REQUEST' });
        console.log(loading);
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        console.log(data);
        orderDispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        toast.error(getError(error));
        orderDispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    console.log(order);
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchData();
      if (successPay) {
        orderDispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keyspaypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: { 'client-id': clientId, currency: 'CAD' },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }

    console.log(order);
  }, [navigate, userInfo, order, loading, orderId, paypalDispatch, successPay]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variat="danger">{error}</MessageBox>
  ) : (
    <div>
      {userInfo.email}
      {orderId}
      <div>
        <Helmet>
          <title>{orderId}</title>
        </Helmet>
        <h1 className="my-3">Order {orderId}</h1>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Shipping</Card.Title>
                <Card.Text>
                  <strong>Name:</strong>
                  {order.shippingAddress.fullName}
                  <br />
                  <strong>Address: </strong>
                  {order.shippingAddress.address},&nbsp;
                  {order.shippingAddress.city},&nbsp;
                  {order.shippingAddress.postalCode},&nbsp;
                  {order.shippingAddress.country}
                </Card.Text>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at {order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Delivered yet</MessageBox>
                )}
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                  <strong>Payment Method: </strong> {order.paymentMethod}
                  {order.isPaid ? (
                    <MessageBox variant="success">
                      Paid at {order.paidAt}
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not paid yet</MessageBox>
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Card.Title>Item Summary </Card.Title>
                <ListGroup>
                  {' '}
                  {order.orderItems.map((item) => (
                    <ListGroupItem key={item._id}>
                      <Row>
                        <Col md={6}>
                          <img
                            className="img-fluid rounded img-thumbnail"
                            src={item.image}
                            alt={item.slug}
                          ></img>
                          <Link
                            className="link-text-color"
                            to={`/product/${item.slug}`}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={3}>{item.quantity}</Col>
                        <Col md={3}>CAD${item.price}</Col>
                      </Row>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                {' '}
                <Card.Title> Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>${order.itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${order.shippingPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${order.taxPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Order Total</strong>
                      </Col>
                      <Col>${order.totalPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  {!order.isPaid && (
                    <ListGroup.Item>
                      {isPending ? (
                        <LoadingBox />
                      ) : (
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          >
                            Pay
                          </PayPalButtons>
                        </div>
                      )}
                      {loadingPay && <loadingBox></loadingBox>}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
