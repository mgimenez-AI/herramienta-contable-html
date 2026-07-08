import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createGitHubRepoStore, isGitHubStoreConfigured } from '../services/githubRepoStore';
import { createLocalDevStore } from '../services/localDevStore';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const storeRef = useRef(null);
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (!storeRef.current) {
      storeRef.current = isGitHubStoreConfigured ? createGitHubRepoStore() : createLocalDevStore();
    }
    setLoading(true);
    storeRef.current
      .init()
      .then((data) => {
        if (cancelled) return;
        setTeam(data.team);
        setProjects(data.projects);
        setTasks(data.tasks);
        setError('');
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message || 'No se pudieron cargar los datos.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const store = () => storeRef.current;

  const actions = useMemo(
    () => ({
      async createTask(task) {
        const created = await store().createTask(task);
        setTasks((prev) => [...prev, created]);
        return created;
      },
      async updateTask(id, patch) {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
        await store().updateTask(id, patch);
      },
      async deleteTask(id) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        await store().deleteTask(id);
      },
      async bulkCreateTasks(list) {
        const created = await store().bulkCreateTasks(list);
        setTasks((prev) => [...prev, ...created]);
        return created;
      },
      async createPerson(person) {
        const created = await store().createPerson(person);
        setTeam((prev) => [...prev, created]);
        return created;
      },
      async updatePerson(id, patch) {
        setTeam((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
        await store().updatePerson(id, patch);
      },
      async deletePerson(id) {
        setTeam((prev) => prev.filter((p) => p.id !== id));
        await store().deletePerson(id);
      },
      async createProject(project) {
        const created = await store().createProject(project);
        setProjects((prev) => [...prev, created]);
        return created;
      },
      async updateProject(id, patch) {
        setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
        await store().updateProject(id, patch);
      },
      async deleteProject(id) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        await store().deleteProject(id);
      },
    }),
    []
  );

  const value = {
    team,
    projects,
    tasks,
    loading,
    error,
    backend: storeRef.current?.kind || (isGitHubStoreConfigured ? 'github' : 'local'),
    ...actions,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de <DataProvider>');
  return ctx;
}
