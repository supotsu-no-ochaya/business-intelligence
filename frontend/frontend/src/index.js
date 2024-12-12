import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';

// Erstelle den Redux-Store
const store = configureStore({
  reducer: {
    // Deine Reducer hier hinzufügen
  },
});

// Render die App mit dem Redux-Provider
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
