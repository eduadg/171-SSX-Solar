import { Link } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-6 rounded-full bg-gradient-to-r from-blue-100 to-orange-100 dark:from-blue-900/20 dark:to-orange-900/20">
            <Search className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4 animate-bounce-in">
            404
          </h1>
        </div>

        {/* Content */}
        <div className="card p-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Página Não Encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            A página que você está procurando não existe ou foi movida. Verifique a URL ou retorne ao dashboard.
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
              onClick={() => window.history.back()}
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar à Página Anterior</span>
            </button>
          </div>
        </div>

        {/* Fun animation */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            💡 Dica: Use a navegação lateral para encontrar o que procura
          </p>
        </div>
      </div>
    </div>
  );
} 