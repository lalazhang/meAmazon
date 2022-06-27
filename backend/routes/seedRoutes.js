import express from 'express';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import data from '../data.js';
//const { model } = require('mongoose');

const seedRouter = express.Router();
seedRouter.get('/test', async (req, res) => {
  //await
  await Product.remove({});
  const createProducts = await Product.insertMany(data.product);
  //res.send({ createProducts });

  await User.remove({});
  const createUsers = await User.insertMany(data.users);
  res.send({ createProducts, createUsers });
});

export default seedRouter;