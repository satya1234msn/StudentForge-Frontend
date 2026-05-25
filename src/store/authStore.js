import { create } from 'zustand';
import api from '../api/api';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login handler
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = res.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please verify credentials.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  // Registration handler
  register: async (name, email, password, college, course, year) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password, college, course, year });
      const { accessToken, refreshToken, user } = res.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Email might be in use.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  // Logout handler
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Network failures can be ignored on logout
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      error: null
    });
  },

  // Edit profile parameters
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put('/users/me', profileData);
      const { user } = res.data;
      set({ user, isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update profile details.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  // Save student skills
  updateSkills: async (skills) => {
    set({ isLoading: true });
    try {
      await api.post('/users/me/skills', { skills });
      
      // Refresh local user data to obtain updated skill list
      const userRes = await api.get('/users/me');
      set({ user: userRes.data, isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to register skills.';
      set({ isLoading: false });
      return { success: false, error: msg };
    }
  },

  // Rehydrate session from localStorage
  loadUser: async () => {
    const token = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    if (!token && !refresh) return;

    set({ isLoading: true });
    try {
      const res = await api.get('/users/me');
      set({
        user: res.data,
        accessToken: token,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (err) {
      // Token might be expired, clear or let refresh handler run on background
      try {
        if (refresh) {
          const res = await api.get('/users/me');
          set({
            user: res.data,
            accessToken: localStorage.getItem('accessToken'),
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          set({ isLoading: false });
        }
      } catch (e) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ isLoading: false, isAuthenticated: false });
      }
    }
  }
}));

export default useAuthStore;
