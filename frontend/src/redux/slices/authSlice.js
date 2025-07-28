import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../services/firebase";

/**
 * Initial state for authentication
 */
const initialState = {
  user: null,
  loading: true,
  error: null,
};

/**
 * Async thunk for user login
 * @param {Object} credentials - { email, password }
 */
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk for user registration
 * @param {Object} credentials - { email, password }
 */
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk for user logout
 */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Auth slice with reducers and actions
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user when auth state changes (e.g., from onAuthStateChanged)
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    // Clear any auth errors
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      });
  },
});

// Export actions
export const { setUser, clearError } = authSlice.actions;

// Export selectors
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Export reducer
export default authSlice.reducer;
