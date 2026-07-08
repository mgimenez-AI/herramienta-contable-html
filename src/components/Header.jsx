import { Hoverable } from './Hoverable';
import { MoonIcon, SunIcon, ImportIcon, BellIcon, PlusIcon } from './icons';

const BTN_ICON = {
  width: 38,
  height: 38,
  border: '1px solid var(--border)',
  borderRadius: 9,
  background: 'var(--surface)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-soft)',
};
const BTN_HOVER = { background: 'var(--panel)' };

export function Header({ logic }) {
  const { view, titles, fResp, setFResp, fProy, setFProy, team, projects, theme, toggleTheme, openImport, alertsOpen, toggleAlerts, urgentList, openDetail, openNewTask } = logic;

  const showFilters = view === 'tablero' || view === 'calendario' || view === 'carga';
  const [title, subtitle] = titles[view];
  const isDark = theme === 'dark';
  const hasUrgent = urgentList.length > 0;

  return (
    <header
      data-noprint="1"
      className="app-header"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        flexShrink: 0,
        flexWrap: 'wrap',
      }}
    >
      <div className="header-title" style={{ flex: '1 1 220px', minWidth: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.4, lineHeight: 1.1 }}>{title}</div>
        <div
          style={{
            fontSize: 12.5,
            color: 'var(--text-soft)',
            marginTop: 3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {subtitle}
        </div>
      </div>

      {showFilters && (
        <div className="header-filters" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <select
            value={fResp}
            onChange={(e) => setFResp(e.target.value)}
            title="Filtrar por responsable"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '7px 10px',
              fontSize: 12.5,
              color: 'var(--text)',
              background: 'var(--surface)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <option value="todos">Todos</option>
            {team.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
          <select
            value={fProy}
            onChange={(e) => setFProy(e.target.value)}
            title="Filtrar por proyecto"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '7px 10px',
              fontSize: 12.5,
              color: 'var(--text)',
              background: 'var(--surface)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <option value="todos">Todos</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Hoverable
          as="button"
          onClick={toggleTheme}
          title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          style={BTN_ICON}
          hoverStyle={BTN_HOVER}
        >
          {isDark ? <MoonIcon size={18} /> : <SunIcon size={17} />}
        </Hoverable>

        <Hoverable
          as="button"
          onClick={openImport}
          title="Importar tareas desde Excel"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-soft)',
            borderRadius: 9,
            padding: '9px 14px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            whiteSpace: 'nowrap',
          }}
          hoverStyle={BTN_HOVER}
        >
          <ImportIcon size={15} />
          Importar
        </Hoverable>

        <div style={{ position: 'relative' }}>
          <Hoverable as="button" onClick={toggleAlerts} title="Vencimientos urgentes" style={{ ...BTN_ICON, position: 'relative' }} hoverStyle={BTN_HOVER}>
            <BellIcon size={18} />
            {hasUrgent && (
              <span
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  minWidth: 18,
                  height: 18,
                  padding: '0 4px',
                  borderRadius: 9,
                  background: '#B23B2C',
                  color: '#fff',
                  fontSize: 10.5,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff',
                }}
              >
                {urgentList.length}
              </span>
            )}
          </Hoverable>
          {alertsOpen && (
            <div
              style={{
                position: 'absolute',
                top: 46,
                right: 0,
                width: 320,
                maxWidth: 'calc(100vw - 24px)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                boxShadow: '0 16px 40px rgba(20,30,40,.18)',
                zIndex: 40,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-soft)', fontSize: 13, fontWeight: 700 }}>
                Vencimientos urgentes
              </div>
              <div style={{ maxHeight: 340, overflow: 'auto' }}>
                {urgentList.map((a) => (
                  <Hoverable
                    as="button"
                    key={a.id}
                    onClick={() => {
                      openDetail(a.id);
                      toggleAlerts();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 11,
                      padding: '11px 16px',
                      width: '100%',
                      border: 'none',
                      borderBottom: '1px solid var(--border-soft)',
                      background: 'var(--surface)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    hoverStyle={{ background: 'var(--surface-2)' }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: a.dueColor }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          lineHeight: 1.25,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {a.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 1 }}>
                        {a.respPrimer} · {a.proyNombre}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: a.dueColor, fontFamily: "'IBM Plex Mono',monospace", flexShrink: 0 }}>
                      {a.dueText}
                    </span>
                  </Hoverable>
                ))}
                {!hasUrgent && (
                  <div style={{ padding: '26px 16px', textAlign: 'center', color: 'var(--text-mute)', fontSize: 12.5 }}>
                    Sin vencimientos urgentes 🎉
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Hoverable
          as="button"
          onClick={openNewTask}
          style={{
            border: 'none',
            background: '#00549E',
            color: '#fff',
            borderRadius: 9,
            padding: '9px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            whiteSpace: 'nowrap',
          }}
          hoverStyle={{ background: '#00478A' }}
        >
          <PlusIcon size={15} color="#fff" strokeWidth={2.6} />
          Nueva tarea
        </Hoverable>
      </div>
    </header>
  );
}
