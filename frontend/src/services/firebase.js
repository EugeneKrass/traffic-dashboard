import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Firebase configuration using environment variables
 * These values are stored in .env file for security
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase app instance
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export for use in other components
export const auth = getAuth(app);

// Export the app instance if needed elsewhere
export default app;
