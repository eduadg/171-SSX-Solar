import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getClientServiceRequests } from '../../services/serviceRequests';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MapPin,
  Calendar,
  User,
  Package,
  Filter,
  Search,
  Loader2,
  Eye,
  ExternalLink,
  ArrowLeft,
  Zap,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Componente para exibir o status da solicitação
const StatusBadge = ({ status }) => {
  let colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  let label = 'Desconhecido';
  let icon = null;
  
  switch (status) {
    case 'pending':
      colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      label = 'Pendente';
      icon = <Clock className="w-3 h-3" />;
      break;
    case 'approved':
      colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      label = 'Aprovado';
      icon = <CheckCircle className="w-3 h-3" />;
      break;
    case 'assigned':
      colorClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      label = 'Atribuído';
      icon = <User className="w-3 h-3" />;
      break;
    case 'in_progress':
      colorClass = 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      label = 'Em Andamento';
      icon = <Zap className="w-3 h-3" />;
      break;
    case 'completed':
      colorClass = 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      label = 'Concluído';
      icon = <CheckCircle className="w-3 h-3" />;
      break;
    case 'confirmed':
      colorClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      label = 'Confirmado';
      icon = <CheckCircle className="w-3 h-3" />;
      break;
    case 'cancelled':
      colorClass = 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      label = 'Cancelado';
      icon = <AlertCircle className="w-3 h-3" />;
      break;
    default:
      break;
  }
  
  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {icon}
      <span>{label}</span>
    </span>
  );
};

