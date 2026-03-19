import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API;

// Add token to every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('sc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── State & Reducer ────────────────────────────────────────
const initialState = {
  user: null,
  token: localStorage.getItem('sc_token'),
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_USER':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('sc_token', action.payload.token);
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, loading: false, error: null };
    case 'LOGOUT':
      localStorage.removeItem('sc_token');
      return { ...initialState, token: null, loading: false };
    case 'AUTH_ERROR':
      localStorage.removeItem('sc_token');
      return { ...state, user: null, token: null, isAuthenticated: false, loading: false, error: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

// ── Context ────────────────────────────────────────────────
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on mount
  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: 'AUTH_ERROR', payload: null });
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get('/auth/me');
      dispatch({ type: 'LOAD_USER', payload: res.data.user });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR', payload: null });
    }
  };

  const login = async (identifier, password, rememberMe = false) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.post('/auth/login', { identifier, password, rememberMe });
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Try again.';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  const register = async (data) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.post('/auth/register', data);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed.';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {}
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
