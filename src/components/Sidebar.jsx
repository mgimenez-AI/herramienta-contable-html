import { Hoverable } from './Hoverable';
import { BoardIcon, CalendarIcon, UsersIcon, FolderIcon, ReportIcon, LogoIcon } from './icons';
import { inic } from '../utils/helpers';

const NAV_BASE = {
  display: 'flex',
  alignItems: 'center',
  gap: 11,
  width: '100%',
  border: 'none',
  borderRadius: 9,
  padding: '9px 11px',
  fontSize: 13.5,
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'left',
};
const NAV_ON = { ...NAV_BASE, background: 'var(--tint-blue-bg)', color: 'var(--tint-blue-fg)' };
const NAV_OFF = { ...NAV_BASE, background: 'transparent', color: 'var(--text-soft)' };
const NAV_HOVER = { background: 'var(--panel)' };

const NAV_ITEMS = [
  { key: 'tablero', label: 'Tablero', Icon: BoardIcon },
  { key: 'calendario', label: 'Calendario', Icon: CalendarIcon },
  { key: 'carga', label: 'Carga del equipo', Icon: UsersIcon },
  { key: 'proyectos', label: 'Proyectos', Icon: FolderIcon },
  { key: 'reporte', label: 'Reporte', Icon: ReportIcon },
];

export function Sidebar({ view, setView, team, openNewPerson, openEditPerson, currentUser }) {
  return (
    <aside
      data-noprint="1"
      className="app-sidebar"
      style={{
        width: 256,
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="sidebar-brand"
        style={{
          padding: '22px 20px 18px',
          borderBottom: '1px solid var(--border-soft)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 9,
            background: '#00549E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <LogoIcon size={20} />
        </div>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: -0.2, lineHeight: 1.1 }}>Contabilidad</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-soft)', fontWeight: 500, marginTop: 1 }}>&amp; Impuestos</div>
        </div>
      </div>

      <nav className="sidebar-nav" style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            color: 'var(--text-mute)',
            letterSpacing: 0.7,
            textTransform: 'uppercase',
            padding: '4px 10px 8px',
          }}
        >
          Vistas
        </div>
        {NAV_ITEMS.map(({ key, label, Icon }) => (
          <Hoverable
            as="button"
            key={key}
            onClick={() => setView(key)}
            style={view === key ? NAV_ON : NAV_OFF}
            hoverStyle={NAV_HOVER}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Hoverable>
        ))}
      </nav>

      <div style={{ padding: '8px 12px', marginTop: 4, minHeight: 0, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 10px 10px' }}>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: 'var(--text-mute)',
              letterSpacing: 0.7,
              textTransform: 'uppercase',
            }}
          >
            Equipo
          </span>
          <Hoverable
            as="button"
            onClick={openNewPerson}
            title="Agregar integrante"
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--tint-blue-fg)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              lineHeight: 1,
              fontWeight: 600,
            }}
            hoverStyle={{ background: 'var(--panel)' }}
          >
            +
          </Hoverable>
        </div>
        {team.map((p) => (
          <Hoverable
            as="button"
            key={p.id}
            onClick={() => openEditPerson(p)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '7px 10px',
              borderRadius: 8,
              width: '100%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
            }}
            hoverStyle={{ background: 'var(--panel)' }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                background: p.color,
              }}
            >
              {p.iniciales || inic(p.nombre)}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  lineHeight: 1.15,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {p.nombre}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: 'var(--text-mute)',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {p.rol}
              </div>
            </div>
          </Hoverable>
        ))}
      </div>

      <div
        className="sidebar-current-user"
        style={{
          marginTop: 'auto',
          padding: '14px 16px',
          borderTop: '1px solid var(--border-soft)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: currentUser?.color || '#00549E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {currentUser?.iniciales || '—'}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentUser?.nombre || 'Invitado'}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-mute)' }}>{currentUser?.rol || ''}</div>
        </div>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#009961' }} />
      </div>
    </aside>
  );
}
