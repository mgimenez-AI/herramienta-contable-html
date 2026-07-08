import { seedData } from '../data/seed';
import { uid } from '../utils/helpers';

const KEY = 'gestion_contable_local_v1';

/**
 * Data store used automatically when SharePoint isn't configured (no VITE_SP_* env vars).
 * Persists to this browser's localStorage only — not shared across the team.
 * Mirrors the async interface of graphSharePointStore so the rest of the app
 * is backend-agnostic.
 */
export function createLocalDevStore() {
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && d.tasks && d.team && d.projects) return d;
      }
    } catch {
      /* ignore corrupt storage */
    }
    return null;
  }

  let data = load() || seedData();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* storage unavailable — keep working in-memory */
    }
  }

  return {
    kind: 'local',

    async init() {
      return data;
    },

    async createTask(task) {
      const nextId = Math.max(0, ...data.tasks.map((t) => Number(t.id) || 0)) + 1;
      const nt = { ...task, id: nextId };
      data = { ...data, tasks: [...data.tasks, nt] };
      save();
      return nt;
    },
    async updateTask(id, patch) {
      data = { ...data, tasks: data.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) };
      save();
    },
    async deleteTask(id) {
      data = { ...data, tasks: data.tasks.filter((t) => t.id !== id) };
      save();
    },
    async bulkCreateTasks(tasks) {
      let nextId = Math.max(0, ...data.tasks.map((t) => Number(t.id) || 0)) + 1;
      const created = tasks.map((t) => ({ ...t, id: nextId++ }));
      data = { ...data, tasks: [...data.tasks, ...created] };
      save();
      return created;
    },

    async createPerson(person) {
      const np = { ...person, id: uid('u') };
      data = { ...data, team: [...data.team, np] };
      save();
      return np;
    },
    async updatePerson(id, patch) {
      data = { ...data, team: data.team.map((p) => (p.id === id ? { ...p, ...patch } : p)) };
      save();
    },
    async deletePerson(id) {
      data = { ...data, team: data.team.filter((p) => p.id !== id) };
      save();
    },

    async createProject(project) {
      const np = { ...project, id: uid('proy') };
      data = { ...data, projects: [...data.projects, np] };
      save();
      return np;
    },
    async updateProject(id, patch) {
      data = { ...data, projects: data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) };
      save();
    },
    async deleteProject(id) {
      data = { ...data, projects: data.projects.filter((p) => p.id !== id) };
      save();
    },
  };
}
