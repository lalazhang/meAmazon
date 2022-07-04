import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Store } from '../Store.js';
// ../ go back to parent folder, ./ current folder
import CheckoutSteps from '../components/CheckoutSteps';
import { Navigate, useNavigate } from 'react-router-dom';
export default function PaymentMethodScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  // const {shippingAddress,paymentMethodName}=state does not work
  const {
    cart: { shippingAddress, paymentMethodName },
  } = state;

  const [paymentMethod, setPaymentMethod] = useState(
    paymentMethodName ? paymentMethodName.paymentMethod : ''
  );

  const navigate = useNavigate();

  useEffect(() => {
    // if(shippingAddress.address==='') does not work
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    //payload: paymentMethod sends string
    //payload: {paymentMethod} sends object
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
    localStorage.setItem('paymentMethod', JSON.stringify({ paymentMethod }));
    navigate('/placeOrder');
    console.log(paymentMethodName);
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className="container smaller-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <Form onSubmit={onSubmitHandler}>
          <Form.Check
            type="radio"
            id="PayPal"
            label="PayPal 👻"
            value="PayPal"
            checked={paymentMethod === 'PayPal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <Form.Check
            type="radio"
            id="Stripe"
            label="Stripe 😈"
            value="Stripe"
            checked={paymentMethod === 'Stripe'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <Button type="submit">Almost There</Button>
        </Form>
      </div>
    </div>
  );
}
