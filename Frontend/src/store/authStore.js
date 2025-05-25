import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null, // Retrieve user from localStorage
  token: localStorage.getItem('token') || null, // Retrieve token from localStorage
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true', // Check if user is authenticated
  error: null,
  // Init function to check user and token on page load
  init: () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (token && isAuthenticated && user) {
          set({ user, token, isAuthenticated }); // Set state from localStorage
        }
    },
    
  login: async ({ email, password }) => {
    try {
      const res = await axios.post(
        'http://localhost:3000/user/login',
        { email, password },
        { withCredentials: true }
      );
      set({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        error: null
      });

      // Store token, user info, and isAuthenticated flag in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('isAuthenticated', 'true');

      toast.success('Login successful!');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login error');
      return {
        success: false,
        message: err.response?.data?.message || 'Login error',
      };
    }
  },

  register: async ({ name, email, password }) => {
    try {
      const res = await axios.post(
        'http://localhost:3000/user/rigester',
        { name, email, password }
      );
      console.log(res);

      set({
        user: res.data.newUser.name,
        isAuthenticated: true,
        error: null,
      });

      // Store token, user info, and isAuthenticated flag in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Registration successful!');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration error');
      return {
        success: false,
        message: err.response?.data?.message || 'Registration error',
      };
    }
  },

  logout: () => {
    // Clear data from store and localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.setItem('isAuthenticated', 'false');

    set({ user: null, token: null, isAuthenticated: false });
    toast.success('Logged out successfully!');
  },
}));
