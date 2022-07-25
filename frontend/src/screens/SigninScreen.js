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

function SigninScreen() {
  //useLocation() returns location object from current URL
  //including pathname, search as query string (?), hash #
  //option const {search} = useLocation()
  const currentURL = useLocation();
  const redirectInURL = new URLSearchParams(currentURL.search).get('redirect');
  const redirect = redirectInURL ? redirectInURL : '/';

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  //axios post does not work without async await
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const signInInfo = { password, email };
    console.log(signInInfo);
    try {
      const { data } = await axios.post('/api/user/signin', signInInfo);
      console.log('/api/user/signin success');
      ctxDispatch({ type: 'USER_INFO', payload: data });
      console.log(data);
      navigate(`${redirect}`);
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      //Toast does not work
      console.log(error.response.data);
      toast.error(error + ' ' + error.response.data.message);
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
          onChange={(e) => setPassword(e.target.value)}
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
