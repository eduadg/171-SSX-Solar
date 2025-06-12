import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Settings, 
  User, 
  Wrench, 
  Shield, 
  ChevronDown,
  Rocket,
  Home,
  LogOut,
  Eye,
  RefreshCw
} from 'lucide-react';

// 🔧 DETECÇÃO DE MODO DESENVOLVIMENTO
const isDevelopmentMode = () => {
  const isDevMode = import.meta.env.MODE === 'development';
  const hasValidApiKey = import.meta.env.VITE_FIREBASE_API_KEY && 
                         import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY';
  
  // Em desenvolvimento OU se Firebase não estiver configurado
  return isDevMode || !hasValidApiKey;
};

// Dados mockados para desenvolvimento rápido
const mockUsers = {
  client: {
    email: 'cliente@ssxsolar.com',
    password: '123456',
    role: 'client',
    name: 'Cliente',
    description: 'Ver solicitações e serviços',
    color: 'from-blue-500 to-blue-600',
    dashboard: '/dashboard'
  },
  installer: {
    email: 'instalador@ssxsolar.com',
    password: '123456',
    role: 'installer',
    name: 'Instalador',
    description: 'Gerenciar instalações',
    color: 'from-green-500 to-green-600',
    dashboard: '/dashboard'
  },
  admin: {
    email: 'admin@ssxsolar.com',
    password: '123456',
    role: 'admin',
    name: 'Administrador',
    description: 'Administrar sistema',
    color: 'from-purple-500 to-purple-600',
    dashboard: '/dashboard'
  }
};

const userIcons = {
  client: User,
  installer: Wrench,
  admin: Shield
};

export default function DevButton() {
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Só mostrar em modo desenvolvimento
  if (!isDevelopmentMode()) {
    return null;
  }

  console.log('🔧 [DEV BUTTON] Renderizado na página:', location.pathname);
  console.log('🔧 [DEV BUTTON] Usuário atual:', currentUser?.email || 'Nenhum');

  // Função para login rápido
  async function handleQuickLogin(userType) {
    const user = mockUsers[userType];
    
    try {
      setLoading(true);
      console.log(`🚀 [DEV] Mudando para ${user.name}...`);
      
      // Fazer logout se necessário
      if (currentUser) {
        await logout();
      }
      
      // Fazer login com novo usuário
      await login(user.email, user.password);
      
      console.log(`✅ [DEV] Login realizado como ${user.name}`);
      
      // Navegar para dashboard
      navigate(user.dashboard);
      setShowDevPanel(false);
      
    } catch (error) {
      console.error('Erro no login rápido:', error);
    } finally {
      setLoading(false);
    }
  }

  // Função para logout rápido
  async function handleQuickLogout() {
    try {
      setLoading(true);
      console.log('🚪 [DEV] Fazendo logout...');
      await logout();
      navigate('/login');
      setShowDevPanel(false);
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setLoading(false);
    }
  }

  // Função para navegar para home
  function handleGoHome() {
    navigate('/dashboard');
    setShowDevPanel(false);
  }

  // Função para recarregar página
  function handleRefreshPage() {
    window.location.reload();
    setShowDevPanel(false);
  }

  return (
    <div className="fixed top-4 left-4 z-[9999]">
      <div className="relative">
        {/* Botão DEV */}
        <button
          onClick={() => {
            console.log('🔧 [DEV] Botão DEV clicado!');
            setShowDevPanel(!showDevPanel);
          }}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-lg font-bold transition-all duration-200 shadow-lg
            ${showDevPanel 
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
              : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-red-500'
            }
            border-2 border-orange-300 hover:border-orange-200 backdrop-blur-sm
            transform hover:scale-105 hover:shadow-xl
          `}
          style={{
            fontSize: '12px',
            minWidth: '80px'
          }}
        >
          <Settings className={`w-4 h-4 ${showDevPanel ? 'animate-spin' : ''}`} />
          <span>DEV</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${showDevPanel ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Painel DEV */}
        {showDevPanel && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-top-5 duration-200 z-50">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3">
              <div className="flex items-center space-x-2 text-white">
                <Rocket className="w-5 h-5" />
                <h3 className="font-bold text-sm">🔧 DEV TOOLS</h3>
              </div>
              <p className="text-orange-100 text-xs mt-1">
                Página: <code className="bg-orange-600/30 px-1 rounded">{location.pathname}</code>
              </p>
            </div>
            
            {/* Info do usuário atual */}
            {currentUser && (
              <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-800 dark:text-blue-200">
                      Logado como: {currentUser.email}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      Role: {currentUser.role || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Ações rápidas */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">AÇÕES RÁPIDAS</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleGoHome}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
                
                <button
                  onClick={handleRefreshPage}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reload</span>
                </button>
                
                {currentUser && (
                  <button
                    onClick={handleQuickLogout}
                    disabled={loading}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors text-sm col-span-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                    {loading && <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin"></div>}
                  </button>
                )}
              </div>
            </div>
            
            {/* Troca rápida de usuário */}
            <div className="px-4 py-3">
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-3">TROCAR USUÁRIO</p>
              <div className="space-y-2">
                {Object.entries(mockUsers).map(([userType, userData]) => {
                  const IconComponent = userIcons[userType];
                  const isCurrentUser = currentUser?.email === userData.email;
                  
                  return (
                    <button
                      key={userType}
                      onClick={() => !isCurrentUser && handleQuickLogin(userType)}
                      disabled={loading || isCurrentUser}
                      className={`
                        w-full p-3 rounded-lg text-left transition-all duration-200 border-2
                        ${isCurrentUser 
                          ? 'border-green-300 bg-green-50 dark:bg-green-900/20 cursor-default' 
                          : loading 
                            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
                            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:scale-105 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${userData.color} flex items-center justify-center shadow-lg relative`}>
                          <IconComponent className="w-5 h-5 text-white" />
                          {isCurrentUser && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <Eye className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className={`font-bold text-sm ${isCurrentUser ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}>
                              {userData.name}
                              {isCurrentUser && ' ✓'}
                            </h4>
                            <span className={`
                              px-2 py-0.5 text-xs font-bold rounded-full
                              ${userType === 'client' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                              ${userType === 'installer' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : ''}
                              ${userType === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : ''}
                            `}>
                              {userData.role.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {userData.description}
                          </p>
                        </div>
                        
                        {/* Loading indicator */}
                        {loading && !isCurrentUser && (
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <p className="text-xs font-bold">
                  🔑 Senha: <code className="font-mono bg-amber-100 dark:bg-amber-900/30 px-1 rounded text-amber-800 dark:text-amber-200">123456</code>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 