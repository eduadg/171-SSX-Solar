import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function DashboardRouter() {
  const { userRole, currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    // Verificar se o usuário está logado
    if (!currentUser) {
      console.log("Usuário não autenticado, redirecionando para login");
      navigate('/login');
      return;
    }

    // Redirecionar com base no papel do usuário
    console.log("Redirecionando para dashboard com role:", userRole);
    console.log("Dados do usuário:", currentUser);

    let path = '';
    
    switch(userRole) {
      case 'client':
        path = '/client/dashboard';
        break;
      case 'installer':
        path = '/installer/dashboard';
        break;
      case 'admin':
        path = '/admin/dashboard';
        break;
      default:
        // Se o papel do usuário não for reconhecido, redirecionar para página não autorizada
        console.error("Papel de usuário desconhecido:", userRole);
        setError(`Papel de usuário não reconhecido: ${userRole}`);
        path = '/unauthorized';
        break;
    }

    setRedirectPath(path);
    
    // Pequeno atraso para garantir que os logs apareçam antes do redirecionamento
    const timer = setTimeout(() => {
      navigate(path);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [userRole, currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {error ? (
          <div className="card p-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Erro de Autenticação
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-6">
              {error}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary w-full"
            >
              Voltar ao Login
            </button>
          </div>
        ) : (
          <div className="card p-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-primary-100 dark:bg-primary-900/20 rounded-full">
              <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Carregando seu dashboard...
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Redirecionando para: <span className="font-medium">{redirectPath}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Papel de usuário: <span className="font-medium">{userRole || 'Desconhecido'}</span>
            </p>
            
            {/* Loading progress bar */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 