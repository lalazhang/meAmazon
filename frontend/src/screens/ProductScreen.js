import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import Rating from '../components/Rating';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/esm/Button';
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

  return (
    <div>
      <div>
        {loading ? (
          <h1>We are working on loading the page!</h1>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div>
            <Row>
              <Col md="3">
                <img src={product.image} alt={product.name}></img>
              </Col>
              <Col md="6">
                <ListGroup>
                  <ListGroupItem>
                    <h1>{product.name} </h1>{' '}
                    <Row>
                      <Col md="2">Price:</Col>
                      <Col md="2">${product.price}</Col>
                      <Rating
                        rating={product.rating}
                        numReviews={product.numReviews}
                      ></Rating>
                      <p>{product.countInStock}</p>
                    </Row>
                  </ListGroupItem>

                  <ListGroupItem>
                    <Row>
                      <Col>
                        {product.countInStock > 0 ? (
                          <Badge bg="secondary">In Stock</Badge>
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
                      <Button variant="secondary">add to cart</Button>
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
