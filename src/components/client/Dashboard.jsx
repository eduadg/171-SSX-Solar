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

  // Função helper para formatar endereço de forma segura
  const formatAddress = (address) => {
    try {
      // Se não há endereço
      if (!address) {
        return 'Endereço não informado';
      }
      
      // Se é uma string, retornar diretamente
      if (typeof address === 'string') {
        return address;
      }
      
      // Se não é um objeto, converter para string
      if (typeof address !== 'object') {
        return String(address);
      }
      
      // Destruturar com valores padrão
      const { 
        street = '', 
        number = '', 
        complement = '',
        neighborhood = '', 
        city = '', 
        state = '' 
      } = address;
      
      // Converter todos para strings seguras
      const parts = [
        String(street || '').trim(),
        String(number || '').trim()
      ].filter(Boolean);
      
      const location = [
        String(neighborhood || '').trim(),
        String(city || '').trim(),
        String(state || '').trim()
      ].filter(Boolean);
      
      if (parts.length === 0) {
        return 'Endereço não informado';
      }
      
      let result = parts.join(', ');
      if (String(complement || '').trim()) {
        result += ` - ${String(complement).trim()}`;
      }
      if (location.length > 0) {
        result += ` - ${location.join(', ')}`;
      }
      
      return result;
    } catch (error) {
      console.error('❌ [CLIENT DASHBOARD] Erro ao formatar endereço:', error, address);
      return 'Erro no endereço';
    }
  };
  
  // Debug básico
  if (import.meta.env.DEV) {
    console.log('🔍 [CLIENT DASHBOARD] Usuário:', currentUser?.email, 'Loading:', loading);
  }
  
  useEffect(() => {
    console.log('🔄 [CLIENT DASHBOARD] useEffect executado');
    console.log('🔄 [CLIENT DASHBOARD] Current user no useEffect:', currentUser);
    
    async function fetchServiceRequests() {
      try {
        // Verificação de segurança para currentUser
        if (!currentUser) {
          console.warn('⚠️ [CLIENT DASHBOARD] Current user é null/undefined');
          setError('Usuário não encontrado. Tente fazer login novamente.');
          setLoading(false);
          return;
        }
        
        if (!currentUser.uid) {
          console.warn('⚠️ [CLIENT DASHBOARD] Current user não tem UID');
          setError('ID do usuário não encontrado. Tente fazer login novamente.');
          setLoading(false);
          return;
        }
        
        console.log('🔍 [CLIENT DASHBOARD] Buscando solicitações para UID:', currentUser.uid);
        setLoading(true);
        setError(''); // Limpar erro anterior
        
        const requests = await getClientServiceRequests(currentUser.uid);
        console.log('✅ [CLIENT DASHBOARD] Solicitações recebidas:', requests);
        
        // Verificar estrutura dos dados para debug
        if (requests && requests.length > 0) {
          console.log('🔍 [CLIENT DASHBOARD] Primeira solicitação:', requests[0]);
          console.log('🔍 [CLIENT DASHBOARD] Estrutura do endereço:', requests[0]?.address);
        }
        
        setServiceRequests(requests || []); // Garantir que nunca seja null/undefined
        
      } catch (error) {
        console.error('❌ [CLIENT DASHBOARD] Erro ao buscar solicitações:', error);
        setError(`Erro ao carregar solicitações de serviço: ${error.message}`);
        setServiceRequests([]); // Garantir que seja um array vazio em caso de erro
      } finally {
        console.log('🏁 [CLIENT DASHBOARD] Finalizando carregamento...');
        setLoading(false);
      }
    }
    
    // Só executar se currentUser existir
    if (currentUser) {
      fetchServiceRequests();
    } else {
      console.warn('⚠️ [CLIENT DASHBOARD] CurrentUser não existe, não buscando solicitações');
      setLoading(false);
    }
  }, [currentUser]);
  
  // Verificações de segurança para evitar erros de renderização
  const safeServiceRequests = Array.isArray(serviceRequests) ? serviceRequests : [];
  
  // Filtra as solicitações recentes (últimas 5)
  const recentRequests = safeServiceRequests.slice(0, 5);
  
  // Conta solicitações por status - com verificação de segurança
  const pendingCount = safeServiceRequests.filter(req => req && (req.status === 'pending' || req.status === 'approved')).length;
  const inProgressCount = safeServiceRequests.filter(req => req && (req.status === 'assigned' || req.status === 'in_progress')).length;
  const completedCount = safeServiceRequests.filter(req => req && req.status === 'completed').length;
  const needsConfirmationCount = safeServiceRequests.filter(req => req && req.status === 'completed').length;
  
  console.log('📊 [CLIENT DASHBOARD] Estatísticas calculadas:', {
    total: safeServiceRequests.length,
    pending: pendingCount,
    inProgress: inProgressCount,
    completed: completedCount,
    needsConfirmation: needsConfirmationCount
  });
  
  // Estado de carregamento
  if (loading) {
    console.log('⏳ [CLIENT DASHBOARD] Mostrando estado de loading...');
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    console.log('❌ [CLIENT DASHBOARD] Mostrando estado de erro:', error);
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
          Recarregar Página
        </button>
      </div>
    );
  }
  
  // Verificação final de segurança
  if (!currentUser) {
    console.log('⚠️ [CLIENT DASHBOARD] CurrentUser é null na renderização final');
    return (
      <div className="card p-6">
        <div className="flex items-center text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>Sessão expirada. Por favor, faça login novamente.</p>
        </div>
        <Link to="/login" className="mt-4 btn-primary inline-block">
          Fazer Login
        </Link>
      </div>
    );
  }
  
  console.log('🎯 [CLIENT DASHBOARD] Renderizando dashboard completa...');
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard do Cliente
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Bem-vindo(a) ao seu painel de controle, {currentUser.name || currentUser.email}. Gerencie suas solicitações de instalação solar.
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
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma solicitação ainda
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Você ainda não fez nenhuma solicitação de serviço. Clique no botão abaixo para começar.
            </p>
            <Link to="/request-service" className="btn-primary">
              Fazer Primeira Solicitação
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentRequests.map((request) => {
              // Verificação de segurança
              if (!request || !request.id) {
                console.warn('⚠️ [CLIENT DASHBOARD] Solicitação inválida:', request);
                return null;
              }
              
              return (
              <Link to={`/service-details/${request.id}`} key={request.id} className="block border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {String(request.notes || request.description || 
                         (request.equipmentType === 'solar_heater' ? 'Aquecedor Solar' : 'Aquecedor a Gás'))
                        }
                      </h4>
                      <StatusBadge status={request.status || 'pending'} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {formatAddress(request.address)}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        Criado: {request.createdAt?.seconds 
                          ? new Date(request.createdAt.seconds * 1000).toLocaleDateString('pt-BR')
                          : 'Data não disponível'
                        }
                      </span>
                      {request.installerId && (
                        <span>
                          Instalador: {String(request.installerName || request.installerId)}
                        </span>
                      )}
                    </div>
                  </div>
                   <span className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                    Ver detalhes
                  </span>
                </div>
              </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 