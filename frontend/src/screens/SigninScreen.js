import {
  Button,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import axios from 'axios';
import { Store } from '../Store';

function SigninScreen() {
  //useLocation() returns location object from current URL
  //including pathname, search as query string (?), hash #
  //option const {search} = useLocation()
  const currentURL = useLocation();
  const redirectInURL = new URLSearchParams(currentURL.search).get('redirect');
  const redirect = redirectInURL ? redirectInURL : '/';

  const [passWord, setPassWord] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  //axios post does not work without async await
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const signInInfo = { passWord, email };
    console.log(signInInfo);
    try {
      const { data } = await axios.post('/api/signin/test', signInInfo);
      console.log(data);
      navigate(`${redirect}`);
      localStorage.setItem('userInfo', JSON.stringify(data));
      ctxDispatch({ type: 'USER_INFO', payload: data });
    } catch (error) {
      alert('Invalid email or password');
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={onSubmitHandler}>
        <FormGroup
          className="mb-3"
          controlId="email"
          onChange={(e) => setEmail(e.target.value)}
        >
          <FormLabel>Email</FormLabel>
          <FormControl type="email" required></FormControl>
        </FormGroup>
        <FormGroup
          className="mb-3"
          controlId="password"
          onChange={(e) => setPassWord(e.target.value)}
        >
          <FormLabel>Password</FormLabel>
          <FormControl type="password" required></FormControl>
        </FormGroup>
        <div>
          <Button className="mb-3" type="summit" variant="info">
            Sign In
          </Button>
        </div>
        <div className="mb-3">
          New User?{' '}
          <Link className="link" to={`/signup?redirect=${redirect}`}>
            Sign Up Today 😉
          </Link>
        </div>
      </Form>
    </Container>
  );
}

export default SigninScreen;
