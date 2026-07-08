import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createLocalDevStore } from '../services/localDevStore';
import { createSharePointStore } from '../services/spGraphStore';
import { isSharePointConfigured } from '../auth/msalConfig';
import { useAuth } from '../auth/AuthProvider';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const auth = useAuth();
  const storeRef = useRef(null);
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const ready = isSharePointConfigured ? auth.isAuthenticated : true;

  useEffect(() => {
    if (!ready) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    if (!storeRef.current) {
      storeRef.current = isSharePointConfigured ? createSharePointStore(auth.getAccessToken) : createLocalDevStore();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

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
    backend: isSharePointConfigured ? 'sharepoint' : 'local',
    ...actions,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de <DataProvider>');
  return ctx;
}
