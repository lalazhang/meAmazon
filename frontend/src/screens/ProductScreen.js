import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';

export default function ProductScreen() {
  //slug is taken from Link in app.js
  const { slug } = useParams();

  const initialState = [];
  const reducer = (state, action) => {
    switch (action.type) {
      case 'loading':
        return { ...state, loading: true };
      case 'success':
        return { ...state, product: action.payload, loading: false };
      case 'error':
        return { ...state, error: action.payload };
      default:
        return state;
    }
  };
  const [{ loading, product, error }, dispatch] = useReducer(reducer, {
    loading: true,
    product: initialState,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'loading' });
      try {
        const result = await axios(`/api/products/${slug}`);

        dispatch({ type: 'success', payload: result.data.product });
      } catch (error) {
        dispatch({ type: 'error', payload: error.message });
      }
    };
    fetchData();
  }, [slug]);
  const [state, dispatch1] = useContext(Store);
  const handleAddToCart = () => {
    dispatch1({ type: 'ADD_TO_CART' });
  };

  return (
    <div>
      <div>
        {loading ? (
          <>
            {' '}
            <LoadingBox></LoadingBox>
          </>
        ) : error ? (
          <MessageBox variant="warning"></MessageBox>
        ) : (
          <div>
            <Row>
              <Col md="2"></Col>
              <Col md="4">
                <img src={product.image} alt={product.name}></img>
              </Col>
              <Col md="6">
                <ListGroup variant="flush">
                  <ListGroupItem>
                    <Helmet>
                      <title>{product.name}</title>
                    </Helmet>
                    <h1>{product.name} </h1>{' '}
                    <Row>
                      <Col md="2">Price:</Col>
                      <Col md="2">${product.price}</Col>
                      <Rating
                        rating={product.rating}
                        numReviews={product.numReviews}
                      ></Rating>
                    </Row>
                  </ListGroupItem>

                  <ListGroupItem>
                    <Row>
                      <Col>
                        {product.countInStock > 0 ? (
                          <>
                            <p></p>
                            <Badge bg="info">
                              {product.countInStock} In Stock
                            </Badge>
                          </>
                        ) : (
                          <Badge bg="danger">Out of Stock</Badge>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col>{product.description}</Col>
                    </Row>
                  </ListGroupItem>
                  {product.countInStock > 0 && (
                    <ListGroupItem>
                      <Button variant="info" onClick={handleAddToCart}>
                        add to cart
                      </Button>
                      <p>{state}</p>
                    </ListGroupItem>
                  )}
                </ListGroup>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
}
