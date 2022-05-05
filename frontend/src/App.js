import data from './data';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import NavBar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavbarBrand from 'react-bootstrap/esm/NavbarBrand';
import { Helmet } from 'react-helmet-async';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Nav } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { Store } from './Store';
function App() {
  const [something, dispatch] = useContext(Store);
  const cartItem = useContext(Store);

  return (
    <BrowserRouter>
      <Helmet>
        <title>Lan Pole Wear</title>
      </Helmet>
      <div className="d-flex flex-column site-container">
        {' '}
        <header>
          <NavBar bg="danger.bg-gradient" expend="lg">
            <Container>
              <LinkContainer to="/">
                <NavBar.Brand>Lan Pole Wear</NavBar.Brand>
              </LinkContainer>
              <Nav>{something}</Nav>
              <Button
                onClick={() => {
                  dispatch({ type: 'ADD_TO_CART' });
                }}
              >
                {something}
              </Button>
            </Container>
          </NavBar>{' '}
        </header>
        <main>
          <Container className="mt-3">
            {' '}
            <Routes>
              <Route path="/" element={<HomeScreen />}></Route>
              <Route path="/product/:slug" element={<ProductScreen />}></Route>
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">copyright reserved Lan</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
