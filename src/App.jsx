import './styles/theme.css';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { DataProvider } from './context/DataContext';
import { isSharePointConfigured } from './auth/msalConfig';
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

function SignInGate() {
  const auth = useAuth();
  if (auth.initializing) {
    return (
      <Centered>
        <p>Conectando con Microsoft…</p>
      </Centered>
    );
  }
  return (
    <Centered>
      <div style={{ textAlign: 'center', maxWidth: 380 }}>
        <h1 style={{ fontSize: 20, marginBottom: 8 }}>Contabilidad &amp; Impuestos</h1>
        <p style={{ color: '#5C625F', fontSize: 13.5, lineHeight: 1.6, marginBottom: 20 }}>
          Iniciá sesión con tu cuenta de Microsoft 365 para acceder a las tareas, proyectos y equipo compartidos por
          SharePoint.
        </p>
        {auth.error && <p style={{ color: '#B23B2C', fontSize: 12.5, marginBottom: 12 }}>{auth.error}</p>}
        <button
          onClick={auth.login}
          style={{ border: 'none', background: '#00549E', color: '#fff', borderRadius: 9, padding: '10px 22px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}
        >
          Iniciar sesión con Microsoft
        </button>
      </div>
    </Centered>
  );
}

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
      style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg)', color: 'var(--text)' }}
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
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>{Views(logic)}</div>
      </main>

      <TaskDetailModal logic={logic} />
      <DayModal logic={logic} />
      <FormModal logic={logic} />
      <ImportModal logic={logic} />
      <Toast logic={logic} />
    </div>
  );
}

function Gated() {
  const auth = useAuth();
  const ready = isSharePointConfigured ? auth.isAuthenticated : true;
  if (!ready) return <SignInGate />;
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Gated />
    </AuthProvider>
  );
}
