import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userInfo  from './userSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        userInfo: userInfo
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;