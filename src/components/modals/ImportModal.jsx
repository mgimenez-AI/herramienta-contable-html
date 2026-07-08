import { Hoverable } from '../Hoverable';
import { ImportIcon, FileIcon, CheckIcon } from '../icons';

export function ImportModal({ logic }) {
  const { importOpen, closeImport, downloadTemplate, onImportFile, importPreview, importSummary, importErr, doImport, importCanCommit } = logic;
  if (!importOpen) return null;

  const preview = importPreview || [];
  const hasSummary = !!importSummary;

  return (
    <div
      onClick={closeImport}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(28,34,32,.42)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 65,
        animation: 'fadeIn .15s ease',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 640,
          maxWidth: '96vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface)',
          borderRadius: 16,
          boxShadow: '0 24px 60px rgba(20,30,40,.28)',
          animation: 'modalIn .2s cubic-bezier(.2,.8,.3,1)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border-soft)' }}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>Importar tareas desde Excel</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-soft)', marginTop: 3 }}>
            Cargá muchas tareas de una vez — ideal para puntos de auditoría o listados externos.
          </div>
        </div>

        <div style={{ padding: '20px 24px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'var(--tint-blue-bg)',
                color: 'var(--tint-blue-fg)',
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontFamily: "'IBM Plex Mono',monospace",
              }}
            >
              1
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>Descargá la plantilla</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-soft)', lineHeight: 1.5, margin: '2px 0 9px' }}>
                Un Excel con las columnas correctas y dos filas de ejemplo. Completá una fila por tarea.
              </div>
              <Hoverable
                as="button"
                onClick={downloadTemplate}
                style={{
                  border: '1px solid var(--tint-blue-fg)',
                  background: 'var(--tint-blue-bg)',
                  color: 'var(--tint-blue-fg)',
                  borderRadius: 9,
                  padding: '9px 15px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                }}
                hoverStyle={{ background: '#DCE9F5' }}
              >
                <ImportIcon size={15} />
                Descargar plantilla .xlsx
              </Hoverable>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'var(--tint-blue-bg)',
                color: 'var(--tint-blue-fg)',
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontFamily: "'IBM Plex Mono',monospace",
              }}
            >
              2
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>Subí el archivo completado</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-soft)', lineHeight: 1.5, margin: '2px 0 9px' }}>
                Acepta .xlsx, .xls o .csv. Te mostramos una vista previa antes de confirmar.
              </div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 9,
                  border: '1.5px dashed var(--border)',
                  borderRadius: 11,
                  padding: 16,
                  cursor: 'pointer',
                  background: 'var(--surface-2)',
                  color: 'var(--text-soft)',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <FileIcon size={18} />
                Elegir archivo Excel / CSV
                <input type="file" accept=".xlsx,.xls,.csv" onChange={onImportFile} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {importErr && (
            <div style={{ padding: '11px 14px', background: 'var(--tint-danger-bg)', borderRadius: 9, color: 'var(--tint-danger-fg)', fontSize: 12.5, fontWeight: 500, lineHeight: 1.45 }}>
              {importErr}
            </div>
          )}

          {hasSummary && (
            <div style={{ border: '1px solid var(--border-card)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'flex', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-soft)' }}>
                <div style={{ flex: 1, padding: '11px 14px', textAlign: 'center', borderRight: '1px solid var(--border-soft)' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--tint-success-fg)' }}>{importSummary.ok}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>Listas</div>
                </div>
                <div style={{ flex: 1, padding: '11px 14px', textAlign: 'center', borderRight: '1px solid var(--border-soft)' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--tint-warn-fg)' }}>{importSummary.warn}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>Con aviso</div>
                </div>
                <div style={{ flex: 1, padding: '11px 14px', textAlign: 'center', borderRight: '1px solid var(--border-soft)' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--text-mute)' }}>{importSummary.skip}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>Sin título</div>
                </div>
                <div style={{ flex: 1, padding: '11px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--tint-blue-fg)' }}>{importSummary.newProj}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>Proy. nuevos</div>
                </div>
              </div>
              <div style={{ maxHeight: 220, overflow: 'auto' }}>
                {preview.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '10px 14px', borderBottom: '1px solid var(--border-soft)' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, marginTop: 5, background: r.dot }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>
                        {r.resp} · {r.proy} · {r.venc}
                      </div>
                      {r.hasWarn && <div style={{ fontSize: 10.5, color: '#9A7400', marginTop: 3, fontWeight: 500 }}>⚠ {r.warn}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '15px 24px', background: 'var(--surface-2)', borderTop: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'flex-end', gap: 9, flexShrink: 0 }}>
          <Hoverable
            as="button"
            onClick={closeImport}
            style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', borderRadius: 9, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            hoverStyle={{ background: 'var(--panel)' }}
          >
            Cancelar
          </Hoverable>
          {importCanCommit && (
            <Hoverable
              as="button"
              onClick={doImport}
              style={{
                border: 'none',
                background: '#00549E',
                color: '#fff',
                borderRadius: 9,
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
              }}
              hoverStyle={{ background: '#00478A' }}
            >
              <CheckIcon size={15} strokeWidth={2.4} />
              Importar {importSummary.ok} tareas
            </Hoverable>
          )}
        </div>
      </div>
    </div>
  );
}
