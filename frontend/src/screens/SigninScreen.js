import {
  Button,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
function SigninScreen() {
  //useLocation() returns location object from current URL
  //including pathname, search as query string (?), hash #
  //option const {search} = useLocation()
  const currentURL = useLocation();
  const redirectInURL = new URLSearchParams(currentURL.search).get('redirect');
  const redirect = redirectInURL ? redirectInURL : '/';
  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form>
        <FormGroup className="md-3" controlId="email">
          <FormLabel>Email</FormLabel>
          <FormControl type="email" required></FormControl>
        </FormGroup>
        <FormGroup className="mb-3" controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl type="password" required></FormControl>
        </FormGroup>
        <div>
          <Button className="mb-3" type="summit " variant="info">
            Sign In
          </Button>
        </div>
        <div className="mb-3">
          New User?{' '}
          <Link className="link" to={`/signup?redirect=${redirect}`}>
            Register
          </Link>
        </div>
      </Form>
    </Container>
  );
}

export default SigninScreen;
