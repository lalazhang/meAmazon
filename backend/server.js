import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
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
//port 5001, localhost:5001/api/seed/test
app.use('/api/seed', seedRouter);

//get products from productRouter localhost:5001/api/products
app.use('/api/products', productRouter);
app.use('/api/signin', userRouter);

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
