import { Hoverable } from '../Hoverable';
import { PrinterIcon, LogoIcon } from '../icons';

export function ReporteView({ logic }) {
  const { kpis, recurrentesCards, extraordinariosCards, teamLoad, overdueList, reportDate, currentUser } = logic;
  const projectCards = [...recurrentesCards, ...extraordinariosCards];
  const hasOverdue = overdueList.length > 0;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div data-noprint="1" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <Hoverable
          as="button"
          onClick={() => window.print()}
          style={{
            border: 'none',
            background: '#00549E',
            color: '#fff',
            borderRadius: 9,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          hoverStyle={{ background: '#00478A' }}
        >
          <PrinterIcon size={16} />
          Imprimir / Guardar PDF
        </Hoverable>
      </div>

      <div id="reporte" style={{ background: 'var(--surface)', border: '1px solid var(--border-card)', borderRadius: 14, padding: '38px 44px' }}>
        <div className="report-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #00549E', paddingBottom: 18 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>Reporte de gestión del sector</div>
            <div style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 4 }}>Contabilidad e Impuestos · {reportDate}</div>
          </div>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#00549E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LogoIcon size={24} />
          </div>
        </div>

        <div className="report-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginTop: 26 }}>
          {kpis.map((k) => (
            <div key={k.label} style={{ border: '1px solid var(--border-card)', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 11.5, color: 'var(--text-soft)', fontWeight: 600 }}>{k.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: k.color, marginTop: 4, letterSpacing: -0.5 }}>
                {k.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 30, marginBottom: 14, color: 'var(--text)' }}>Avance por proyecto</div>
        {projectCards.map((p) => (
          <div className="report-project-row" key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--border-soft)' }}>
            <div style={{ width: 180, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{p.nombre}</div>
            <div style={{ flex: 1, height: 8, background: 'var(--track)', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 20, background: p.color, width: p.pctW }} />
            </div>
            <div style={{ width: 44, textAlign: 'right', fontSize: 12.5, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: p.color }}>{p.pct}%</div>
            <div style={{ width: 96, textAlign: 'right', fontSize: 11.5, color: 'var(--text-mute)', fontFamily: "'IBM Plex Mono',monospace" }}>
              {p.done}/{p.total} hechas
            </div>
          </div>
        ))}

        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 30, marginBottom: 14, color: 'var(--text)' }}>Estado del equipo</div>
        {teamLoad.map((p) => (
          <div className="report-team-row" key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '9px 0', borderBottom: '1px solid var(--border-soft)' }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 10,
                fontWeight: 600,
                background: p.color,
              }}
            >
              {p.iniciales}
            </div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{p.nombre}</div>
            <div style={{ width: 110, textAlign: 'right', fontSize: 12, fontFamily: "'IBM Plex Mono',monospace" }}>
              <span style={{ fontWeight: 700 }}>{p.activas}</span>
              <span style={{ color: 'var(--text-mute)' }}> activas</span>
            </div>
            <div style={{ width: 110, textAlign: 'right', fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", color: p.vencColor }}>
              <span style={{ fontWeight: 700 }}>{p.vencidas}</span>
              <span style={{ color: 'var(--text-mute)' }}> vencidas</span>
            </div>
            <div style={{ width: 100, textAlign: 'right', fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--tint-success-fg)' }}>
              <span style={{ fontWeight: 700 }}>{p.done}</span>
              <span style={{ color: 'var(--text-mute)' }}> hechas</span>
            </div>
          </div>
        ))}

        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 30, marginBottom: 12, color: 'var(--text)' }}>Vencimientos atrasados</div>
        {hasOverdue ? (
          <div>
            {overdueList.map((t) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-soft)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B23B2C', flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{t.respPrimer}</div>
                <div style={{ width: 90, textAlign: 'right', fontSize: 12, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--tint-danger-fg)' }}>
                  {t.vencFmt}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: 'var(--tint-success-fg)', fontWeight: 600, padding: '6px 0' }}>
            ✓ No hay vencimientos atrasados. El sector está al día.
          </div>
        )}

        <div style={{ marginTop: 34, paddingTop: 16, borderTop: '1px solid var(--border-soft)', fontSize: 11, color: 'var(--text-mute)' }}>
          Generado el {reportDate}
          {currentUser ? ` · ${currentUser.nombre}${currentUser.rol ? ', ' + currentUser.rol : ''}` : ''}
        </div>
      </div>
    </div>
  );
}
