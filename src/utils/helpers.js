import { MES, MESL } from '../data/constants';

export function pad(n) {
  return String(n).padStart(2, '0');
}

export function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function parseISO(s) {
  return new Date(s + 'T00:00:00');
}

export function diffDays(d, today = todayStart()) {
  return Math.round((d - today) / 86400000);
}

export function fmtDate(d) {
  return d.getDate() + ' ' + MES[d.getMonth()];
}

export function fmtLargo(d) {
  return d.getDate() + ' de ' + MESL[d.getMonth()];
}

export function inic(nombre) {
  const p = (nombre || '').trim().split(/\s+/);
  return (((p[0] || '')[0] || '') + ((p[1] || '')[0] || '')).toUpperCase() || '?';
}

export function uid(pfx) {
  return pfx + '_' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
}

export function dueInfo(t, today = todayStart()) {
  const d = parseISO(t.venc);
  const diff = diffDays(d, today);
  const done = t.estado === 'completado';
  let text, color, bg;
  if (done) {
    text = fmtDate(d);
    color = 'var(--tint-neutral-fg)';
    bg = 'var(--tint-neutral-bg)';
  } else if (diff < 0) {
    text = 'Vencida';
    color = 'var(--tint-danger-fg)';
    bg = 'var(--tint-danger-bg)';
  } else if (diff === 0) {
    text = 'Hoy';
    color = 'var(--tint-danger-fg)';
    bg = 'var(--tint-danger-bg)';
  } else if (diff === 1) {
    text = 'Mañana';
    color = 'var(--tint-warn-fg)';
    bg = 'var(--tint-warn-bg)';
  } else if (diff <= 5) {
    text = fmtDate(d);
    color = 'var(--tint-warn-fg)';
    bg = 'var(--tint-warn-bg)';
  } else {
    text = fmtDate(d);
    color = 'var(--tint-neutral-fg)';
    bg = 'var(--tint-neutral-bg)';
  }
  return { text, color, bg, diff, done };
}
