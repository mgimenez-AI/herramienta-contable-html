import { useCallback, useMemo, useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../auth/AuthProvider';
import { useTheme } from './useTheme';
import { useToast } from './useToast';
import { ESTADOS, PRIO, PALETTE, MESL, DOWL, TINT_BY_ESTADO } from '../data/constants';
import { pad, parseISO, diffDays, fmtDate, fmtLargo, inic, dueInfo, todayStart } from '../utils/helpers';
import { downloadTemplate as downloadTemplateFile, parseImportWorkbook } from '../utils/importHelpers';

const TITLES = {
  tablero: ['Tablero de tareas', 'Arrastrá las tarjetas entre columnas para actualizar el estado'],
  calendario: ['Calendario de vencimientos', 'Vencimientos contables e impositivos del período'],
  carga: ['Carga del equipo', 'Distribución de tareas por integrante'],
  proyectos: ['Proyectos del sector', 'Avance por área de trabajo — tocá una tarjeta para editar'],
  reporte: ['Reporte de gestión', 'Resumen imprimible del estado del sector'],
};
const KIND_LABEL = { task: 'tarea', person: 'integrante', project: 'proyecto' };
const NUEVO_LABEL = { task: 'Nueva tarea', person: 'Nuevo integrante', project: 'Nuevo proyecto' };

export function useAppLogic() {
  const data = useData();
  const auth = useAuth();
  const { team, projects, tasks } = data;
  const { theme, toggleTheme } = useTheme();
  const { flash, showFlash } = useToast();

  const today = todayStart();

  const currentUser = useMemo(() => {
    if (data.backend === 'sharepoint' && auth.account) {
      const name = auth.account.name || auth.account.username || 'Usuario';
      const match = team.find((p) => p.nombre.toLowerCase() === name.toLowerCase());
      return match || { nombre: name, rol: 'Miembro del equipo', iniciales: inic(name), color: PALETTE[0] };
    }
    return team[0] || null;
  }, [data.backend, auth.account, team]);

  const [view, setViewRaw] = useState('tablero');
  const [fResp, setFResp] = useState('todos');
  const [fProy, setFProy] = useState('todos');
  const [selected, setSelected] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [dayKey, setDayKey] = useState(null);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [formMode, setFormMode] = useState(null);
  const [editKind, setEditKind] = useState(null);
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState({});
  const [formError, setFormError] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [importPreview, setImportPreview] = useState(null);
  const [importStaged, setImportStaged] = useState(null);
  const [importNewProjects, setImportNewProjects] = useState(null);
  const [importSummary, setImportSummary] = useState(null);
  const [importErr, setImportErr] = useState('');

  const dragIdRef = useRef(null);

  const setView = useCallback((v) => {
    setViewRaw(v);
    setAlertsOpen(false);
  }, []);

  // ---- lookups ----
  const person = useCallback(
    (id) => team.find((p) => p.id === id) || { nombre: '—', rol: '', iniciales: '—', color: '#9AA0A0' },
    [team]
  );
  const project = useCallback(
    (id) => projects.find((p) => p.id === id) || { nombre: 'Sin proyecto', color: '#9AA0A0' },
    [projects]
  );

  const nextTaskLocalId = useCallback(() => Math.max(0, ...tasks.map((t) => Number(t.id) || 0)) + 1, [tasks]);

  const enrich = useCallback(
    (t) => {
      const p = person(t.resp);
      const pr = project(t.proy);
      const pri = PRIO[t.prio] || PRIO.media;
      const due = dueInfo(t, today);
      return {
        id: t.id,
        title: t.title,
        desc: t.desc || '',
        recurrente: !!t.recurrente,
        respNombre: p.nombre,
        respRol: p.rol,
        respIniciales: p.iniciales,
        respColor: p.color,
        respPrimer: (p.nombre || '—').split(' ')[0],
        proyNombre: pr.nombre,
        proyColor: pr.color,
        prioLabel: pri.label,
        prioColor: pri.color,
        prioBg: pri.bg,
        dueText: due.text,
        dueColor: due.color,
        dueBg: due.bg,
        vencFmt: fmtDate(parseISO(t.venc)),
        vencLargo: fmtLargo(parseISO(t.venc)),
      };
    },
    [person, project, today]
  );

  const filteredTasks = useMemo(
    () => tasks.filter((t) => (fResp === 'todos' || t.resp === fResp) && (fProy === 'todos' || t.proy === fProy)),
    [tasks, fResp, fProy]
  );

  const isDone = (t) => t.estado === 'completado';

  // ---- KPIs ----
  const kpis = useMemo(() => {
    const activas = tasks.filter((t) => !isDone(t)).length;
    const vencidas = tasks.filter((t) => !isDone(t) && diffDays(parseISO(t.venc), today) < 0).length;
    const semana = tasks.filter((t) => {
      const d = diffDays(parseISO(t.venc), today);
      return !isDone(t) && d >= 0 && d <= 7;
    }).length;
    const completadas = tasks.filter(isDone).length;
    return [
      { label: 'Tareas activas', value: activas, color: 'var(--tint-blue-fg)', hint: 'En curso en el sector' },
      { label: 'Vencidas', value: vencidas, color: 'var(--tint-danger-fg)', hint: 'Requieren atención' },
      { label: 'Vencen esta semana', value: semana, color: 'var(--tint-warn-fg)', hint: 'Próximos 7 días' },
      { label: 'Completadas', value: completadas, color: 'var(--tint-success-fg)', hint: 'En total' },
    ];
  }, [tasks, today]);

  // ---- kanban columns ----
  const moveTo = useCallback(
    (estado) => {
      const id = dragIdRef.current;
      if (id == null) return;
      data.updateTask(id, { estado });
      dragIdRef.current = null;
      setDragOverCol(null);
    },
    [data]
  );

  const columns = useMemo(
    () =>
      ESTADOS.map((e) => {
        const list = filteredTasks.filter((t) => t.estado === e.key);
        return {
          key: e.key,
          label: e.label,
          color: e.color,
          count: list.length,
          tasks: list.map((t) => ({ ...enrich(t), raw: t })),
          empty: list.length === 0,
          isOver: dragOverCol === e.key,
        };
      }),
    [filteredTasks, enrich, dragOverCol]
  );

  const onDragStartTask = useCallback((id) => {
    dragIdRef.current = id;
  }, []);
  const onDragEndTask = useCallback(() => {
    dragIdRef.current = null;
    setDragOverCol(null);
  }, []);
  const onDragOverColumn = useCallback((e) => e.preventDefault(), []);
  const onDragEnterColumn = useCallback((key) => setDragOverCol((cur) => (cur !== key ? key : cur)), []);
  const onDropColumn = useCallback(
    (key, e) => {
      e.preventDefault();
      moveTo(key);
    },
    [moveTo]
  );

  // ---- calendar ----
  const buildCalendar = useCallback(
    (list) => {
      const first = new Date(calYear, calMonth, 1);
      const startOffset = (first.getDay() + 6) % 7;
      const start = new Date(calYear, calMonth, 1 - startOffset);
      const byDate = {};
      list.forEach((t) => {
        (byDate[t.venc] = byDate[t.venc] || []).push(t);
      });
      const weeks = [];
      const cur = new Date(start);
      for (let w = 0; w < 6; w++) {
        const days = [];
        for (let i = 0; i < 7; i++) {
          const y = cur.getFullYear();
          const m = cur.getMonth();
          const dd = cur.getDate();
          const key = y + '-' + pad(m + 1) + '-' + pad(dd);
          const inMonth = m === calMonth;
          const isToday = y === today.getFullYear() && m === today.getMonth() && dd === today.getDate();
          const evs = byDate[key] || [];
          const shown = evs.slice(0, 2).map((t) => {
            const pri = PRIO[t.prio] || PRIO.media;
            return { id: t.id, title: t.title, prioColor: pri.color, prioBg: pri.bg };
          });
          days.push({
            key,
            num: dd,
            inMonth,
            isToday,
            tasks: shown,
            hasMore: evs.length > 2,
            moreCount: evs.length - 2,
          });
          cur.setDate(cur.getDate() + 1);
        }
        weeks.push({ days });
        if (cur.getMonth() !== calMonth && w >= 3 && days.every((d) => !d.inMonth)) {
          weeks.pop();
          break;
        }
      }
      return weeks;
    },
    [calYear, calMonth, today]
  );

  const weeks = useMemo(() => buildCalendar(filteredTasks), [buildCalendar, filteredTasks]);
  const monthLabel = `${MESL[calMonth]} ${calYear}`;

  const prevMonth = useCallback(() => {
    setCalMonth((m) => {
      if (m === 0) {
        setCalYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);
  const nextMonth = useCallback(() => {
    setCalMonth((m) => {
      if (m === 11) {
        setCalYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);
  const goToday = useCallback(() => {
    setCalYear(today.getFullYear());
    setCalMonth(today.getMonth());
  }, [today]);

  const genRecurring = useCallback(async () => {
    const templates = tasks.filter((t) => t.recurrente);
    const dim = new Date(calYear, calMonth + 1, 0).getDate();
    let nextId = nextTaskLocalId();
    const additions = [];
    const seen = new Set();
    templates.forEach((t) => {
      const day = Math.min(parseISO(t.venc).getDate(), dim);
      const key = calYear + '-' + pad(calMonth + 1) + '-' + pad(day);
      const dupe = tasks.some((x) => x.title === t.title && x.venc === key) || seen.has(t.title + key);
      if (!dupe) {
        additions.push({
          id: nextId++,
          title: t.title,
          desc: t.desc,
          resp: t.resp,
          proy: t.proy,
          prio: t.prio,
          estado: 'pendiente',
          venc: key,
          recurrente: true,
        });
        seen.add(t.title + key);
      }
    });
    if (additions.length) {
      await data.bulkCreateTasks(additions.map(({ id, ...rest }) => rest));
      showFlash(`${additions.length} tarea(s) generada(s) para ${MESL[calMonth]}`);
    } else {
      showFlash(`Los vencimientos de ${MESL[calMonth]} ya estaban generados`);
    }
  }, [tasks, calYear, calMonth, nextTaskLocalId, data, showFlash]);

  // ---- day modal ----
  const dayTasks = useMemo(() => {
    if (!dayKey) return [];
    const list = filteredTasks.filter((t) => t.venc === dayKey);
    return list.map((t) => {
      const e = enrich(t);
      const ed = ESTADOS.find((x) => x.key === t.estado) || ESTADOS[0];
      const tk = TINT_BY_ESTADO[t.estado] || 'neutral';
      return { ...e, raw: t, estadoLabel: ed.label, estadoColor: `var(--tint-${tk}-fg)`, estadoBg: `var(--tint-${tk}-bg)` };
    });
  }, [dayKey, filteredTasks, enrich]);
  const dayEmpty = dayTasks.length === 0;
  const dayCount = dayTasks.length + (dayTasks.length === 1 ? ' tarea' : ' tareas');
  const dayModalLabel = dayKey
    ? `${DOWL[parseISO(dayKey).getDay()]} ${parseISO(dayKey).getDate()} de ${MESL[parseISO(dayKey).getMonth()]}`
    : '';

  const openDay = useCallback((key) => setDayKey(key), []);
  const closeDay = useCallback(() => setDayKey(null), []);

  // ---- team load ----
  const teamLoad = useMemo(
    () =>
      team.map((p) => {
        const list = tasks.filter((t) => t.resp === p.id);
        const total = list.length || 1;
        const byE = ESTADOS.map((e) => ({ ...e, n: list.filter((t) => t.estado === e.key).length }));
        const segments = byE.filter((x) => x.n > 0).map((x) => ({ color: x.color, width: (x.n / total) * 100 + '%', title: `${x.label}: ${x.n}` }));
        const activasP = list.filter((t) => !isDone(t)).length;
        const vencP = list.filter((t) => !isDone(t) && diffDays(parseISO(t.venc), today) < 0).length;
        return {
          id: p.id,
          nombre: p.nombre,
          rol: p.rol,
          iniciales: p.iniciales,
          color: p.color,
          activas: activasP,
          vencidas: vencP,
          vencColor: vencP > 0 ? 'var(--tint-danger-fg)' : 'var(--text-mute)',
          done: list.filter(isDone).length,
          segments,
          legend: byE.map((x) => ({ color: x.color, label: x.label, n: x.n })),
        };
      }),
    [team, tasks, today]
  );

  // ---- projects ----
  const projectCards = useMemo(
    () =>
      projects.map((pr) => {
        const list = tasks.filter((t) => t.proy === pr.id);
        const done = list.filter(isDone).length;
        const total = list.length;
        const pct = total ? Math.round((done / total) * 100) : 0;
        const pend = total - done;
        const resp = [...new Set(list.map((t) => t.resp))].map((id) => person(id));
        const next = list
          .filter((t) => !isDone(t))
          .map((t) => parseISO(t.venc))
          .sort((a, b) => a - b)[0];
        const nextOver = next && diffDays(next, today) < 0;
        return {
          id: pr.id,
          nombre: pr.nombre,
          desc: pr.desc,
          color: pr.color,
          tipo: pr.tipo || 'recurrente',
          pct,
          pctW: pct + '%',
          total,
          done,
          pend,
          pendColor: pend > 0 ? 'var(--tint-danger-fg)' : 'var(--text-mute)',
          avatars: resp.map((p) => ({ iniciales: p.iniciales, color: p.color })),
          nextLabel: next ? fmtDate(next) : '—',
          nextColor: nextOver ? 'var(--tint-danger-fg)' : 'var(--text)',
        };
      }),
    [projects, tasks, person, today]
  );
  const recurrentesCards = useMemo(() => projectCards.filter((p) => p.tipo !== 'extraordinario'), [projectCards]);
  const extraordinariosCards = useMemo(() => projectCards.filter((p) => p.tipo === 'extraordinario'), [projectCards]);

  // ---- alerts ----
  const urgentList = useMemo(
    () =>
      tasks
        .filter((t) => !isDone(t) && diffDays(parseISO(t.venc), today) <= 2)
        .sort((a, b) => parseISO(a.venc) - parseISO(b.venc))
        .map((t) => ({ ...enrich(t), raw: t })),
    [tasks, enrich, today]
  );

  // ---- report ----
  const overdueList = useMemo(
    () =>
      tasks
        .filter((t) => !isDone(t) && diffDays(parseISO(t.venc), today) < 0)
        .sort((a, b) => parseISO(a.venc) - parseISO(b.venc))
        .map((t) => enrich(t)),
    [tasks, enrich, today]
  );
  const reportDate = `${today.getDate()} de ${MESL[today.getMonth()]} de ${today.getFullYear()}`;

  // ---- detail modal ----
  const selectedTaskRaw = selected != null ? tasks.find((t) => t.id === selected) : null;
  const selectedEnriched = selectedTaskRaw ? enrich(selectedTaskRaw) : null;
  const estadoBtns = selectedTaskRaw
    ? ESTADOS.map((e) => ({ key: e.key, label: e.label, color: e.color, on: selectedTaskRaw.estado === e.key }))
    : [];

  const openDetail = useCallback((id) => setSelected(id), []);
  const closeDetail = useCallback(() => setSelected(null), []);
  const setTaskEstado = useCallback((estado) => selectedTaskRaw && data.updateTask(selectedTaskRaw.id, { estado }), [selectedTaskRaw, data]);
  const deleteSelected = useCallback(() => {
    if (!selectedTaskRaw) return;
    data.deleteTask(selectedTaskRaw.id);
    setSelected(null);
    showFlash('Tarea eliminada');
  }, [selectedTaskRaw, data, showFlash]);

  // ---- form (task/person/project) ----
  const closeForm = useCallback(() => {
    setFormMode(null);
    setEditId(null);
    setEditKind(null);
    setFormError('');
  }, []);

  const openNewTask = useCallback(() => {
    const todayIso = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());
    setFormMode('task');
    setEditKind('task');
    setEditId(null);
    setFormError('');
    setDraft({ title: '', desc: '', resp: team[0]?.id || '', proy: projects[0]?.id || '', prio: 'media', estado: 'pendiente', venc: todayIso, recurrente: false });
  }, [team, projects, today]);

  const openTaskOnDay = useCallback(
    (key) => {
      setDayKey(null);
      setFormMode('task');
      setEditKind('task');
      setEditId(null);
      setFormError('');
      setDraft({ title: '', desc: '', resp: team[0]?.id || '', proy: projects[0]?.id || '', prio: 'media', estado: 'pendiente', venc: key, recurrente: false });
    },
    [team, projects]
  );

  const openEditTask = useCallback((t) => {
    setSelected(null);
    setFormMode('task');
    setEditKind('task');
    setEditId(t.id);
    setFormError('');
    setDraft({ title: t.title, desc: t.desc || '', resp: t.resp, proy: t.proy, prio: t.prio, estado: t.estado, venc: t.venc, recurrente: !!t.recurrente });
  }, []);

  const openNewPerson = useCallback(() => {
    setFormMode('person');
    setEditKind('person');
    setEditId(null);
    setFormError('');
    setDraft({ nombre: '', rol: '', color: PALETTE[0] });
  }, []);
  const openEditPerson = useCallback((p) => {
    setFormMode('person');
    setEditKind('person');
    setEditId(p.id);
    setFormError('');
    setDraft({ nombre: p.nombre, rol: p.rol, color: p.color });
  }, []);

  const openNewProject = useCallback(() => {
    setFormMode('project');
    setEditKind('project');
    setEditId(null);
    setFormError('');
    setDraft({ nombre: '', desc: '', color: PALETTE[0], tipo: 'recurrente' });
  }, []);
  const openEditProject = useCallback((p) => {
    setFormMode('project');
    setEditKind('project');
    setEditId(p.id);
    setFormError('');
    setDraft({ nombre: p.nombre, desc: p.desc, color: p.color, tipo: p.tipo || 'recurrente' });
  }, []);

  const setDraftField = useCallback((key, value) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setFormError('');
  }, []);

  const saveForm = useCallback(async () => {
    const d = draft;
    if (editKind === 'task') {
      if (!(d.title || '').trim()) {
        setFormError('Ingresá un título para la tarea.');
        return;
      }
      if (editId != null) {
        await data.updateTask(editId, {
          title: d.title.trim(),
          desc: d.desc,
          resp: d.resp,
          proy: d.proy,
          prio: d.prio,
          estado: d.estado,
          venc: d.venc,
          recurrente: !!d.recurrente,
        });
        showFlash('Tarea actualizada');
      } else {
        await data.createTask({
          title: d.title.trim(),
          desc: d.desc,
          resp: d.resp,
          proy: d.proy,
          prio: d.prio,
          estado: d.estado,
          venc: d.venc,
          recurrente: !!d.recurrente,
        });
        showFlash('Tarea creada');
      }
    } else if (editKind === 'person') {
      if (!(d.nombre || '').trim()) {
        setFormError('Ingresá el nombre.');
        return;
      }
      if (editId != null) {
        await data.updatePerson(editId, { nombre: d.nombre.trim(), rol: d.rol, color: d.color, iniciales: inic(d.nombre) });
        showFlash('Integrante actualizado');
      } else {
        await data.createPerson({ nombre: d.nombre.trim(), rol: d.rol || '', color: d.color, iniciales: inic(d.nombre) });
        showFlash('Integrante agregado');
      }
    } else if (editKind === 'project') {
      if (!(d.nombre || '').trim()) {
        setFormError('Ingresá el nombre del proyecto.');
        return;
      }
      if (editId != null) {
        await data.updateProject(editId, { nombre: d.nombre.trim(), desc: d.desc, color: d.color, tipo: d.tipo || 'recurrente' });
        showFlash('Proyecto actualizado');
      } else {
        await data.createProject({ nombre: d.nombre.trim(), desc: d.desc || '', color: d.color, tipo: d.tipo || 'recurrente' });
        showFlash('Proyecto creado');
      }
    }
    closeForm();
  }, [draft, editKind, editId, data, showFlash, closeForm]);

  const deleteCurrent = useCallback(async () => {
    if (editId == null) return;
    if (editKind === 'task') {
      await data.deleteTask(editId);
      showFlash('Tarea eliminada');
      closeForm();
      return;
    }
    if (editKind === 'person') {
      if (tasks.some((t) => t.resp === editId)) {
        setFormError('No se puede eliminar: tiene tareas asignadas. Reasignalas primero.');
        return;
      }
      await data.deletePerson(editId);
      showFlash('Integrante eliminado');
      closeForm();
      return;
    }
    if (editKind === 'project') {
      if (tasks.some((t) => t.proy === editId)) {
        setFormError('No se puede eliminar: tiene tareas asociadas. Reasignalas primero.');
        return;
      }
      await data.deleteProject(editId);
      showFlash('Proyecto eliminado');
      closeForm();
    }
  }, [editId, editKind, tasks, data, showFlash, closeForm]);

  const formTitle = formMode ? (editId != null ? `Editar ${KIND_LABEL[editKind] || ''}` : NUEVO_LABEL[editKind] || '') : '';

  // ---- import ----
  const openImport = useCallback(() => {
    setImportOpen(true);
    setImportPreview(null);
    setImportStaged(null);
    setImportNewProjects(null);
    setImportSummary(null);
    setImportErr('');
  }, []);
  const closeImport = useCallback(() => setImportOpen(false), []);

  const downloadTemplateAction = useCallback(() => {
    try {
      downloadTemplateFile(team, projects);
      showFlash('Plantilla descargada');
    } catch {
      showFlash('No se pudo generar la plantilla.');
    }
  }, [team, projects, showFlash]);

  const onImportFile = useCallback(
    (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const result = parseImportWorkbook(ev.target.result, team, projects);
          setImportStaged(result.staged);
          setImportPreview(result.preview);
          setImportNewProjects(result.newProjects);
          setImportSummary(result.summary);
          setImportErr(result.error);
        } catch {
          setImportErr('No se pudo leer el archivo. Usá la plantilla en formato .xlsx, .xls o .csv.');
        }
      };
      reader.readAsArrayBuffer(file);
      e.target.value = '';
    },
    [team, projects]
  );

  const doImport = useCallback(async () => {
    const staged = importStaged || [];
    if (!staged.length) {
      setImportErr('No hay filas para importar.');
      return;
    }
    const newProjNames = importNewProjects || [];
    const nameToId = {};
    for (const nm of newProjNames) {
      const created = await data.createProject({
        nombre: nm,
        desc: 'Creado por importación',
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        tipo: 'extraordinario',
      });
      nameToId[nm.toLowerCase()] = created.id;
    }
    const toCreate = staged.map((s) => {
      let proy = s.proy;
      if (!proy && s.proyNew) proy = nameToId[s.proyNew.toLowerCase()] || '';
      return { title: s.title, desc: s.desc, resp: s.resp, proy: proy || '', prio: s.prio, estado: s.estado, venc: s.venc, recurrente: s.recurrente };
    });
    await data.bulkCreateTasks(toCreate);
    showFlash(`${staged.length} tarea(s) importada(s)`);
    setImportOpen(false);
    setImportPreview(null);
    setImportStaged(null);
    setImportNewProjects(null);
    setImportSummary(null);
    setImportErr('');
  }, [importStaged, importNewProjects, data, showFlash]);

  return {
    // data passthrough
    team,
    projects,
    tasks,
    loading: data.loading,
    error: data.error,
    backend: data.backend,
    currentUser,
    auth,

    // view/nav
    view,
    setView,
    titles: TITLES,

    // filters
    fResp,
    setFResp,
    fProy,
    setFProy,

    // kpis + kanban
    kpis,
    columns,
    onDragStartTask,
    onDragEndTask,
    onDragOverColumn,
    onDragEnterColumn,
    onDropColumn,

    // calendar
    calYear,
    calMonth,
    monthLabel,
    weeks,
    prevMonth,
    nextMonth,
    goToday,
    genRecurring,
    dayKey,
    dayModalLabel,
    dayTasks,
    dayEmpty,
    dayCount,
    openDay,
    closeDay,
    addTaskOnDay: () => openTaskOnDay(dayKey),

    // team load
    teamLoad,

    // projects
    recurrentesCards,
    extraordinariosCards,
    openNewProject,
    openEditProject,

    // report
    overdueList,
    reportDate,

    // detail modal
    selected,
    selectedTaskRaw,
    selectedEnriched,
    estadoBtns,
    openDetail,
    closeDetail,
    setTaskEstado,
    editSelected: () => selectedTaskRaw && openEditTask(selectedTaskRaw),
    deleteSelected,

    // form
    formMode,
    editKind,
    editId,
    draft,
    setDraftField,
    formError,
    formTitle,
    isEditing: editId != null,
    openNewTask,
    openEditTask,
    openNewPerson,
    openEditPerson,
    closeForm,
    saveForm,
    deleteCurrent,

    // alerts
    alertsOpen,
    toggleAlerts: () => setAlertsOpen((v) => !v),
    urgentList,

    // theme
    theme,
    toggleTheme,

    // toast
    flash,
    showFlash,

    // import
    importOpen,
    openImport,
    closeImport,
    downloadTemplate: downloadTemplateAction,
    onImportFile,
    importPreview,
    importSummary,
    importErr,
    doImport,
    importCanCommit: !!(importStaged && importStaged.length),
  };
}
