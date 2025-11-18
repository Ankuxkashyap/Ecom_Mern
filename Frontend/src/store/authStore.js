import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  error: null,

  init: () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (token && user && isAuthenticated) {
      set({ user, token, isAuthenticated });
    }
  },

  login: async ({ email, password }) => {
    try {
      const res = await axios.post(
        'http://localhost:3000/user/login',
        { email, password },
        { withCredentials: true }
      );
      // console.log('Login response:', res.data);
      const { user, token } = res.data;

      set({ user, token, isAuthenticated: true, error: null });

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login error';
      toast.error(message);
      return { success: false, message };
    }
  },

  register: async ({ name, email, password }) => {
    try {
      const res = await axios.post(
        'http://localhost:3000/user/rigester',
        { name, email, password }
      );

      const newUser = res.data.newUser;
      const token = res.data.token; 

      set({ user: newUser, token: token || null, isAuthenticated: true, error: null });

      localStorage.setItem('user', JSON.stringify(newUser));
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration error';
      toast.error(message);
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.setItem('isAuthenticated', 'false');
    set({ user: null, token: null, isAuthenticated: false });
    toast.success('Logged out successfully!');
  },
}));
