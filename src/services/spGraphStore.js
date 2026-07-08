import { createGraphClient } from './graphClient';
import { inic } from '../utils/helpers';
import { PALETTE } from '../data/constants';

const SITE_HOSTNAME = import.meta.env.VITE_SP_SITE_HOSTNAME || '';
const SITE_PATH = import.meta.env.VITE_SP_SITE_PATH || '';
const LIST_TAREAS = import.meta.env.VITE_SP_LIST_TAREAS || 'Tareas';
const LIST_EQUIPO = import.meta.env.VITE_SP_LIST_EQUIPO || 'Equipo';
const LIST_PROYECTOS = import.meta.env.VITE_SP_LIST_PROYECTOS || 'Proyectos';

const PRIO_TO_CHOICE = { alta: 'Alta', media: 'Media', baja: 'Baja' };
const CHOICE_TO_PRIO = { alta: 'alta', media: 'media', baja: 'baja' };
const ESTADO_TO_CHOICE = {
  pendiente: 'Pendiente',
  progreso: 'En progreso',
  revision: 'En revisión',
  completado: 'Completado',
};
const CHOICE_TO_ESTADO = {
  pendiente: 'pendiente',
  'en progreso': 'progreso',
  'en revisión': 'revision',
  'en revision': 'revision',
  completado: 'completado',
};
const TIPO_TO_CHOICE = { recurrente: 'Recurrente', extraordinario: 'Extraordinario' };

function normPrioChoice(v) {
  return CHOICE_TO_PRIO[String(v || '').toLowerCase()] || 'media';
}
function normEstadoChoice(v) {
  return CHOICE_TO_ESTADO[String(v || '').toLowerCase()] || 'pendiente';
}
function normTipoChoice(v) {
  return String(v || '').toLowerCase() === 'extraordinario' ? 'extraordinario' : 'recurrente';
}
// La columna se llama "TipoProyecto" (no "Tipo") porque SharePoint reserva ese nombre.
function normDate(v) {
  return String(v || '').slice(0, 10);
}

/**
 * Data store backed by 3 SharePoint Lists (Tareas, Equipo, Proyectos) via Microsoft Graph.
 * See SETUP.md for the exact list/column schema this expects, and for the Entra ID
 * app registration + Graph permissions required.
 *
 * List item ids are used directly as our entity ids (as strings), and as the
 * Lookup targets for Tareas.Responsable / Tareas.Proyecto — no separate id mapping needed.
 */
