import express from 'express';
import data from './data.js';
const app = express();

app.get('/api/products', (req, res) => {
  res.send({ data });
});
app.get('/api/products/:slug', (req, res) => {
  //req.params.slug to return slug content
  const slug = req.params;
  console.log(slug);
  //send data where slug = data.product.slug
  const product = data.product.find((x) => x.slug === req.params.slug);
  if (product) {
    res.send({ product });
  } else {
    res.status(404).send({ customizedMessage: 'Product not Found Hahaha' });
  }
});

//PORT
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
