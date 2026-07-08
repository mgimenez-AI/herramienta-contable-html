import * as XLSX from 'xlsx';
import { pad } from './helpers';

export function normPrio(v) {
  const s = String(v || '').trim().toLowerCase();
  if (/alta|high|urg/.test(s)) return 'alta';
  if (/baja|low/.test(s)) return 'baja';
  return 'media';
}

export function normEstado(v) {
  const s = String(v || '').trim().toLowerCase();
  if (/complet|done|hecho|termin|finaliz|list/.test(s)) return 'completado';
  if (/revis|review|control/.test(s)) return 'revision';
  if (/progres|curso|proceso|doing|hacien/.test(s)) return 'progreso';
  return 'pendiente';
}

export function toISO(v) {
  if (v instanceof Date && !isNaN(v)) {
    return v.getFullYear() + '-' + pad(v.getMonth() + 1) + '-' + pad(v.getDate());
  }
  const s = String(v || '').trim();
  if (!s) return '';
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return m[1] + '-' + pad(+m[2]) + '-' + pad(+m[3]);
  m = s.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})/);
  if (m) {
    let y = m[3];
    if (y.length === 2) y = '20' + y;
    return y + '-' + pad(+m[2]) + '-' + pad(+m[1]);
  }
  const d = new Date(s);
  if (!isNaN(d)) return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  return '';
}

export function matchPerson(team, name) {
  const n = String(name || '').trim().toLowerCase();
  if (!n) return '';
  let p = team.find((x) => x.nombre.toLowerCase() === n);
  if (p) return p.id;
  p = team.find((x) => x.nombre.toLowerCase().split(' ')[0] === n.split(' ')[0]);
  if (p) return p.id;
  p = team.find((x) => x.nombre.toLowerCase().includes(n) || n.includes(x.nombre.toLowerCase().split(' ')[0]));
  return p ? p.id : '';
}

export function matchProject(projects, name) {
  const raw = String(name || '').trim();
  const n = raw.toLowerCase();
  if (!n) return { id: '', create: null };
  let p = projects.find((x) => x.nombre.toLowerCase() === n);
  if (p) return { id: p.id, create: null };
  p = projects.find((x) => x.nombre.toLowerCase().includes(n) || n.includes(x.nombre.toLowerCase()));
  if (p) return { id: p.id, create: null };
  return { id: null, create: raw };
}

function getField(row, keys) {
  for (const kk in row) {
    const key = kk.trim().toLowerCase();
    if (keys.indexOf(key) >= 0) return row[kk];
  }
  return '';
}

