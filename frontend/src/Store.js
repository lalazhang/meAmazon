import { createContext } from 'react';
import { useState } from 'react';
import { useReducer } from 'react';
export const Store = createContext();
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return state + 1;
  }
};
export function StoreProvider(props) {
  //props is what wrapped inside <StoreProvider></StoreProvider>?
  const [cartItem, setCartItem] = useState(0);

  const initialState = 0;
  const [count, dispatch] = useReducer(reducer, initialState);
  return (
    <Store.Provider value={[count, dispatch]}>{props.children}</Store.Provider>
  );
}
