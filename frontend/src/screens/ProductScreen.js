import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductScreen() {
  const [state, setState] = useState([]);
  //slug is taken from Link in app.js
  const { slug } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      //get data from server.js
      const result = await axios(`/api/products/${slug}`);

      setState(result.data.product);
      console.log(result.data.product);
    };
    fetchData();
  }, [slug]);

  return (
    <div>
      ProductScreen <h1>{state.name} </h1>
      <img src={state.image} alt="top"></img>
    </div>
  );
}
