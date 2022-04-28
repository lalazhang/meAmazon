import data from './data';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import NavBar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavbarBrand from 'react-bootstrap/esm/NavbarBrand';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        {' '}
        <header>
          <NavBar bg="danger.bg-gradient" expend="lg">
            <Container>
              <LinkContainer to="/">
                <NavBar.Brand>Lan Pole Wear</NavBar.Brand>
              </LinkContainer>
            </Container>
          </NavBar>{' '}
        </header>
        <main>
          <Container>
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
