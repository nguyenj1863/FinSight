import { configureStore } from '@reduxjs/toolkit';
import portfolioReducer from './portfolioSlice'; // adjust path if needed

const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
  },
});

export default store;
