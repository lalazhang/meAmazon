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
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../util/util';
import { toast } from 'react-toastify';
function SignupScreen() {
  //useLocation() returns location object from current URL
  //including pathname, search as query string (?), hash #
  //option const {search} = useLocation()

  const currentURL = useLocation();
  const redirectInURL = new URLSearchParams(currentURL.search).get('redirect');
  const redirect = redirectInURL ? redirectInURL : '/';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  //axios post does not work without async await
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const signupInfo = { name, password, email };
    console.log('sign up user input', signupInfo);
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { data } = await axios.post('/api/user/signup', signupInfo);
      console.log('respond');
      console.log(data);
      ctxDispatch({ type: 'USER_INFO', payload: data });

      navigate(`${redirect}`);
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      toast.error(getError(error));
    }
  };
  useEffect(() => {
    if (state.userInfo) {
      navigate(redirect);
    }
  }, [navigate, state.userInfo, redirect]);
  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Un</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={onSubmitHandler}>
        <FormGroup
          className="mb-3"
          controlId="name"
          onChange={(e) => setName(e.target.value)}
        >
          <FormLabel>Name</FormLabel>
          <FormControl type="name" required></FormControl>
        </FormGroup>
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
          onChange={(e) => setPassword(e.target.value)}
        >
          <FormLabel>Password</FormLabel>
          <FormControl type="password" required></FormControl>
        </FormGroup>
        <FormGroup
          className="mb-3"
          controlId="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
        >
          <FormLabel>Confirm Password</FormLabel>
          <FormControl type="password" required></FormControl>
        </FormGroup>
        <div>
          <Button className="mb-3" type="summit" variant="info">
            Sign Up
          </Button>
        </div>
        <div className="mb-3">
          Already have an account?{' '}
          <Link className="link" to={`/signin?redirect=${redirect}`}>
            Sign In 😉
          </Link>
        </div>
      </Form>
    </Container>
  );
}

export default SignupScreen;
