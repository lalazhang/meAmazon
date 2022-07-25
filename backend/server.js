import express from 'express';
import path from 'path';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';

dotenv.config();
//Mongoose is a MongoDB object modeling tool
//designed to work in an asynchronous environment.
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to mongoDb');
  })
  .catch((error) => {
    console.log(error.message);
  });

const app = express();

// post request body wont be received without express.json()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//get paypal client ID
///api/keys/paypal does not work
app.get('/api/keyspaypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sandbox');
});
//port 5001, localhost:5001/api/seed/test
//seedRouter has to run first to remove and create Prouct/User
app.use('/api/seed', seedRouter);

//get products from productRouter localhost:5001/api/products
app.use('/api/products', productRouter);
app.use('/api/user', userRouter);
app.use('/api/orders', orderRouter);

//returns current directory path
const _dirname = path.resolve();
//serve all files in /frontend/build as static files
app.use(express.static(path.join(_dirname, '/frontend/build')));
//everything user enters will be servered by /frontend/build/index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(_dirname, '/frontend/build/index.html'));
});
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

/** app.get('/api/products', (req, res) => {
   res.send({ data });
 }); */

/** 
 app.get('/api/products/:slug', (req, res) => {
   //req.params.slug to return slug content
   const slug = req.params;
   console.log(slug); 
   const product = data.product.find((x) => x.slug === req.params.slug);
   if (product) {
     res.send({ product });
   } else {
     res.status(404).send({ customizedMessage: 'Product not Found Hahaha' });
   }
   });
 */

/**app.get('/api/products/haha/:id', (req, res) => {
  //send data where slug = data.product.slug
  console.log(req.params.id);
  const reqid = req.params.id;
  const product = data.product.find((x) => x._id === reqid);
  if (product) {
    res.send({ product });
  } else {
    res.status(404).send({ message: 'Product not Found' });
  }
}); */

//PORT
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
