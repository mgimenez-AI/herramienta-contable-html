import { Hoverable } from '../Hoverable';
import { PALETTE, ESTADOS } from '../../data/constants';
import { inic } from '../../utils/helpers';

const INPUT_STYLE = { width: '100%', border: '1px solid var(--border)', borderRadius: 9, padding: '10px 12px', fontSize: 13.5 };
const LABEL_STYLE = { fontSize: 11.5, color: 'var(--text-soft)', fontWeight: 600, marginBottom: 6 };

function swatchStyle(c, selected) {
  return {
    width: 32,
    height: 32,
    borderRadius: 9,
    cursor: 'pointer',
    background: c,
    border: selected ? '3px solid var(--text)' : '2px solid var(--swatch-ring)',
    boxShadow: selected ? '0 0 0 2px var(--swatch-ring) inset' : '0 0 0 1px var(--border-card)',
  };
}

export function FormModal({ logic }) {
  const { formMode, editKind, draft, setDraftField, formError, formTitle, isEditing, closeForm, saveForm, deleteCurrent, team, projects } = logic;
  if (!formMode) return null;

  const d = draft;

  return (
    <div
      onClick={closeForm}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(28,34,32,.42)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        animation: 'fadeIn .15s ease',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
          maxWidth: '96vw',
          maxHeight: '92vh',
          overflow: 'auto',
          background: 'var(--surface)',
          borderRadius: 16,
          boxShadow: '0 24px 60px rgba(20,30,40,.28)',
          animation: 'modalIn .2s cubic-bezier(.2,.8,.3,1)',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-soft)', fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>{formTitle}</div>

        {editKind === 'task' && (
          <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={LABEL_STYLE}>Título de la tarea</div>
              <input
                value={d.title || ''}
                onChange={(e) => setDraftField('title', e.target.value)}
                placeholder="Ej: DDJJ IVA - Posición mensual"
                style={INPUT_STYLE}
              />
            </div>
            <div>
              <div style={LABEL_STYLE}>Descripción</div>
              <textarea
                value={d.desc || ''}
                onChange={(e) => setDraftField('desc', e.target.value)}
                placeholder="Detalle de la tarea…"
                style={{ ...INPUT_STYLE, minHeight: 70, resize: 'vertical', lineHeight: 1.5 }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <div style={LABEL_STYLE}>Responsable</div>
                <select value={d.resp || ''} onChange={(e) => setDraftField('resp', e.target.value)} style={{ ...INPUT_STYLE, background: 'var(--surface)', cursor: 'pointer' }}>
                  {team.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div style={LABEL_STYLE}>Proyecto</div>
                <select value={d.proy || ''} onChange={(e) => setDraftField('proy', e.target.value)} style={{ ...INPUT_STYLE, background: 'var(--surface)', cursor: 'pointer' }}>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div style={LABEL_STYLE}>Prioridad</div>
                <select value={d.prio || 'media'} onChange={(e) => setDraftField('prio', e.target.value)} style={{ ...INPUT_STYLE, background: 'var(--surface)', cursor: 'pointer' }}>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
              <div>
                <div style={LABEL_STYLE}>Estado</div>
                <select value={d.estado || 'pendiente'} onChange={(e) => setDraftField('estado', e.target.value)} style={{ ...INPUT_STYLE, background: 'var(--surface)', cursor: 'pointer' }}>
                  {ESTADOS.map((e) => (
                    <option key={e.key} value={e.key}>
                      {e.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div style={LABEL_STYLE}>Vencimiento</div>
                <input type="date" value={d.venc || ''} onChange={(e) => setDraftField('venc', e.target.value)} style={{ ...INPUT_STYLE, padding: '9px 12px' }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', alignSelf: 'flex-end', paddingBottom: 10 }}>
                <input
                  type="checkbox"
                  checked={!!d.recurrente}
                  onChange={(e) => setDraftField('recurrente', e.target.checked)}
                  style={{ width: 17, height: 17, cursor: 'pointer', accentColor: '#00549E' }}
                />
                <span style={{ fontSize: 12.5, color: 'var(--text)', fontWeight: 500 }}>Recurrente mensual</span>
              </label>
            </div>
          </div>
        )}

        {editKind === 'person' && (
          <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                  background: d.color || PALETTE[0],
                }}
              >
                {inic(d.nombre || '')}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-mute)' }}>Las iniciales se generan automáticamente del nombre.</div>
            </div>
            <div>
              <div style={LABEL_STYLE}>Nombre y apellido</div>
              <input value={d.nombre || ''} onChange={(e) => setDraftField('nombre', e.target.value)} placeholder="Ej: Juan Pérez" style={INPUT_STYLE} />
            </div>
            <div>
              <div style={LABEL_STYLE}>Rol / cargo</div>
              <input value={d.rol || ''} onChange={(e) => setDraftField('rol', e.target.value)} placeholder="Ej: Analista Contable" style={INPUT_STYLE} />
            </div>
            <div>
              <div style={{ ...LABEL_STYLE, marginBottom: 8 }}>Color</div>
              <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                {PALETTE.map((c) => (
                  <button key={c} onClick={() => setDraftField('color', c)} style={swatchStyle(c, d.color === c)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {editKind === 'project' && (
          <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={LABEL_STYLE}>Nombre del proyecto</div>
              <input value={d.nombre || ''} onChange={(e) => setDraftField('nombre', e.target.value)} placeholder="Ej: Auditoría externa Q3" style={INPUT_STYLE} />
            </div>
            <div>
              <div style={LABEL_STYLE}>Descripción</div>
              <input value={d.desc || ''} onChange={(e) => setDraftField('desc', e.target.value)} placeholder="Breve descripción" style={INPUT_STYLE} />
            </div>
            <div>
              <div style={{ ...LABEL_STYLE, marginBottom: 8 }}>Tipo de proyecto</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { key: 'recurrente', label: 'Recurrente', sub: 'Se repite cada período' },
                  { key: 'extraordinario', label: 'Extraordinario', sub: 'Puntual, con inicio y fin' },
                ].map((o) => {
                  const on = (d.tipo || 'recurrente') === o.key;
                  return (
                    <button
                      key={o.key}
                      onClick={() => setDraftField('tipo', o.key)}
                      style={{
                        flex: 1,
                        textAlign: 'left',
                        borderRadius: 9,
                        padding: '11px 13px',
                        cursor: 'pointer',
                        transition: 'all .12s',
                        border: on ? '1.5px solid var(--tint-blue-fg)' : '1.5px solid var(--border-card)',
                        background: on ? 'var(--tint-blue-bg)' : 'var(--surface)',
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: on ? 'var(--tint-blue-fg)' : 'var(--text)' }}>{o.label}</div>
                      <div style={{ fontSize: 11, marginTop: 2, color: on ? 'var(--tint-blue-fg)' : 'var(--text-mute)' }}>{o.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div style={{ ...LABEL_STYLE, marginBottom: 8 }}>Color</div>
              <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                {PALETTE.map((c) => (
                  <button key={c} onClick={() => setDraftField('color', c)} style={swatchStyle(c, d.color === c)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {formError && (
          <div style={{ margin: '0 24px', padding: '10px 14px', background: 'var(--tint-danger-bg)', borderRadius: 8, color: 'var(--tint-danger-fg)', fontSize: 12.5, fontWeight: 500 }}>
            {formError}
          </div>
        )}

        <div
          style={{
            padding: '16px 24px',
            background: 'var(--surface-2)',
            borderTop: '1px solid var(--border-soft)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 6,
          }}
        >
          <div>
            {isEditing && (
              <button
                onClick={deleteCurrent}
                style={{
                  border: '1px solid var(--tint-danger-bg)',
                  background: 'var(--surface)',
                  color: 'var(--tint-danger-fg)',
                  borderRadius: 9,
                  padding: '9px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Eliminar
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 9 }}>
            <Hoverable
              as="button"
              onClick={closeForm}
              style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', borderRadius: 9, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              hoverStyle={{ background: 'var(--panel)' }}
            >
              Cancelar
            </Hoverable>
            <Hoverable
              as="button"
              onClick={saveForm}
              style={{ border: 'none', background: '#00549E', color: '#fff', borderRadius: 9, padding: '10px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              hoverStyle={{ background: '#00478A' }}
            >
              Guardar
            </Hoverable>
          </div>
        </div>
      </div>
    </div>
  );
}
