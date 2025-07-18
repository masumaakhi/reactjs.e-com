// src/context/CartContext.js
import { createContext, useContext, useReducer } from 'react';

// Initial State
const initialState = {
  cartItems: [],
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const exist = state.cartItems.find(item => item.id === action.payload.id);
      if (exist) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
        };
      }

    case 'INCREASE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };

    case 'DECREASE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems
          .map(item =>
            item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter(item => item.quantity > 0),
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
};

// Create Context
const CartContext = createContext();

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <CartContext.Provider value={{ cartItems: state.cartItems, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// useCart Hook
export const useCart = () => useContext(CartContext);
