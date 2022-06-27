import express from 'express';
import Product from '../models/productModel.js';

const productRouter = express.Router();
productRouter.get('/', async (req, res) => {
  //await
  const products = await Product.find();
  console.log(products);
  res.send(products);
});

productRouter.get('/:slug', async (req, res) => {
  //why req.params does not work ???
  const product = await Product.findOne({ slug: req.params.slug });

  console.log(product);
  if (product) {
    res.send({ product });
  } else {
    res.status(404).send({ customizedMessage: 'Product not Found Hahaha' });
  }
});
productRouter.get('/haha/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  console.log('productRoutes get haha/:id', product);
  if (product) {
    res.send({ product });
  } else {
    res.status(404).send({ message: 'Product not Found' });
  }
});
export default productRouter;
