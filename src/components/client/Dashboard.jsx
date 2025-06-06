import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getClientServiceRequests } from '../../services/serviceRequests';
import { 
  Plus, 
  History, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Zap,
  TrendingUp,
  Calendar,
  Loader2
} from 'lucide-react';

// Componente para exibir o status da solicitação com a cor adequada
const StatusBadge = ({ status }) => {
  let colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  let label = 'Desconhecido';
  
  switch (status) {
    case 'pending':
      colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      label = 'Pendente';
      break;
    case 'approved':
      colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      label = 'Aprovado';
      break;
    case 'assigned':
      colorClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      label = 'Atribuído';
      break;
    case 'in_progress':
      colorClass = 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      label = 'Em Andamento';
      break;
    case 'completed':
      colorClass = 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      label = 'Concluído';
      break;
    case 'confirmed':
      colorClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      label = 'Confirmado';
      break;
    case 'cancelled':
      colorClass = 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      label = 'Cancelado';
      break;
    default:
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
};

export default function ClientDashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchServiceRequests() {
      try {
        setLoading(true);
        const requests = await getClientServiceRequests(currentUser.uid);
        setServiceRequests(requests);
      } catch (error) {
        console.error('Error fetching service requests:', error);
        setError('Erro ao carregar solicitações de serviço.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchServiceRequests();
  }, [currentUser]);
  
  // Filtra as solicitações recentes (últimas 5)
  const recentRequests = serviceRequests.slice(0, 5);
  
  // Conta solicitações por status
  const pendingCount = serviceRequests.filter(req => req.status === 'pending' || req.status === 'approved').length;
  const inProgressCount = serviceRequests.filter(req => req.status === 'assigned' || req.status === 'in_progress').length;
  const completedCount = serviceRequests.filter(req => req.status === 'completed').length;
  const needsConfirmationCount = serviceRequests.filter(req => req.status === 'completed').length;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="flex items-center text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard do Cliente
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Bem-vindo(a) ao seu painel de controle. Gerencie suas solicitações de instalação solar.
        </p>
      </div>
      
      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendentes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Aguardando processamento</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Em Andamento</p>
              <p className="text-3xl font-bold text-primary-600">{inProgressCount}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Sendo executados</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Concluídos</p>
              <p className="text-3xl font-bold text-green-600">{completedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Instalações finalizadas</span>
          </div>
        </div>

        <div className={`card p-6 ${needsConfirmationCount > 0 ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aguardando Confirmação</p>
              <p className={`text-3xl font-bold ${needsConfirmationCount > 0 ? 'text-orange-600' : 'text-gray-900 dark:text-white'}`}>
                {needsConfirmationCount}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${needsConfirmationCount > 0 ? 'bg-orange-100 dark:bg-orange-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <AlertCircle className={`w-6 h-6 ${needsConfirmationCount > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span>Requer sua confirmação</span>
          </div>
        </div>
      </div>
      
      {/* Ações rápidas e dicas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/request-service"
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Solicitar Serviço</span>
            </Link>
            <Link 
              to="/service-history"
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <History className="w-5 h-5" />
              <span>Histórico</span>
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Dicas Rápidas
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Para solicitar um novo serviço, clique em "Solicitar Serviço".
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Após a conclusão de um serviço, é necessário confirmar a instalação.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Acompanhe o status de todas as suas solicitações no "Histórico de Serviços".
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Solicitações recentes */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Solicitações Recentes
          </h3>
          <Link 
            to="/service-history"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
          >
            Ver todas →
          </Link>
        </div>
        
        {recentRequests.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma solicitação ainda
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Faça sua primeira solicitação de instalação solar!
            </p>
            <Link 
              to="/request-service"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Solicitar Primeiro Serviço</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {request.serviceType || 'Instalação Solar'}
                  </h4>
                  <StatusBadge status={request.status} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Data:</span> {new Date(request.createdAt?.toDate()).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Endereço:</span> {request.address?.street}, {request.address?.city}
                  </div>
                </div>
                {request.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {request.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ID: {request.id}
                  </div>
                  <Link
                    to={`/service-details/${request.id}`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                  >
                    Ver detalhes →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 