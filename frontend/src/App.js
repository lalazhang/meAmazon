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
import { Button, Nav, NavDropdown } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingAdressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  // calculate total quantity of items in cart,
  //replaced by recursive function array.reduce((previous,current)=>previous+current.quantity, 0)
  //first call: previous =0, current is array[0] value, previous +current.quantity becomes next previous
  let totalQuantityInCart = 0;
  state.cart.cartItems.map((item) => {
    totalQuantityInCart = totalQuantityInCart + item.quantity;
  });
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
  };
  return (
    <BrowserRouter>
      <Helmet>
        <title>Lan Pole Wear</title>
      </Helmet>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <NavBar bg="danger.bg-gradient" expend="lg">
            <Container>
              <LinkContainer to="/">
                <NavBar.Brand>Lan Pole Wear</NavBar.Brand>
              </LinkContainer>
              <NavBar.Brand>
                {state.userInfo ? (
                  <NavDropdown
                    title={state.userInfo.name}
                    id="basic-nav-dropdown"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item> User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item> Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to={`#signout`}
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign in
                  </Link>
                )}
              </NavBar.Brand>
              <Nav className="justify-content-end">
                <Link to="/cart">
                  {' '}
                  <i className="fas fa-shopping-bag"></i>
                  {state.cart.cartItems.reduce((a, c) => a - c.quantity, 0)}
                </Link>
              </Nav>
            </Container>
          </NavBar>{' '}
        </header>
        <main>
          <Container className="mt-3">
            {' '}
            <Routes>
              <Route path="/" element={<HomeScreen />}></Route>
              <Route path="/product/:slug" element={<ProductScreen />}></Route>
              <Route path="/cart" element={<CartScreen />}></Route>
              <Route path="/signin" element={<SigninScreen />}></Route>
              <Route path="/signup" element={<SignupScreen />}></Route>

              <Route
                path="/shipping"
                element={<ShippingAdressScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              <Route path="/placeOrder" element={<PlaceOrderScreen />}></Route>
              <Route path="/order/:_id" element={<OrderScreen />}></Route>
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
