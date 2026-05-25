import { create } from 'zustand';
import api from '../api/api';

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  tasks: [],
  matchLogs: [],
  memberLoads: {},
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
  },

  // Fetch tasks for the current project command board
  fetchProjectTasks: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/projects/${projectId}/tasks`);
      set({ tasks: res.data, isLoading: false });
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to load project task board.';
      set({ error: msg, isLoading: false });
    }
  },

  // Generates smart simulated developer/designer tasks
  generateProjectTasks: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post(`/projects/${projectId}/tasks/generate`);
      set({ isLoading: false });
      return { success: true, tasks: res.data.tasks };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to generate project tasks.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  // Distribute tasks using the matching service and lock assignments
  distributeProjectTasks: async (projectId, tasksArray) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post(`/projects/${projectId}/tasks/distribute`, {
        tasks: tasksArray
      });
      const { memberLoads, matchLogs } = res.data;
      
      // Refresh project detailed states
      const refreshedProject = await api.get(`/projects/${projectId}`);
      const refreshedTasks = await api.get(`/projects/${projectId}/tasks`);

      set({
        currentProject: refreshedProject.data,
        tasks: refreshedTasks.data,
        memberLoads,
        matchLogs,
        isLoading: false
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to allocate and lock tasks.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  // Move Kanban cards to update task status in-place
  updateTaskStatus: async (taskId, status) => {
    try {
      const projectId = get().currentProject?.id;
      if (!projectId) return { success: false, error: 'No active project context found.' };
      
      const res = await api.put(`/projects/${projectId}/tasks/${taskId}`, { status });
      const { task } = res.data;

      // Update task list directly in local state to prevent overall reload flickering
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status: task.status } : t))
      }));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update task status.';
      return { success: false, error: msg };
    }
  }
}));

export default useProjectStore;
