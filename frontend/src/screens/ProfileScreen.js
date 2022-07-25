import React, { useContext, useReducer } from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../util/util.js';
import LoadingBox from '../components/LoadingBox';
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
}
export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  console.log('Store data', userInfo);
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });
  const submitHandler = async (e) => {
    e.preventDefault();
    // first update database, then update the Store.js
    // update user info in database
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      const { data } = await axios.put(
        '/api/user/profile',
        { name, email, password },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      console.log('response api/users/profile', data);
      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({ type: 'USER_INFO', payload: data });
      toast.success('user updated success');
    } catch (error) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(error.response.data));
    }

    /*     ctxDispatch({
      type: 'USER_INFO',
      payload: {
        _id: '62bf9f17a7d2fb9849b3e981',
        name: name,
        email: userInfo.id,
        isAdmin: userInfo.isAdmin,
        token: userInfo.token,
      },
    }); */
  };
  return (
    <div className="small-container">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      {loadingUpdate ? (
        <LoadingBox />
      ) : (
        <div>
          <h1 className="my-3">Profile</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className='="mb-3' controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className='="mb-3' controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className='="mb-3'>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='="mb-3'>
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <div className="mb-3">
              <Button variant="primary" type="submit">
                Update Profile
              </Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
