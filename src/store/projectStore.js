import { create } from 'zustand';
import api from '../api/api';
import { SEEDED_PROJECTS } from '../data/mockProjects';

const getCustomProjects = () => {
  try {
    const raw = localStorage.getItem('studentforge_custom_projects');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveCustomProject = (proj) => {
  try {
    const existing = getCustomProjects();
    const updated = [proj, ...existing.filter((p) => p.id !== proj.id)];
    localStorage.setItem('studentforge_custom_projects', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save project locally:', e);
  }
};

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  tasks: [],
  matchLogs: [],
  memberLoads: {},
  isLoading: false,
  error: null,

  // Create project call (saves to API or local persistence)
  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/projects', projectData);
      const project = res.data.project || res.data;
      saveCustomProject(project);
      set((state) => ({
        projects: [project, ...state.projects],
        isLoading: false
      }));
      return { success: true, project };
    } catch (err) {
      // Create and persist project locally so user-created projects are never lost
      let currentUser = { name: 'Student Builder', college: 'University' };
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) currentUser = JSON.parse(storedUser);
      } catch (e) {}

      const newProject = {
        ...projectData,
        id: 'proj-' + Date.now(),
        createdAt: new Date().toISOString(),
        status: 'forming',
        ownerId: currentUser.id || 'user-' + Date.now(),
        owner: {
          id: currentUser.id || 'user-' + Date.now(),
          name: currentUser.name || 'Student Builder',
          college: currentUser.college || 'University',
          reliabilityScore: 5.0
        },
        roles: (projectData.roles || []).map((r, idx) => ({
          ...r,
          id: 'role-' + Date.now() + '-' + idx,
          filled: false
        })),
        members: [
          {
            id: 'mem-' + Date.now(),
            role: 'Project Owner',
            status: 'active',
            user: currentUser
          }
        ]
      };

      saveCustomProject(newProject);
      set((state) => ({
        projects: [newProject, ...state.projects],
        isLoading: false
      }));
      return { success: true, project: newProject };
    }
  },

  // Discover and landing page feed lookup
  fetchProjects: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { search, domain, complexity } = filters;
      const params = {};
      if (search) params.search = search;
      if (domain) params.domain = domain;
      if (complexity) params.complexity = complexity;

      let remoteList = [];
      try {
        const res = await api.get('/projects', { params });
        if (Array.isArray(res.data) && res.data.length > 0) {
          remoteList = res.data;
        }
      } catch (apiErr) {
        // remote server not responding, will load local and seeded projects
      }

      // Merge: custom projects created by user + any remote projects + 5 seeded projects
      const customProjects = getCustomProjects();
      const combined = [...customProjects, ...remoteList];
      const seenIds = new Set(combined.map((p) => p.id));
      const seededToAdd = SEEDED_PROJECTS.filter((p) => !seenIds.has(p.id));
      let allProjects = [...combined, ...seededToAdd];

      // Apply client-side filters if requested
      if (search || (domain && domain !== 'All' && domain !== 'All Domains') || (complexity && complexity !== 'All')) {
        allProjects = allProjects.filter((proj) => {
          if (search) {
            const q = search.toLowerCase().trim();
            const matchTitle = proj.title?.toLowerCase().includes(q);
            const matchDesc = proj.description?.toLowerCase().includes(q);
            const matchDomain = proj.domainTags?.some((d) => d.toLowerCase().includes(q));
            const matchRole = proj.roles?.some(
              (r) =>
                r.roleTitle?.toLowerCase().includes(q) ||
                r.skillsRequired?.some((s) => s.toLowerCase().includes(q))
            );
            if (!matchTitle && !matchDesc && !matchDomain && !matchRole) return false;
          }
          if (domain && domain !== 'All' && domain !== 'All Domains') {
            if (!proj.domainTags?.includes(domain)) return false;
          }
          if (complexity && complexity !== 'All') {
            if (proj.complexity?.toLowerCase() !== complexity.toLowerCase()) return false;
          }
          return true;
        });
      }

      set({ projects: allProjects, isLoading: false, error: null });
    } catch (err) {
      const customProjects = getCustomProjects();
      const seenIds = new Set(customProjects.map((p) => p.id));
      const seeded = SEEDED_PROJECTS.filter((p) => !seenIds.has(p.id));
      set({ projects: [...customProjects, ...seeded], isLoading: false, error: null });
    }
  },

  // Focus detail project load
  fetchProjectById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      try {
        const res = await api.get(`/projects/${id}`);
        if (res.data) {
          set({ currentProject: res.data, isLoading: false });
          return res.data;
        }
      } catch (e) {}

      const found =
        get().projects.find((p) => p.id === id) ||
        getCustomProjects().find((p) => p.id === id) ||
        SEEDED_PROJECTS.find((p) => p.id === id);

      if (found) {
        set({ currentProject: found, isLoading: false, error: null });
        return found;
      }
      set({ error: 'Project details not found.', isLoading: false });
      return null;
    } catch (err) {
      set({ error: 'Failed to load project details.', isLoading: false });
      return null;
    }
  },

  // Submits an application for a specific role
  applyToProject: async (projectId, roleTitle, note) => {
    set({ isLoading: true });
    try {
      try {
        const res = await api.post(`/projects/${projectId}/apply`, { roleTitle, note });
        set({ isLoading: false });
        return { success: true, message: res.data.message };
      } catch (apiErr) {
        const target =
          get().projects.find((p) => p.id === projectId) ||
          getCustomProjects().find((p) => p.id === projectId) ||
          SEEDED_PROJECTS.find((p) => p.id === projectId);

        if (target) {
          let userObj = { id: 'usr-' + Date.now(), name: 'Applicant' };
          try {
            const rawUser = localStorage.getItem('user');
            if (rawUser) userObj = JSON.parse(rawUser);
          } catch (e) {}

          const updatedTarget = {
            ...target,
            members: [
              ...(target.members || []),
              {
                id: 'mem-' + Date.now(),
                projectId,
                userId: userObj.id,
                role: roleTitle,
                status: 'pending',
                note
              }
            ]
          };
          saveCustomProject(updatedTarget);
          set((state) => ({
            projects: state.projects.map((p) => (p.id === projectId ? updatedTarget : p)),
            isLoading: false
          }));
          return { success: true, message: `Application submitted for "${roleTitle}"!` };
        }
        throw apiErr;
      }
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
