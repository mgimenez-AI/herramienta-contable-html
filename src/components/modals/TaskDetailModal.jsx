import { Hoverable } from '../Hoverable';
import { ClockIcon, TrashIcon } from '../icons';

export function TaskDetailModal({ logic }) {
  const { selectedEnriched: sel, selectedTaskRaw, estadoBtns, setTaskEstado, closeDetail, editSelected, deleteSelected } = logic;
  if (!sel || !selectedTaskRaw) return null;

  return (
    <div
      onClick={closeDetail}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(28,34,32,.42)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        animation: 'fadeIn .15s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 520,
          maxWidth: '92vw',
          background: 'var(--surface)',
          borderRadius: 16,
          boxShadow: '0 24px 60px rgba(20,30,40,.28)',
          animation: 'modalIn .2s cubic-bezier(.2,.8,.3,1)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid var(--border-soft)', borderTop: `4px solid ${sel.prioColor}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.3,
                textTransform: 'uppercase',
                color: sel.prioColor,
                background: sel.prioBg,
                borderRadius: 5,
                padding: '3px 8px',
              }}
            >
              Prioridad {sel.prioLabel}
            </span>
            <span
              style={{
                fontSize: 11,
                color: 'var(--text-soft)',
                fontWeight: 600,
                background: 'var(--panel)',
                borderRadius: 5,
                padding: '3px 9px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: 2, background: sel.proyColor }} />
              {sel.proyNombre}
            </span>
            {sel.recurrente && (
              <span style={{ fontSize: 11, color: 'var(--tint-info-fg)', fontWeight: 600, background: 'var(--tint-info-bg)', borderRadius: 5, padding: '3px 9px' }}>
                ↻ Mensual
              </span>
            )}
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.4, lineHeight: 1.25 }}>{sel.title}</div>
          <div style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 8, lineHeight: 1.5 }}>{sel.desc}</div>
        </div>
        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>
              Responsable
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: sel.respColor,
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {sel.respIniciales}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{sel.respNombre}</div>
                <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>{sel.respRol}</div>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>
              Vencimiento
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: sel.dueBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClockIcon size={16} strokeWidth={2.2} color={sel.dueColor} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "'IBM Plex Mono',monospace", color: sel.dueColor }}>{sel.vencLargo}</div>
                <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>{sel.dueText}</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '0 24px 20px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 9 }}>
            Cambiar estado
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {estadoBtns.map((e) => (
              <button
                key={e.key}
                onClick={() => setTaskEstado(e.key)}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  padding: '9px 6px',
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all .12s',
                  border: e.on ? `1.5px solid ${e.color}` : '1.5px solid var(--border-card)',
                  background: e.on ? e.color : 'var(--surface)',
                  color: e.on ? '#fff' : 'var(--text-soft)',
                }}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            padding: '16px 24px',
            background: 'var(--surface-2)',
            borderTop: '1px solid var(--border-soft)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Hoverable
            as="button"
            onClick={deleteSelected}
            style={{
              border: '1px solid var(--tint-danger-bg)',
              background: 'var(--surface)',
              color: 'var(--tint-danger-fg)',
              borderRadius: 9,
              padding: '9px 14px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            hoverStyle={{ background: 'var(--tint-danger-bg)' }}
          >
            <TrashIcon size={14} />
            Eliminar
          </Hoverable>
          <div style={{ display: 'flex', gap: 9 }}>
            <Hoverable
              as="button"
              onClick={editSelected}
              style={{
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                borderRadius: 9,
                padding: '9px 16px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
              hoverStyle={{ background: 'var(--panel)' }}
            >
              Editar
            </Hoverable>
            <Hoverable
              as="button"
              onClick={closeDetail}
              style={{ border: 'none', background: '#00549E', color: '#fff', borderRadius: 9, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              hoverStyle={{ background: '#00478A' }}
            >
              Cerrar
            </Hoverable>
          </div>
        </div>
      </div>
    </div>
  );
}