// Componente para exibir prioridade
const PriorityBadge = ({ priority }) => {
  let colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  let label = 'Normal';
  
  switch (priority) {
    case 'low':
      colorClass = 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      label = 'Baixa';
      break;
    case 'normal':
      colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      label = 'Normal';
      break;
    case 'high':
      colorClass = 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      label = 'Alta';
      break;
    case 'urgent':
      colorClass = 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      label = 'Urgente';
      break;
    default:
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
};

// Componente para exibir tipo de equipamento
const EquipmentIcon = ({ equipmentType }) => {
  const IconComponent = equipmentType === 'solar_heater' ? Zap : Flame;
  const color = equipmentType === 'solar_heater' 
    ? 'text-yellow-600 dark:text-yellow-400' 
    : 'text-orange-600 dark:text-orange-400';
  
  return <IconComponent className={`w-5 h-5 ${color}`} />;
};

export default function ServiceHistory() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    async function fetchServiceRequests() {
      try {
        if (!currentUser?.uid) {
          setError('Usuário não encontrado');
          return;
        }

        setLoading(true);
        setError('');
        
        console.log('🔄 [SERVICE HISTORY] Buscando solicitações para:', currentUser.uid);
        const requests = await getClientServiceRequests(currentUser.uid);
        console.log('✅ [SERVICE HISTORY] Solicitações recebidas:', requests);
        
        // Garantir que requests seja sempre um array
        if (Array.isArray(requests)) {
          setServiceRequests(requests);
          console.log(`✅ [SERVICE HISTORY] ${requests.length} solicitações definidas`);
        } else {
          console.warn('⚠️ [SERVICE HISTORY] Requests não é um array:', requests);
          setServiceRequests([]);
        }
        
      } catch (error) {
        console.error('❌ [SERVICE HISTORY] Erro ao buscar solicitações:', error);
        setError(`Erro ao carregar histórico: ${error.message}`);
        setServiceRequests([]);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchServiceRequests();
    }
  }, [currentUser]);

  // Filtrar e ordenar solicitações
  useEffect(() => {
    console.log('🔄 [SERVICE HISTORY] Filtrando solicitações...');
    console.log('📋 [SERVICE HISTORY] serviceRequests:', serviceRequests);
    console.log('📋 [SERVICE HISTORY] Tipo de serviceRequests:', typeof serviceRequests);
    console.log('📋 [SERVICE HISTORY] É array?', Array.isArray(serviceRequests));
    
    // Garantir que serviceRequests seja sempre um array
    if (!Array.isArray(serviceRequests)) {
      console.warn('⚠️ [SERVICE HISTORY] serviceRequests não é um array:', serviceRequests);
      setFilteredRequests([]);
      return;
    }

    let filtered = [...serviceRequests];
    console.log('📋 [SERVICE HISTORY] Solicitações antes dos filtros:', filtered.length);

    // Filtro por texto
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.address?.street?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('📋 [SERVICE HISTORY] Após filtro de texto:', filtered.length);
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
      console.log('📋 [SERVICE HISTORY] Após filtro de status:', filtered.length);
    }

    // Ordenação
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
        break;
      case 'status':
        filtered.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
        break;
      case 'priority': {
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        filtered.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));
        break;
      }
      default:
        break;
    }

    console.log('📋 [SERVICE HISTORY] Solicitações filtradas finais:', filtered);
    console.log('📊 [SERVICE HISTORY] Total de solicitações filtradas:', filtered.length);
    setFilteredRequests(filtered);
  }, [serviceRequests, searchTerm, statusFilter, sortBy]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Data não disponível';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address) => {
    if (!address) return 'Endereço não disponível';
    return `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ''} - ${address.neighborhood}, ${address.city}/${address.state}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando histórico de serviços...</p>
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
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 btn-primary"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <Link 
              to="/dashboard" 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Histórico de Serviços
            </h1>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Acompanhe todas as suas solicitações de instalação
          </p>
        </div>
        <Link 
          to="/request-service"
          className="btn-primary flex items-center space-x-2"
        >
          <Package className="w-5 h-5" />
          <span>Nova Solicitação</span>
        </Link>
      </div>

      {/* Filtros e busca */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por endereço, notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Filtro por status */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input pl-10 appearance-none"
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="assigned">Atribuído</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluído</option>
              <option value="confirmed">Confirmado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          {/* Ordenação */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input"
          >
            <option value="date">Ordenar por Data</option>
            <option value="status">Ordenar por Status</option>
            <option value="priority">Ordenar por Prioridade</option>
          </select>

          {/* Estatísticas */}
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredRequests.length} de {serviceRequests.length} solicitações
            </p>
          </div>
        </div>
      </div>

      {/* Lista de solicitações */}
      {(() => {
        console.log('🎨 [SERVICE HISTORY] Renderizando lista de solicitações...');
        console.log('📋 [SERVICE HISTORY] filteredRequests:', filteredRequests);
        console.log('📊 [SERVICE HISTORY] filteredRequests.length:', filteredRequests.length);
        console.log('📋 [SERVICE HISTORY] serviceRequests:', serviceRequests);
        console.log('📊 [SERVICE HISTORY] serviceRequests.length:', serviceRequests.length);
        
        return filteredRequests.length === 0 ? (
          <div className="card p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {serviceRequests.length === 0 ? 'Nenhuma solicitação encontrada' : 'Nenhum resultado para os filtros aplicados'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {serviceRequests.length === 0 
                ? 'Você ainda não fez nenhuma solicitação de serviço. Que tal começar agora?'
                : 'Tente ajustar os filtros ou termo de busca para encontrar o que procura.'
              }
            </p>
            {serviceRequests.length === 0 && (
              <Link to="/request-service" className="btn-primary">
                Fazer Primeira Solicitação
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <EquipmentIcon equipmentType={request.equipmentType} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {request.equipmentType === 'solar_heater' ? 'Aquecedor Solar' : 'Aquecedor a Gás'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Solicitação #{request.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PriorityBadge priority={request.priority} />
                    <StatusBadge status={request.status} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Endereço</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatAddress(request.address)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Data de Criação</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {request.notes && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Observações</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded p-3">
                      {request.notes}
                    </p>
                  </div>
                )}

                {request.installerName && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Instalador: {request.installerName}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Última atualização: {formatDate(request.updatedAt)}
                  </div>
                  <Link 
                    to={`/service-details/${request.id}`}
                    className="btn-secondary text-sm flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver Detalhes</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
} 