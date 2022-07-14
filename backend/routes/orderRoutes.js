import React from 'react';
import express from 'express';
import Order from '../models/orderModel.js';
import expressAsyncHandler from 'express-async-handler';
import { generateToken } from '../util.js';
import { isAuth } from '../util.js';
const orderRouter = express.Router();
orderRouter.post(
  '/',
  isAuth,
  // isAuth.next() directs to expressAsyncHandler
  expressAsyncHandler(async (req, res) => {
    console.log('reached backend');
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({
        ...x.product,
        quantity: x.quantity,
        product: x.product._id,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });
    const orderCreated = await newOrder.save();
    console.log('order created', orderCreated);
    res.send(orderCreated);
    res.end();
  })
);
orderRouter.get(
  '/:orderId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findOne({ _id: req.params.orderId });
    //console.log('Order found with orderId', order);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
    res.end();
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true; //update payment information PayPalButton onApprove
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.emeial_address,
      };
      const updateOrder = await order.save();
      res.send({ message: 'Order Paid', order: updateOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);
export default orderRouter;
