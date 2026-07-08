import { seedData } from '../data/seed';
import { uid } from '../utils/helpers';

const OWNER = import.meta.env.VITE_GITHUB_OWNER || 'mgimenez-AI';
const REPO = import.meta.env.VITE_GITHUB_REPO || 'herramienta-contable-html';
const BRANCH = import.meta.env.VITE_GITHUB_BRANCH || 'main';
const DATA_PATH = import.meta.env.VITE_GITHUB_DATA_PATH || 'data/app-data.json';
const ENV_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
const TOKEN_KEY = 'gestion_contable_github_token_v1';

export const isGitHubStoreConfigured = (import.meta.env.VITE_DATA_BACKEND || 'github') === 'github';

function apiUrl() {
  return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(DATA_PATH).replace(/%2F/g, '/')}`;
}

function normalizeData(value) {
  if (value && Array.isArray(value.team) && Array.isArray(value.projects) && Array.isArray(value.tasks)) {
    return value;
  }
  return seedData();
}

function decodeBase64Json(content) {
  const binary = atob(String(content || '').replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function encodeBase64Json(value) {
  const json = JSON.stringify(value, null, 2);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function getSavedToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function saveToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

function getToken() {
  let token = ENV_TOKEN || getSavedToken();
  if (token) return token;

  token = window.prompt(
    'Para guardar cambios compartidos, pega un token de GitHub con permiso Contents: Read and write para este repositorio. Se guardara solo en este navegador.'
  );
  if (!token) {
    throw new Error('No se guardo el cambio porque falta el token de GitHub.');
  }
  saveToken(token.trim());
  return token.trim();
}

async function request(path, options = {}) {
  const token = options.requiresToken ? getToken() : ENV_TOKEN || getSavedToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GitHub respondio ${res.status}. ${body || 'Revisa permisos o configuracion.'}`);
  }
  return res.json();
}

export function createGitHubRepoStore() {
  let data = seedData();
  let sha = null;

  async function load() {
    try {
      const file = await request(`${apiUrl()}?ref=${encodeURIComponent(BRANCH)}`);
      sha = file.sha;
      data = normalizeData(decodeBase64Json(file.content));
    } catch (error) {
      if (!String(error?.message || '').includes('404')) throw error;
      data = seedData();
      sha = null;
      await save('Crear datos iniciales de Gestion Contable');
    }
    return data;
  }

  async function save(message = 'Actualizar datos de Gestion Contable') {
    const body = {
      message,
      content: encodeBase64Json(data),
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    };
    const updated = await request(apiUrl(), {
      method: 'PUT',
      requiresToken: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    sha = updated.content?.sha || sha;
  }

  return {
    kind: 'github',

    async init() {
      return load();
    },

    async createTask(task) {
      const nextId = Math.max(0, ...data.tasks.map((t) => Number(t.id) || 0)) + 1;
      const created = { ...task, id: nextId };
      data = { ...data, tasks: [...data.tasks, created] };
      await save(`Crear tarea: ${created.title}`);
      return created;
    },
    async updateTask(id, patch) {
      const task = data.tasks.find((t) => t.id === id);
      data = { ...data, tasks: data.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) };
      await save(`Actualizar tarea: ${task?.title || id}`);
    },
    async deleteTask(id) {
      const task = data.tasks.find((t) => t.id === id);
      data = { ...data, tasks: data.tasks.filter((t) => t.id !== id) };
      await save(`Eliminar tarea: ${task?.title || id}`);
    },
    async bulkCreateTasks(tasks) {
      let nextId = Math.max(0, ...data.tasks.map((t) => Number(t.id) || 0)) + 1;
      const created = tasks.map((task) => ({ ...task, id: nextId++ }));
      data = { ...data, tasks: [...data.tasks, ...created] };
      await save(`Importar ${created.length} tareas`);
      return created;
    },

    async createPerson(person) {
      const created = { ...person, id: uid('u') };
      data = { ...data, team: [...data.team, created] };
      await save(`Crear integrante: ${created.nombre}`);
      return created;
    },
    async updatePerson(id, patch) {
      const person = data.team.find((p) => p.id === id);
      data = { ...data, team: data.team.map((p) => (p.id === id ? { ...p, ...patch } : p)) };
      await save(`Actualizar integrante: ${person?.nombre || id}`);
    },
    async deletePerson(id) {
      const person = data.team.find((p) => p.id === id);
      data = { ...data, team: data.team.filter((p) => p.id !== id) };
      await save(`Eliminar integrante: ${person?.nombre || id}`);
    },

    async createProject(project) {
      const created = { ...project, id: uid('proy') };
      data = { ...data, projects: [...data.projects, created] };
      await save(`Crear proyecto: ${created.nombre}`);
      return created;
    },
    async updateProject(id, patch) {
      const project = data.projects.find((p) => p.id === id);
      data = { ...data, projects: data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) };
      await save(`Actualizar proyecto: ${project?.nombre || id}`);
    },
    async deleteProject(id) {
      const project = data.projects.find((p) => p.id === id);
      data = { ...data, projects: data.projects.filter((p) => p.id !== id) };
      await save(`Eliminar proyecto: ${project?.nombre || id}`);
    },
  };
}
