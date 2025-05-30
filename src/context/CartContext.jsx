// src/context/CartContext.jsx
import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existing = state.find(item => item.name === action.payload.name);
      if (existing) {
        return state.map(item =>
          item.name === action.payload.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    case 'INCREMENT_QUANTITY':
      return state.map(item =>
        item.name === action.payload.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case 'DECREMENT_QUANTITY':
      return state
        .map(item =>
          item.name === action.payload.name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);

    case 'REMOVE_FROM_CART':
      return state.filter(item => item.name !== action.payload.name);

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (product) => dispatch({ type: 'ADD_TO_CART', payload: product });
  const removeFromCart = (product) => dispatch({ type: 'REMOVE_FROM_CART', payload: product });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const increment = (product) => dispatch({ type: 'INCREMENT_QUANTITY', payload: product });
  const decrement = (product) => dispatch({ type: 'DECREMENT_QUANTITY', payload: product });
  const removeItem = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, increment, decrement }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
