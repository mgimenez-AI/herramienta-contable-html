import { Hoverable } from '../Hoverable';
import { LoopIcon, StarIcon, PlusIcon } from '../icons';

function ProjectCard({ p, onEdit }) {
  return (
    <Hoverable
      as="div"
      onClick={onEdit}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-card)',
        borderRadius: 14,
        padding: '20px 22px',
        borderTop: `3px solid ${p.color}`,
        cursor: 'pointer',
      }}
      hoverStyle={{ boxShadow: '0 6px 20px rgba(20,30,40,.09)', borderColor: 'var(--border)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.2 }}>{p.nombre}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-soft)', marginTop: 4 }}>{p.desc}</div>
        </div>
        <div style={{ display: 'flex', flexShrink: 0 }}>
          {p.avatars.map((a, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '2px solid #fff',
                marginLeft: -8,
                background: a.color,
                color: '#fff',
                fontSize: 10,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {a.iniciales}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
          <span style={{ fontSize: 11.5, color: 'var(--text-soft)', fontWeight: 600 }}>Progreso</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: p.color, fontFamily: "'IBM Plex Mono',monospace" }}>{p.pct}%</span>
        </div>
        <div style={{ height: 7, background: 'var(--track)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 20, background: p.color, width: p.pctW }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 22, marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-soft)' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: -0.5 }}>{p.total}</div>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', fontWeight: 500, marginTop: 1 }}>Tareas</div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: -0.5, color: 'var(--tint-success-fg)' }}>
            {p.done}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', fontWeight: 500, marginTop: 1 }}>Completadas</div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: -0.5, color: p.pendColor }}>{p.pend}</div>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', fontWeight: 500, marginTop: 1 }}>Pendientes</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: p.nextColor }}>{p.nextLabel}</div>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', fontWeight: 500, marginTop: 1 }}>Próximo venc.</div>
        </div>
      </div>
    </Hoverable>
  );
}

export function ProyectosView({ logic }) {
  const { recurrentesCards, extraordinariosCards, openEditProject, openNewProject } = logic;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: 'var(--tint-blue-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <LoopIcon size={18} strokeWidth={2.2} color="var(--tint-blue-fg)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>Proyectos recurrentes</span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: '#00549E',
                background: '#E9F1F8',
                borderRadius: 20,
                padding: '1px 9px',
                fontFamily: "'IBM Plex Mono',monospace",
              }}
            >
              {recurrentesCards.length}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 1 }}>
            Se repiten en cada período: cierre, impuestos, conciliaciones, reporting.
          </div>
        </div>
      </div>
      <div className="project-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
        {recurrentesCards.map((p) => (
          <ProjectCard key={p.id} p={p} onEdit={() => openEditProject(p)} />
        ))}
        {recurrentesCards.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 22, color: 'var(--text-mute)', fontSize: 12.5, border: '1.5px dashed var(--border)', borderRadius: 12 }}>
            Sin proyectos recurrentes
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 11, margin: '30px 0 14px' }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: 'var(--tint-warn-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <StarIcon size={18} strokeWidth={2.2} color="var(--tint-warn-fg)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>Proyectos extraordinarios</span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: '#B0870F',
                background: '#FBF3D8',
                borderRadius: 20,
                padding: '1px 9px',
                fontFamily: "'IBM Plex Mono',monospace",
              }}
            >
              {extraordinariosCards.length}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 1 }}>
            Puntuales, con inicio y fin: auditorías, due diligence, proyectos especiales.
          </div>
        </div>
      </div>
      <div className="project-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
        {extraordinariosCards.map((p) => (
          <ProjectCard key={p.id} p={p} onEdit={() => openEditProject(p)} />
        ))}
        <Hoverable
          as="button"
          onClick={openNewProject}
          style={{
            border: '1.5px dashed var(--border)',
            borderRadius: 14,
            padding: 24,
            background: 'var(--surface-2)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'var(--text-soft)',
            minHeight: 120,
          }}
          hoverStyle={{ background: 'var(--panel)', borderColor: '#00549E', color: '#00549E' }}
        >
          <PlusIcon size={24} strokeWidth={2.2} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Nuevo proyecto</span>
        </Hoverable>
      </div>
    </div>
  );
}
