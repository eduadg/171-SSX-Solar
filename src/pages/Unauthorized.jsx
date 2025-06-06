import { Link } from 'react-router-dom';
import { ShieldX, Home, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Unauthorized() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-6 rounded-full bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20">
            <ShieldX className="w-16 h-16 text-red-500 dark:text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-bounce-in">
            403
          </h1>
        </div>

        {/* Content */}
        <div className="card p-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Acesso Negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Você não tem permissão para acessar esta página. Verifique se está logado com a conta correta ou entre em contato com o administrador.
          </p>
          
          <div className="space-y-4">
            <Link 
              to="/dashboard"
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Voltar ao Dashboard</span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Trocar de Conta</span>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🔒 Níveis de acesso: Cliente → Instalador → Administrador
          </p>
        </div>
      </div>
    </div>
  );
} 