export function createSharePointStore(getAccessToken) {
  const graph = createGraphClient(getAccessToken);
  let siteId = null;
  const listIds = {};

  async function resolveSite() {
    if (siteId) return siteId;
    const site = await graph.request(`/sites/${SITE_HOSTNAME}:${SITE_PATH}`);
    siteId = site.id;
    return siteId;
  }

  async function resolveListId(displayName) {
    if (listIds[displayName]) return listIds[displayName];
    const sid = await resolveSite();
    const lists = await graph.getAllPages(`/sites/${sid}/lists?$select=id,displayName`);
    const found = lists.find((l) => l.displayName.toLowerCase() === displayName.toLowerCase());
    if (!found) {
      throw new Error(
        `No se encontró la lista de SharePoint "${displayName}". Revisá que exista con ese nombre exacto (ver SETUP.md).`
      );
    }
    listIds[displayName] = found.id;
    return found.id;
  }

  async function fetchItems(displayName) {
    const sid = await resolveSite();
    const lid = await resolveListId(displayName);
    return graph.getAllPages(`/sites/${sid}/lists/${lid}/items?$expand=fields&$top=200`);
  }

  async function createItem(displayName, fields) {
    const sid = await resolveSite();
    const lid = await resolveListId(displayName);
    return graph.request(`/sites/${sid}/lists/${lid}/items`, {
      method: 'POST',
      body: JSON.stringify({ fields }),
    });
  }

  async function updateItemFields(displayName, itemId, fields) {
    const sid = await resolveSite();
    const lid = await resolveListId(displayName);
    return graph.request(`/sites/${sid}/lists/${lid}/items/${itemId}/fields`, {
      method: 'PATCH',
      body: JSON.stringify(fields),
    });
  }

  async function deleteItem(displayName, itemId) {
    const sid = await resolveSite();
    const lid = await resolveListId(displayName);
    return graph.request(`/sites/${sid}/lists/${lid}/items/${itemId}`, { method: 'DELETE' });
  }

  // ---- mapping ----
  function toPerson(item) {
    const f = item.fields || {};
    return {
      id: String(item.id),
      nombre: f.Title || '',
      rol: f.Rol || '',
      color: f.Color || PALETTE[0],
      iniciales: inic(f.Title || ''),
    };
  }
  function toProject(item) {
    const f = item.fields || {};
    return {
      id: String(item.id),
      nombre: f.Title || '',
      desc: f.Descripcion || '',
      color: f.Color || PALETTE[0],
      tipo: normTipoChoice(f.TipoProyecto),
    };
  }
  function toTask(item) {
    const f = item.fields || {};
    return {
      id: Number(item.id),
      title: f.Title || '',
      desc: f.Descripcion || '',
      resp: f.ResponsableLookupId ? String(f.ResponsableLookupId) : '',
      proy: f.ProyectoLookupId ? String(f.ProyectoLookupId) : '',
      prio: normPrioChoice(f.Prioridad),
      estado: normEstadoChoice(f.Estado),
      venc: normDate(f.Vencimiento),
      recurrente: !!f.RecurrenteMensual,
    };
  }

  function taskPatchToFields(patch) {
    const fields = {};
    if ('title' in patch) fields.Title = patch.title;
    if ('desc' in patch) fields.Descripcion = patch.desc || '';
    if ('resp' in patch) fields.ResponsableLookupId = patch.resp ? Number(patch.resp) : null;
    if ('proy' in patch) fields.ProyectoLookupId = patch.proy ? Number(patch.proy) : null;
    if ('prio' in patch) fields.Prioridad = PRIO_TO_CHOICE[patch.prio] || 'Media';
    if ('estado' in patch) fields.Estado = ESTADO_TO_CHOICE[patch.estado] || 'Pendiente';
    if ('venc' in patch) fields.Vencimiento = patch.venc;
    if ('recurrente' in patch) fields.RecurrenteMensual = !!patch.recurrente;
    return fields;
  }

  return {
    kind: 'sharepoint',

    async init() {
      const [teamItems, projectItems, taskItems] = await Promise.all([
        fetchItems(LIST_EQUIPO),
        fetchItems(LIST_PROYECTOS),
        fetchItems(LIST_TAREAS),
      ]);
      return {
        team: teamItems.map(toPerson),
        projects: projectItems.map(toProject),
        tasks: taskItems.map(toTask),
      };
    },

    async createTask(task) {
      const fields = taskPatchToFields(task);
      const item = await createItem(LIST_TAREAS, fields);
      return toTask({ id: item.id, fields });
    },
    async updateTask(id, patch) {
      await updateItemFields(LIST_TAREAS, id, taskPatchToFields(patch));
    },
    async deleteTask(id) {
      await deleteItem(LIST_TAREAS, id);
    },
    async bulkCreateTasks(tasks) {
      // Se crean secuencialmente: Graph no ofrece batch nativo simple para list items
      // en v1.0 más allá de $batch (hasta 20 por lote). Para lotes de auditoría
      // (decenas de filas) esto es suficientemente rápido.
      const created = [];
      for (const t of tasks) {
        created.push(await this.createTask(t));
      }
      return created;
    },

    async createPerson(person) {
      const fields = { Title: person.nombre, Rol: person.rol || '', Color: person.color || PALETTE[0] };
      const item = await createItem(LIST_EQUIPO, fields);
      return toPerson({ id: item.id, fields });
    },
    async updatePerson(id, patch) {
      const fields = {};
      if ('nombre' in patch) fields.Title = patch.nombre;
      if ('rol' in patch) fields.Rol = patch.rol || '';
      if ('color' in patch) fields.Color = patch.color;
      await updateItemFields(LIST_EQUIPO, id, fields);
    },
    async deletePerson(id) {
      await deleteItem(LIST_EQUIPO, id);
    },

    async createProject(project) {
      const fields = {
        Title: project.nombre,
        Descripcion: project.desc || '',
        Color: project.color || PALETTE[0],
        TipoProyecto: TIPO_TO_CHOICE[project.tipo] || 'Recurrente',
      };
      const item = await createItem(LIST_PROYECTOS, fields);
      return toProject({ id: item.id, fields });
    },
    async updateProject(id, patch) {
      const fields = {};
      if ('nombre' in patch) fields.Title = patch.nombre;
      if ('desc' in patch) fields.Descripcion = patch.desc || '';
      if ('color' in patch) fields.Color = patch.color;
      if ('tipo' in patch) fields.TipoProyecto = TIPO_TO_CHOICE[patch.tipo] || 'Recurrente';
      await updateItemFields(LIST_PROYECTOS, id, fields);
    },
    async deleteProject(id) {
      await deleteItem(LIST_PROYECTOS, id);
    },
  };
}
