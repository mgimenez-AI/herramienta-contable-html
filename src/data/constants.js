export const PALETTE = [
  '#00549E',
  '#009961',
  '#D4A017',
  '#8DB9CA',
  '#707372',
  '#B23B2C',
  '#5C7A88',
  '#B7D34B',
];

export const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const MESL = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
export const DOWL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const DOWS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const ESTADOS = [
  { key: 'pendiente', label: 'Pendiente', color: '#707372' },
  { key: 'progreso', label: 'En progreso', color: '#00549E' },
  { key: 'revision', label: 'En revisión', color: '#D4A017' },
  { key: 'completado', label: 'Completado', color: '#009961' },
];

export const PRIO = {
  alta: { label: 'Alta', color: 'var(--tint-danger-fg)', bg: 'var(--tint-danger-bg)' },
  media: { label: 'Media', color: 'var(--tint-warn-fg)', bg: 'var(--tint-warn-bg)' },
  baja: { label: 'Baja', color: 'var(--tint-info-fg)', bg: 'var(--tint-info-bg)' },
};

export const TINT_BY_ESTADO = {
  pendiente: 'neutral',
  progreso: 'blue',
  revision: 'warn',
  completado: 'success',
};
