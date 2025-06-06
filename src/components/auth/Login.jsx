import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  User, 
  Wrench, 
  Shield, 
  Sun, 
  Eye, 
  EyeOff,
  Zap
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

// Dados mockados para desenvolvimento rápido
const mockUsers = {
  client: {
    email: 'cliente@ssxsolar.com',
    password: '123456',
    role: 'client',
    name: 'Cliente',
    description: 'Solicitar instalações e acompanhar serviços'
  },
  installer: {
    email: 'instalador@ssxsolar.com',
    password: '123456',
    role: 'installer',
    name: 'Instalador',
    description: 'Executar instalações e documentar serviços'
  },
  admin: {
    email: 'admin@ssxsolar.com',
    password: '123456',
    role: 'admin',
    name: 'Administrador',
    description: 'Gerenciar usuários e supervisionar operações'
  }
};

const userIcons = {
  client: User,
  installer: Wrench,
  admin: Shield
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Falha ao fazer login. Verifique suas credenciais.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Função para login rápido com usuários mockados
  async function handleQuickLogin(userType) {
    const user = mockUsers[userType];
    
    try {
      setError('');
      setLoading(true);
      
      // Preencher os campos do formulário com os dados mockados
      setEmail(user.email);
      setPassword(user.password);
      
      // Simular login
      await login(user.email, user.password);
      
      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(`Falha ao fazer login rápido como ${userType}: ${error.message}`);
      console.error('Erro no login rápido:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-gradient">
      {/* Botão de tema no canto superior direito */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full shadow-lg">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            SSX Solar
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Sistema de Gerenciamento de Instalações
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário de login */}
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <Lock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Fazer Login
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Entre com suas credenciais
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </button>

              <div className="text-center">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </form>
          </div>
          
          {/* Acesso rápido para desenvolvimento */}
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Sun className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Acesso Rápido
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Para desenvolvimento e testes
              </p>
            </div>
            
            <div className="space-y-4">
              {Object.entries(mockUsers).map(([userType, userData]) => {
                const IconComponent = userIcons[userType];
                return (
                  <div key={userType} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {userData.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {userData.description}
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          <div>Email: {userData.email}</div>
                          <div>Senha: {userData.password}</div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleQuickLogin(userType)}
                      disabled={loading}
                      className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Entrar como {userData.name}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                ⚠️ Este acesso rápido é apenas para desenvolvimento e será removido em produção.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}