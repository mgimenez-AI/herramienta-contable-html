import { Hoverable } from '../Hoverable';
import { LoopIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons';

const HEADER_BTN = {
  width: 32,
  height: 32,
  border: '1px solid var(--border)',
  borderRadius: 8,
  background: 'var(--surface)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export function CalendarioView({ logic }) {
  const { monthLabel, weeks, prevMonth, nextMonth, goToday, genRecurring, openDay, openDetail } = logic;

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-card)', borderRadius: 14, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-soft)',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>{monthLabel}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Hoverable
            as="button"
            onClick={genRecurring}
            title="Generar los vencimientos recurrentes de este mes"
            style={{
              border: '1px solid var(--tint-blue-fg)',
              borderRadius: 8,
              padding: '0 12px',
              height: 32,
              background: 'var(--tint-blue-bg)',
              color: 'var(--tint-blue-fg)',
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            hoverStyle={{ background: 'var(--panel)' }}
          >
            <LoopIcon size={14} strokeWidth={2.2} />
            Generar recurrentes
          </Hoverable>
          <Hoverable as="button" onClick={prevMonth} style={HEADER_BTN} hoverStyle={{ background: 'var(--panel)' }}>
            <ChevronLeftIcon size={15} />
          </Hoverable>
          <Hoverable
            as="button"
            onClick={goToday}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '0 12px',
              height: 32,
              background: 'var(--surface)',
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: 600,
              color: 'var(--text-soft)',
            }}
            hoverStyle={{ background: 'var(--panel)' }}
          >
            Hoy
          </Hoverable>
          <Hoverable as="button" onClick={nextMonth} style={HEADER_BTN} hoverStyle={{ background: 'var(--panel)' }}>
            <ChevronRightIcon size={15} />
          </Hoverable>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', background: 'var(--panel)', borderBottom: '1px solid var(--border-soft)' }}>
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
          <div key={d} style={{ padding: '9px 12px', fontSize: 11, fontWeight: 600, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {d}
          </div>
        ))}
      </div>

      {weeks.map((w, wi) => (
        <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
          {w.days.map((d) => (
            <Hoverable
              as="div"
              key={d.key}
              onClick={() => openDay(d.key)}
              style={{
                height: 112,
                overflow: 'hidden',
                padding: '6px 8px',
                borderRight: '1px solid var(--border-soft)',
                borderBottom: '1px solid var(--border-soft)',
                cursor: 'pointer',
                background: d.inMonth ? 'var(--surface)' : 'var(--surface-2)',
              }}
              hoverStyle={{ background: d.inMonth ? 'var(--surface-2)' : 'var(--panel)' }}
            >
              <div
                style={
                  d.isToday
                    ? {
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: '#00549E',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'IBM Plex Mono,monospace',
                      }
                    : {
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: d.inMonth ? 'var(--text)' : 'var(--text-mute)',
                        fontFamily: 'IBM Plex Mono,monospace',
                        padding: '3px 2px',
                      }
                }
              >
                {d.num}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                {d.tasks.map((ev) => (
                  <Hoverable
                    as="div"
                    key={ev.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetail(ev.id);
                    }}
                    title={ev.title}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, background: ev.prioBg, borderRadius: 5, padding: '2px 6px', cursor: 'pointer' }}
                    hoverStyle={{ filter: 'brightness(.97)' }}
                  >
                    <span style={{ width: 4, height: 12, borderRadius: 2, flexShrink: 0, background: ev.prioColor }} />
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: 'var(--text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {ev.title}
                    </span>
                  </Hoverable>
                ))}
                {d.hasMore && (
                  <div style={{ fontSize: 10, color: 'var(--tint-blue-fg)', fontWeight: 700, padding: '1px 6px' }}>+{d.moreCount} más</div>
                )}
              </div>
            </Hoverable>
          ))}
        </div>
      ))}
    </div>
  );
}
