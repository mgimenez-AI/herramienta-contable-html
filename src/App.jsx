import './styles/theme.css';
import { DataProvider } from './context/DataContext';
import { useAppLogic } from './hooks/useAppLogic';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TableroView } from './components/views/TableroView';
import { CalendarioView } from './components/views/CalendarioView';
import { CargaView } from './components/views/CargaView';
import { ProyectosView } from './components/views/ProyectosView';
import { ReporteView } from './components/views/ReporteView';
import { TaskDetailModal } from './components/modals/TaskDetailModal';
import { DayModal } from './components/modals/DayModal';
import { FormModal } from './components/modals/FormModal';
import { ImportModal } from './components/modals/ImportModal';
import { Toast } from './components/Toast';

function Centered({ children }) {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {children}
    </div>
  );
}

function Views(logic) {
  switch (logic.view) {
    case 'tablero':
      return <TableroView logic={logic} />;
    case 'calendario':
      return <CalendarioView logic={logic} />;
    case 'carga':
      return <CargaView logic={logic} />;
    case 'proyectos':
      return <ProyectosView logic={logic} />;
    case 'reporte':
      return <ReporteView logic={logic} />;
    default:
      return null;
  }
}

function MainApp() {
  const logic = useAppLogic();

  if (logic.loading) {
    return (
      <Centered>
        <p>Cargando datos…</p>
      </Centered>
    );
  }
  if (logic.error) {
    return (
      <Centered>
        <div style={{ textAlign: 'center', maxWidth: 420, color: '#B23B2C' }}>
          <p style={{ fontWeight: 700, marginBottom: 8 }}>No se pudieron cargar los datos</p>
          <p style={{ fontSize: 13 }}>{logic.error}</p>
        </div>
      </Centered>
    );
  }

  return (
    <div
      id="approot"
      data-theme={logic.theme}
      className="app-shell"
      style={{ display: 'flex', height: '100dvh', width: '100vw', overflow: 'hidden', background: 'var(--bg)', color: 'var(--text)' }}
    >
      <Sidebar
        view={logic.view}
        setView={logic.setView}
        team={logic.team}
        openNewPerson={logic.openNewPerson}
        openEditPerson={logic.openEditPerson}
        currentUser={logic.currentUser}
      />
      <main id="appmain" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header logic={logic} />
        <div className="app-content" style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
          {Views(logic)}
        </div>
      </main>

      <TaskDetailModal logic={logic} />
      <DayModal logic={logic} />
      <FormModal logic={logic} />
      <ImportModal logic={logic} />
      <Toast logic={logic} />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
}
