import { createContext } from 'react';
import { useState } from 'react';
import { useReducer } from 'react';

export const Store = createContext();

const initialState = { cart: { cartItems: [] } };
const reducer = (state, action) => {
  switch (action.type) {
    // case 'ADD_TO_CART':
    //   return { ...state, cart: { ...state.cart, cartId: action.payload } };
    case 'ADD_TO_CART1':
      const newItem = action.payload;
      console.log('The following product exist in cart');
      console.log(
        state.cart.cartItems.find((e) => e.product._id === newItem.product._id)
      );

      const newItemExist = state.cart.cartItems.find(
        (e) => e.product._id === newItem.product._id
      );
      let newCartItems = state.cart.cartItems;

      if (newItemExist) {
        /*         newCartItems.map((item) => {
          //bug here
          if (item.product._id === newItem.product._id) {
            item = newItem;
          }
        }); */

        newCartItems = newCartItems.filter(
          (item) => item.product._id !== newItem.product._id
        );

        newCartItems = [...newCartItems, newItem];
        console.log('new cartItems');
        console.log(newCartItems);
      }

      const cartItemsFinal = newItemExist
        ? newCartItems
        : [...state.cart.cartItems, newItem];
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: cartItemsFinal,
        },
      };
    default:
      return state;
  }
};

export function StoreProvider(props) {
  //props is what wrapped inside <StoreProvider></StoreProvider>?

  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
