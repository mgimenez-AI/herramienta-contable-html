import { Hoverable } from '../Hoverable';
import { LoopIcon, ClockIcon } from '../icons';

function TaskCard({ t, onClick, onDragStart, onDragEnd }) {
  return (
    <Hoverable
      as="div"
      draggable="true"
      onDragStart={() => onDragStart(t.id)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-card)',
        borderLeft: `3px solid ${t.prioColor}`,
        borderRadius: 9,
        padding: '12px 13px',
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(20,30,40,.04)',
      }}
      hoverStyle={{ boxShadow: '0 4px 14px rgba(20,30,40,.10)', borderColor: 'var(--border)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.3,
            textTransform: 'uppercase',
            color: t.prioColor,
            background: t.prioBg,
            borderRadius: 5,
            padding: '2px 7px',
          }}
        >
          {t.prioLabel}
        </span>
        {t.recurrente && (
          <span
            title="Tarea recurrente mensual"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 9.5,
              fontWeight: 600,
              color: 'var(--tint-info-fg)',
              background: 'var(--tint-info-bg)',
              borderRadius: 5,
              padding: '2px 6px',
            }}
          >
            <LoopIcon size={10} strokeWidth={2.4} />
            Mensual
          </span>
        )}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3, color: 'var(--text)', marginBottom: 9 }}>{t.title}</div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 11,
          background: 'var(--panel)',
          borderRadius: 6,
          padding: '3px 8px',
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: 2, background: t.proyColor }} />
        <span style={{ fontSize: 11, color: 'var(--text-soft)', fontWeight: 500 }}>{t.proyNombre}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
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
          <span style={{ fontSize: 11.5, color: 'var(--text-soft)', fontWeight: 500 }}>{t.respPrimer}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: t.dueBg, borderRadius: 6, padding: '3px 8px' }}>
          <ClockIcon size={11} strokeWidth={2.4} color={t.dueColor} />
          <span style={{ fontSize: 11, fontWeight: 600, color: t.dueColor, fontFamily: "'IBM Plex Mono',monospace" }}>{t.dueText}</span>
        </div>
      </div>
    </Hoverable>
  );
}

export function TableroView({ logic }) {
  const { kpis, columns, onDragStartTask, onDragEndTask, onDragOverColumn, onDragEnterColumn, onDropColumn, openDetail } = logic;

  return (
    <div>
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: 'var(--surface)', border: '1px solid var(--border-card)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--text-soft)', fontWeight: 600 }}>{k.label}</span>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: k.color }} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1, marginTop: 8, fontFamily: "'IBM Plex Mono',monospace", color: k.color }}>
              {k.value}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-mute)', marginTop: 2 }}>{k.hint}</div>
          </div>
        ))}
      </div>

      <div className="board-columns" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 8 }}>
        {columns.map((col) => (
          <div key={col.key} style={{ flex: 1, minWidth: 288, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 4px 12px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
              <span style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: -0.2, whiteSpace: 'nowrap' }}>{col.label}</span>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: 'var(--text-mute)',
                  background: 'var(--track)',
                  borderRadius: 20,
                  padding: '1px 8px',
                  fontFamily: "'IBM Plex Mono',monospace",
                }}
              >
                {col.count}
              </span>
            </div>
            <div
              onDragOver={onDragOverColumn}
              onDrop={(e) => onDropColumn(col.key, e)}
              onDragEnter={(e) => {
                e.preventDefault();
                onDragEnterColumn(col.key);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                minHeight: 120,
                borderRadius: 11,
                padding: 6,
                transition: 'background .12s',
                background: col.isOver ? 'var(--tint-blue-bg)' : 'var(--panel)',
                outline: col.isOver ? '2px dashed var(--tint-blue-fg)' : 'none',
                outlineOffset: -2,
              }}
            >
              {col.tasks.map((t) => (
                <TaskCard key={t.id} t={t} onClick={() => openDetail(t.id)} onDragStart={onDragStartTask} onDragEnd={onDragEndTask} />
              ))}
              {col.empty && (
                <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-mute)', fontSize: 12, border: '1.5px dashed var(--border)', borderRadius: 9 }}>
                  Sin tareas
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
