import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import "./index.css";

/**
 * Root component wrapped with Redux Provider
 * This makes Redux store available to all components
 */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Optional: Report web vitals for performance monitoring
// import reportWebVitals from './reportWebVitals';
// reportWebVitals(console.log);
