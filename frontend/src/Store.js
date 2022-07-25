import { createContext } from 'react';
import { useState } from 'react';
import { useReducer } from 'react';

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cart: {
    cartItems:
      JSON.parse(localStorage.getItem('items')) === null
        ? []
        : JSON.parse(localStorage.getItem('items')),

    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},

    paymentMethodName: localStorage.getItem('paymentMethod')
      ? JSON.parse(localStorage.getItem('paymentMethod'))
      : '',
  },
};
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

      //save cartItems to browser localStorage after add,
      //cartItems remained after refresh
      localStorage.setItem('items', JSON.stringify(cartItemsFinal));
      console.log('local storage after add');
      console.log(JSON.parse(localStorage.getItem('items')));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: cartItemsFinal,
        },
      };
    case 'REMOVE_ITEM': {
      console.log('deleted product id');
      console.log(action.payload._id);
      //filter keeps e where e.product._id is actin.payload._id
      const newCartItemsPostDelete = state.cart.cartItems.filter(
        (e) => e.product._id !== action.payload._id
      );
      console.log('cartItems after delete');
      console.log(newCartItemsPostDelete);

      //save cartItems to browser localStorage after delete
      //cartItems remained after refresh
      localStorage.setItem('items', JSON.stringify(newCartItemsPostDelete));
      console.log('local storage after delete');
      console.log(JSON.parse(localStorage.getItem('items')));

      return {
        ...state,
        cart: { ...state.cart, cartItems: newCartItemsPostDelete },
      };
    }

    case 'USER_INFO': {
      return { ...state, userInfo: action.payload };
    }

    case 'USER_SIGNOUT': {
      return {
        ...state,
        userInfo: null,
        cart: { ...state.cart, shippingAddress: {}, paymentMethod: '' },
      };
    }

    case 'SAVE_SHIPPING_ADDRESS': {
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    }

    case 'SAVE_PAYMENT_METHOD': {
      return {
        ...state,
        cart: { ...state.cart, paymentMethodName: action.payload },
      };
    }
    case 'CART_CLEAR': {
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    }

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