export function downloadTemplate(team, projects) {
  const head = ['Titulo', 'Descripcion', 'Responsable', 'Proyecto', 'Prioridad', 'Estado', 'Vencimiento', 'RecurrenteMensual'];
  const impProj = (projects.find((p) => /impuesto/i.test(p.nombre)) || projects[0] || {}).nombre || '';
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);
  const fechaEj = in30.getFullYear() + '-' + pad(in30.getMonth() + 1) + '-' + pad(in30.getDate());
  const ej1 = ['DDJJ IVA - Posición del mes', 'Armado y control de la DDJJ de IVA', (team[0] || {}).nombre || '', impProj, 'Alta', 'Pendiente', fechaEj, 'Si'];
  const ej2 = [
    'Conciliación Banco Galicia',
    'Extractos bancarios vs. mayor contable',
    (team[2] || team[0] || {}).nombre || '',
    'Conciliaciones bancarias',
    'Media',
    'En progreso',
    fechaEj,
    'Si',
  ];
  const ws = XLSX.utils.aoa_to_sheet([head, ej1, ej2]);
  ws['!cols'] = [{ wch: 34 }, { wch: 36 }, { wch: 20 }, { wch: 26 }, { wch: 11 }, { wch: 14 }, { wch: 14 }, { wch: 18 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tareas');
  const instr = [
    ['PLANTILLA DE CARGA DE TAREAS — Contabilidad e Impuestos'],
    [''],
    ['1) Completá una fila por tarea en la hoja "Tareas".'],
    ['2) No cambies los nombres de las columnas (primera fila).'],
    ['3) Podés borrar las dos filas de ejemplo, o dejarlas: se importan igual.'],
    ['4) Solo el Título es obligatorio. Lo demás toma un valor por defecto si queda vacío.'],
    [''],
    ['VALORES VÁLIDOS POR COLUMNA'],
    ['Responsable', team.map((p) => p.nombre).join('  |  ') + '   (si no coincide, queda sin asignar)'],
    ['Proyecto', projects.map((p) => p.nombre).join('  |  ') + '   (si escribís uno nuevo, se crea automáticamente)'],
    ['Prioridad', 'Alta  |  Media  |  Baja'],
    ['Estado', 'Pendiente  |  En progreso  |  En revisión  |  Completado'],
    ['Vencimiento', 'Fecha. Formato 2026-08-18  ó  18/08/2026'],
    ['RecurrenteMensual', 'Si  |  No'],
  ];
  const wsi = XLSX.utils.aoa_to_sheet(instr);
  wsi['!cols'] = [{ wch: 22 }, { wch: 78 }];
  XLSX.utils.book_append_sheet(wb, wsi, 'Instrucciones');
  XLSX.writeFile(wb, 'Plantilla_Tareas_Contabilidad.xlsx');
}

export function parseImportWorkbook(arrayBuffer, team, projects) {
  const wb = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array', cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
  const staged = [];
  const preview = [];
  const newProjSet = {};
  let warn = 0;
  let skip = 0;
  const fallbackDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  })();

  rows.forEach((r) => {
    const title = String(getField(r, ['titulo', 'título', 'tarea', 'título de la tarea', 'titulo de la tarea']) || '').trim();
    if (!title) {
      skip++;
      return;
    }
    const desc = String(getField(r, ['descripcion', 'descripción', 'detalle']) || '').trim();
    const respId = matchPerson(team, getField(r, ['responsable', 'asignado', 'responsible', 'encargado']));
    const pm = matchProject(projects, getField(r, ['proyecto', 'project', 'area', 'área']));
    const prio = normPrio(getField(r, ['prioridad', 'priority']));
    const estado = normEstado(getField(r, ['estado', 'status']));
    const venc = toISO(getField(r, ['vencimiento', 'fecha', 'vence', 'due', 'fecha de vencimiento', 'fecha limite', 'fecha límite']));
    const rec = /^(s|y|v|t|1|x)/i.test(String(getField(r, ['recurrentemensual', 'recurrente', 'mensual', 'recurrente mensual']) || '').trim());
    const w = [];
    if (!respId) w.push('Responsable sin asignar');
    if (pm.create) {
      w.push('Proyecto nuevo: ' + pm.create);
      newProjSet[pm.create.toLowerCase()] = pm.create;
    }
    if (!venc) w.push('Sin fecha → ' + fallbackDate);
    if (w.length) warn++;
    staged.push({
      title,
      desc,
      resp: respId,
      proy: pm.id || '',
      proyNew: pm.create || null,
      prio,
      estado,
      venc: venc || fallbackDate,
      recurrente: rec,
    });
    const person = team.find((p) => p.id === respId);
    const project = projects.find((p) => p.id === pm.id);
    preview.push({
      title,
      resp: person ? person.nombre : 'Sin asignar',
      proy: project ? project.nombre : pm.create || 'Sin proyecto',
      venc: venc || fallbackDate,
      warn: w.join(' · '),
      hasWarn: w.length > 0,
      dot: w.length ? '#D4A017' : '#009961',
    });
  });

  const newProjects = Object.keys(newProjSet).map((k) => newProjSet[k]);
  return {
    staged,
    preview,
    newProjects,
    summary: { ok: staged.length, warn, skip, newProj: newProjects.length },
    error: staged.length ? '' : 'No se encontró ninguna fila con Título. Revisá que la columna "Titulo" tenga datos y usá la plantilla.',
  };
}
