export function CargaView({ logic }) {
  const { teamLoad } = logic;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {teamLoad.map((p) => (
        <div key={p.id} style={{ background: 'var(--surface)', border: '1px solid var(--border-card)', borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                background: p.color,
              }}
            >
              {p.iniciales}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: -0.2 }}>{p.nombre}</div>
              <div style={{ fontSize: 12, color: 'var(--text-mute)' }}>{p.rol}</div>
            </div>
            <div style={{ display: 'flex', gap: 26, textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: -0.5 }}>{p.activas}</div>
                <div style={{ fontSize: 10.5, color: 'var(--text-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Activas</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: -0.5, color: p.vencColor }}>
                  {p.vencidas}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--text-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Vencidas</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: -0.5, color: 'var(--tint-success-fg)' }}>
                  {p.done}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--text-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Hechas</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', height: 10, borderRadius: 20, overflow: 'hidden', marginTop: 18, background: 'var(--track)' }}>
            {p.segments.map((s, i) => (
              <div key={i} title={s.title} style={{ height: '100%', background: s.color, width: s.width }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 11, flexWrap: 'wrap' }}>
            {p.legend.map((l) => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: l.color }} />
                <span style={{ fontSize: 11.5, color: 'var(--text-soft)', fontWeight: 500 }}>{l.label}</span>
                <span style={{ fontSize: 11.5, color: 'var(--text)', fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace" }}>{l.n}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
