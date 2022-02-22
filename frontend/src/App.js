import data from './data';

function App() {
  return (
    <div>
      <header>
        <a href="/">me Amazon</a>
      </header>
      <main>
        <h1>Featured Product</h1>
        <div className="products">
          {data.product.map((product) => (
            //Each product object has an unique key value
            <div className="product" key={product.slug}>
              <a href={`/product/${product.slug}`}>
                <img src={product.image} alt="top"></img>
              </a>

              <div className="product-info">
                <a href={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                  <p>{product.brand}</p>
                </a>
                <p>
                  <strong>{`CAD ${product.price}`}</strong>
                </p>
                <button>Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
