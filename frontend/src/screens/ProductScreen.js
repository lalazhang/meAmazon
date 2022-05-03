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
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import logger from 'use-reducer-logger';
export default function ProductScreen() {
  //slug is taken from Link in app.js
  const { slug } = useParams();

  const initialState = [];
  const reducer = (state, action) => {
    switch (action.type) {
      case 'loading':
        return { ...state, loading: true, err: false };
      case 'success':
        return {
          ...state,
          product: action.payload,
          loading: false,
          err: false,
        };
      case 'error':
        return { ...state, loading: false, err: true, error: action.payload };
      default:
        return state;
    }
  };
  const [{ loading, product, error, err }, dispatch] = useReducer(
    logger(reducer),
    {
      loading: true,
      product: initialState,
      err: false,
      error: '',
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'loading' });
      try {
        const result = await axios(`/api/products/${slug}`);

        dispatch({ type: 'success', payload: result.data.product });
      } catch (error) {
        dispatch({ type: 'error', payload: error.message, err: true });
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div>
      <div>
        {loading ? (
          <>
            {' '}
            <LoadingBox></LoadingBox>
          </>
        ) : err ? (
          <div>
            <Row>
              {' '}
              <MessageBox variant="warning" error={error}></MessageBox>
            </Row>
          </div>
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
                      <Button variant="info">add to cart</Button>
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