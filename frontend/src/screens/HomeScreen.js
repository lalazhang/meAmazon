import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState, useReducer } from 'react';
import data from '../data';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Container from 'react-bootstrap/Container';
import Product from '../components/Product';
import MessageBox from '../components/LoadingBox';
import LoadingBox from '../components/LoadingBox';
export default function HomeScreen() {
  const initialState = [];
  const reducer = (state, action) => {
    switch (action.type) {
      case 'loading':
        return { ...state, loading: true };
      case 'success':
        return { ...state, products: action.payload, loading: false };
      case 'error':
        return { ...state, loading: false, error: action.payload, err: true };
      default:
        return state;
    }
  };
  const [{ loading, products, error, err }, dispatch] = useReducer(
    logger(reducer),
    {
      loading: true,
      products: initialState,
      error: '',
      err: false,
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'loading' });
      try {
        const result = await axios('/api/products');
        console.log(result.data);
        dispatch({
          type: 'success',
          payload: result.data.data.product,
        });
      } catch (err) {
        dispatch({ type: 'error', payload: err.message });
      }
    };
    fetchData();
    // fetchData().catch(console.error);
  }, []);
  return (
    <div>
      <main>
        <h1>Featured Product</h1>
        <div className="products">
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : err ? (
            <>
              <p>{error}</p>
              <MessageBox variant="warning">{error}</MessageBox>
            </>
          ) : (
            <Container fluid>
              <Row>
                {products.map((product) => (
                  //Each product object has an unique key value
                  <Col key={product.slug} sm="6" md="4" lg="3">
                    <Product product={product}></Product>
                  </Col>
                ))}
              </Row>
            </Container>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = StyleSheet.create({});
