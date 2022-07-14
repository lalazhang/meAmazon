import React, { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store.js';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps.js';

function ShippingAdressScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(
    //the following line causes warning
    shippingAddress ? shippingAddress.fullName : ''
  );
  const [address, setAddress] = useState(
    shippingAddress ? shippingAddress.address : ''
  );
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState(
    shippingAddress ? shippingAddress.country : ''
  );

  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
      //navigate('/');
    }
  }, [userInfo, navigate]);

  const onSubmitHandler = (e) => {
    //continue button type is submit
    //so clicking the button submit the form and triggers this function
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({ fullName, address, city, postalCode, country })
    );
    navigate('/payment');

    console.log(
      localStorage.getItem('shippingAddress'),
      'saved to localStorage'
    );
  };
  return (
    <div>
      <Helmet>
        <title>Shipping Adress</title>
      </Helmet>
      <CheckoutSteps step1="true" step2="true"></CheckoutSteps>
      <div className="small-container">
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={onSubmitHandler}>
          <Form.Group className='="mb-3' controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='="mb-3' controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='="mb-3' controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='="mb-3' controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='="mb-3' controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ShippingAdressScreen;
