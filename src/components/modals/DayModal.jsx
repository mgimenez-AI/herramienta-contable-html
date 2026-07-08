import { Hoverable } from '../Hoverable';
import { PlusIcon } from '../icons';

export function DayModal({ logic }) {
  const { dayKey, dayModalLabel, dayTasks, dayEmpty, dayCount, closeDay, openDetail, addTaskOnDay } = logic;
  if (!dayKey) return null;

  return (
    <div
      onClick={closeDay}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(28,34,32,.42)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 55,
        animation: 'fadeIn .15s ease',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 470,
          maxWidth: '94vw',
          maxHeight: '86vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface)',
          borderRadius: 16,
          boxShadow: '0 24px 60px rgba(20,30,40,.28)',
          animation: 'modalIn .2s cubic-bezier(.2,.8,.3,1)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--border-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--text-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Vencimientos</div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3, marginTop: 2 }}>{dayModalLabel}</div>
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "'IBM Plex Mono',monospace",
              color: '#00549E',
              background: '#E9F1F8',
              borderRadius: 20,
              padding: '4px 12px',
              whiteSpace: 'nowrap',
            }}
          >
            {dayCount}
          </div>
        </div>
        <div style={{ padding: '12px 16px 4px', overflow: 'auto' }}>
          {dayTasks.map((t) => (
            <Hoverable
              as="button"
              key={t.id}
              onClick={() => openDetail(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                border: '1px solid #EDEEEC',
                borderRadius: 10,
                padding: '11px 13px',
                background: 'var(--surface)',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: 8,
              }}
              hoverStyle={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
            >
              <span style={{ width: 5, height: 34, borderRadius: 3, flexShrink: 0, background: t.prioColor }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{t.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-mute)', fontWeight: 500 }}>{t.respPrimer}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: t.estadoColor, background: t.estadoBg, borderRadius: 4, padding: '2px 7px' }}>
                    {t.estadoLabel}
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: t.respColor,
                  color: '#fff',
                  fontSize: 9.5,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {t.respIniciales}
              </div>
            </Hoverable>
          ))}
          {dayEmpty && <div style={{ textAlign: 'center', padding: '26px 12px', color: 'var(--text-mute)', fontSize: 12.5 }}>Sin vencimientos este día</div>}
        </div>
        <div style={{ padding: '14px 16px 18px', borderTop: '1px solid var(--border-soft)', display: 'flex', gap: 9, flexShrink: 0 }}>
          <Hoverable
            as="button"
            onClick={addTaskOnDay}
            style={{
              flex: 1,
              border: '1px solid var(--tint-blue-fg)',
              background: 'var(--tint-blue-bg)',
              color: 'var(--tint-blue-fg)',
              borderRadius: 9,
              padding: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
            }}
            hoverStyle={{ background: 'var(--panel)' }}
          >
            <PlusIcon size={14} strokeWidth={2.6} />
            Agregar tarea a este día
          </Hoverable>
          <Hoverable
            as="button"
            onClick={closeDay}
            style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', borderRadius: 9, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            hoverStyle={{ background: 'var(--panel)' }}
          >
            Cerrar
          </Hoverable>
        </div>
      </div>
    </div>
  );
}
