import { create } from 'zustand';
import api from '../api/api';

const useProjectStore = create((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  // Create project call
  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/projects', projectData);
      const { project } = res.data;
      set((state) => ({
        projects: [project, ...state.projects],
        isLoading: false
      }));
      return { success: true, project };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create project.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  // Discover feed lookups
  fetchProjects: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { search, domain, complexity } = filters;
      const params = {};
      if (search) params.search = search;
      if (domain) params.domain = domain;
      if (complexity) params.complexity = complexity;

      const res = await api.get('/projects', { params });
      set({ projects: res.data, isLoading: false });
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to load projects feed.';
      set({ error: msg, isLoading: false });
    }
  },

  // Focus detail project load
  fetchProjectById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/projects/${id}`);
      set({ currentProject: res.data, isLoading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to load project details.';
      set({ error: msg, isLoading: false });
      return null;
    }
  },

  // Submits an application for a specific role
  applyToProject: async (projectId, roleTitle, note) => {
    set({ isLoading: true });
    try {
      const res = await api.post(`/projects/${projectId}/apply`, { roleTitle, note });
      set({ isLoading: false });
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit application.';
      set({ isLoading: false });
      return { success: false, error: msg };
    }
  }
}));

export default useProjectStore;
