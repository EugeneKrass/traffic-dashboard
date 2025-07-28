import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import trafficReducer from "./slices/trafficSlice";

/**
 * Configure Redux store with Redux Toolkit
 * This creates the central state management for the application
 */
export const store = configureStore({
  reducer: {
    // Authentication state management
    auth: authReducer,
    // Traffic data state management
    traffic: trafficReducer,
  },
  // Redux Toolkit includes redux-thunk by default for async actions
  // It also includes Redux DevTools Extension support in development
});

export default store;
