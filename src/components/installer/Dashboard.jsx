import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getInstallerServiceRequests } from '../../services/serviceRequests';
import { 
  Wrench, 
  CheckCircle, 
  Truck, 
  Clock, 
  MapPin,
  Calendar,
  PlayCircle,
  PauseCircle,
  Loader2,
  AlertCircle,
  Package
} from 'lucide-react';

// Componente para exibir o status da solicitação com a cor adequada
const StatusBadge = ({ status }) => {
  let colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  let label = 'Desconhecido';
  
  switch (status) {
    case 'assigned':
      colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
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
    default:
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
};

export default function InstallerDashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchServiceRequests() {
      try {
        setLoading(true);
        const requests = await getInstallerServiceRequests(currentUser.uid);
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
  
  // Filtrar solicitações por status
  const assignedRequests = serviceRequests.filter(req => req.status === 'assigned');
  const inProgressRequests = serviceRequests.filter(req => req.status === 'in_progress');
  const completedRequests = serviceRequests.filter(req => req.status === 'completed' || req.status === 'confirmed');
  
  // Solicitações para hoje (que precisam ser atendidas)
  const todayRequests = [...assignedRequests, ...inProgressRequests];
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando seus serviços...</p>
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
          Dashboard do Instalador
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Bem-vindo(a) ao seu painel de controle. Gerencie suas instalações e serviços.
        </p>
      </div>
      
      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Atribuídos</p>
              <p className="text-3xl font-bold text-blue-600">{assignedRequests.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>Aguardando início</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Em Andamento</p>
              <p className="text-3xl font-bold text-orange-600">{inProgressRequests.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <PlayCircle className="w-4 h-4 mr-1" />
            <span>Sendo executados</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Concluídos</p>
              <p className="text-3xl font-bold text-green-600">{completedRequests.length}</p>
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
      </div>
      
      {/* Serviços de hoje */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary-600" />
            Serviços Para Hoje
          </h3>
          <Link 
            to="/my-services"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
          >
            Ver todos →
          </Link>
        </div>
        
        {todayRequests.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum serviço para hoje
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Você não possui serviços para realizar hoje. Que tal verificar as próximas instalações?
            </p>
            <Link 
              to="/my-services"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Ver Todos os Serviços</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {request.equipmentType === 'solar_heater' ? 'Aquecedor Solar' : 'Aquecedor a Gás'}
                  </h4>
                  <StatusBadge status={request.status} />
                </div>
                
                <div className="flex items-center mb-3 text-sm text-gray-600 dark:text-gray-400">
                  {request.status === 'assigned' ? (
                    <>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Aguardando início</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 mr-1" />
                      <span>Em progresso</span>
                    </>
                  )}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mb-3">
                  <div className="flex items-start space-x-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">Endereço:</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {request.address?.street}, {request.address?.number}
                        {request.address?.complement && ` - ${request.address?.complement}`}
                      </p>
                      <p className="text-gray-500 dark:text-gray-500">
                        {request.address?.neighborhood}, {request.address?.city} - {request.address?.state}
                      </p>
                    </div>
                  </div>
                </div>
                
                {request.notes && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Observações:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {request.notes.length > 100 ? `${request.notes.substring(0, 100)}...` : request.notes}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ID: {request.id.substring(0, 8)}...
                  </div>
                  <div className="flex space-x-2">
                    {request.status === 'assigned' ? (
                      <Link
                        to={`/start-service/${request.id}`}
                        className="btn-primary text-xs px-3 py-1.5 flex items-center space-x-1"
                      >
                        <PlayCircle className="w-3 h-3" />
                        <span>Iniciar</span>
                      </Link>
                    ) : (
                      <Link
                        to={`/complete-service/${request.id}`}
                        className="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Concluir</span>
                      </Link>
                    )}
                    <Link
                      to={`/service-details/${request.id}`}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs font-medium px-3 py-1.5 border border-primary-200 dark:border-primary-800 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
                    >
                      Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/my-services"
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Package className="w-5 h-5" />
              <span>Meus Serviços</span>
            </Link>
            <Link 
              to="/service-history"
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Histórico</span>
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Lembretes Importantes
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sempre fotografe antes, durante e depois da instalação.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Documente qualquer problema ou observação técnica.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Marque como concluído apenas após finalizar completamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 