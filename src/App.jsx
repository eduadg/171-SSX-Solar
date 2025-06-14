import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Auth Components
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';
import RoleRoute from './components/auth/RoleRoute';

// Dev Components
import DevButton from './components/dev/DevButton';

// Dashboard Router
import DashboardRouter from './pages/Dashboard';

// Client Components
import ClientDashboard from './components/client/Dashboard';
import ServiceRequestForm from './components/client/ServiceRequestForm';
import ServiceHistory from './components/client/ServiceHistory';

// Installer Components
import InstallerDashboard from './components/installer/Dashboard';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';

// Shared Pages
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <AuthProvider>
        <Router>
          {/* Botão DEV Global - aparece em todas as páginas durante desenvolvimento */}
          <DevButton />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Dashboard router - redirecionamento inteligente */}
            <Route path="/dashboard" element={<DashboardRouter />} />
            
            {/* Private routes - require authentication */}
            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                {/* Client routes */}
                <Route element={<RoleRoute allowedRoles={['client']} />}>
                  <Route path="/client/dashboard" element={<ClientDashboard />} />
                  <Route path="/request-service" element={<ServiceRequestForm />} />
                  <Route path="/service-history" element={<ServiceHistory />} />
                  <Route path="/service-details/:id" element={<h1>Detalhes do Serviço</h1>} />
                  <Route path="/confirm-service/:id" element={<h1>Confirmar Serviço</h1>} />
                  <Route path="/profile" element={<h1>Perfil do Cliente</h1>} />
                </Route>

                {/* Installer routes */}
                <Route element={<RoleRoute allowedRoles={['installer']} />}>
                  <Route path="/installer/dashboard" element={<InstallerDashboard />} />
                  <Route path="/my-services" element={<h1>Meus Serviços</h1>} />
                  <Route path="/service-details/:id" element={<h1>Detalhes do Serviço</h1>} />
                  <Route path="/start-service/:id" element={<h1>Iniciar Serviço</h1>} />
                  <Route path="/complete-service/:id" element={<h1>Concluir Serviço</h1>} />
                  <Route path="/service-history" element={<h1>Histórico de Serviços</h1>} />
                  <Route path="/profile" element={<h1>Perfil do Instalador</h1>} />
                </Route>

                {/* Admin routes */}
                <Route element={<RoleRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/service-requests" element={<h1>Solicitações de Serviço</h1>} />
                  <Route path="/service-details/:id" element={<h1>Detalhes do Serviço</h1>} />
                  <Route path="/installers" element={<h1>Gerenciar Instaladores</h1>} />
                  <Route path="/add-installer" element={<h1>Adicionar Instalador</h1>} />
                  <Route path="/clients" element={<h1>Gerenciar Clientes</h1>} />
                  <Route path="/products" element={<h1>Gerenciar Produtos</h1>} />
                  <Route path="/add-product" element={<h1>Adicionar Produto</h1>} />
                  <Route path="/reports" element={<h1>Relatórios</h1>} />
                  <Route path="/profile" element={<h1>Perfil do Administrador</h1>} />
                </Route>
              </Route>
            </Route>

            {/* Special routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
