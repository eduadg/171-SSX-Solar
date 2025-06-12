import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Wrench, 
  Shield, 
  LogIn, 
  LogOut,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const mockUsers = [
  {
    uid: 'client-123',
    email: 'cliente@ssxsolar.com',
    role: 'client',
    name: 'Cliente Teste',
    phone: '(11) 99999-9999',
    icon: User,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    description: 'Solicitar instalações e acompanhar serviços'
  },
  {
    uid: 'installer-123',
    email: 'instalador@ssxsolar.com', 
    role: 'installer',
    name: 'Instalador Teste',
    phone: '(11) 88888-8888',
    icon: Wrench,
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    description: 'Executar instalações e documentar serviços'
  },
  {
    uid: 'admin-123',
    email: 'admin@ssxsolar.com',
    role: 'admin', 
    name: 'Administrador Teste',
    phone: '(11) 77777-7777',
    icon: Shield,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    description: 'Gerenciar usuários e supervisionar operações'
  }
];

export default function TestUsers() {
  const { currentUser, login, logout, mockMode } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      setMessage('');
      await login(email, '123456');
      setMessage(`✅ Login realizado como ${email}`);
    } catch (error) {
      setMessage(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      setMessage('');
      await logout();
      setMessage('✅ Logout realizado com sucesso');
    } catch (error) {
      setMessage(`❌ Erro no logout: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!mockMode) {
    return (
      <div className="card p-6">
        <div className="flex items-center text-orange-600 dark:text-orange-400">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>Componente de teste disponível apenas em modo desenvolvimento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            🔧 Usuários de Teste (Modo Desenvolvimento)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Use estes usuários para testar o sistema de solicitações
          </p>
        </div>
        {currentUser && (
          <button
            onClick={handleLogout}
            disabled={loading}
            className="btn-secondary flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        )}
      </div>

      {/* Status atual */}
      {currentUser && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Logado como: {currentUser.name}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Role: {currentUser.role} | Email: {currentUser.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de feedback */}
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
        </div>
      )}

      {/* Lista de usuários de teste */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockUsers.map((user) => {
          const IconComponent = user.icon;
          const isCurrentUser = currentUser?.uid === user.uid;
          
          return (
            <div 
              key={user.uid} 
              className={`border-2 rounded-lg p-4 transition-all ${
                isCurrentUser 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isCurrentUser ? 'bg-primary-100 dark:bg-primary-800' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <IconComponent className={`w-5 h-5 ${
                    isCurrentUser ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.color}`}>
                    {user.role}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {user.description}
              </p>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 space-y-1">
                <p>📧 {user.email}</p>
                <p>📱 {user.phone}</p>
                <p>🔑 Senha: 123456</p>
              </div>
              
              {!isCurrentUser ? (
                <button
                  onClick={() => handleLogin(user.email)}
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  <span>Fazer Login</span>
                </button>
              ) : (
                <div className="w-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 py-2 px-3 rounded text-sm text-center font-medium">
                  ✅ Usuário Ativo
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Instruções */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          💡 Como testar o sistema de solicitações:
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>1. Faça login como <strong>Cliente</strong> para criar solicitações</li>
          <li>2. Faça login como <strong>Instalador</strong> para ver serviços atribuídos</li>
          <li>3. Faça login como <strong>Admin</strong> para gerenciar tudo</li>
          <li>4. Todos os dados são mockados e persistem durante a sessão</li>
        </ul>
      </div>
    </div>
  );
} 