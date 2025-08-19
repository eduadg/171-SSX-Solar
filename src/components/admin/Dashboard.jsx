import { useState, useEffect } from 'react';
import KPIs from './KPIs';
import { Link } from 'react-router-dom';
import { getAllServiceRequests } from '../../services/serviceRequests';
import { getAllInstallers } from '../../services/users';
import { getAllProducts } from '../../services/products';
import { 
  UserPlus, 
  Plus, 
  Clock, 
  FileText, 
  Wrench, 
  CheckCircle, 
  X,
  Users,
  Package,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Loader2,
  AlertCircle,
  Calendar,
  MapPin
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

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [installers, setInstallers] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Carregar tudo em paralelo
        const [requestsData, installersData, productsData] = await Promise.all([
          getAllServiceRequests(),
          getAllInstallers(),
          getAllProducts()
        ]);
        
        setServiceRequests(requestsData);
        setInstallers(installersData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Erro ao carregar dados do dashboard.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Filtrar solicitações por status
  const pendingRequests = serviceRequests.filter(req => req.status === 'pending');
  const approvedRequests = serviceRequests.filter(req => req.status === 'approved');
  const assignedRequests = serviceRequests.filter(req => req.status === 'assigned');
  const inProgressRequests = serviceRequests.filter(req => req.status === 'in_progress');
  const completedRequests = serviceRequests.filter(req => req.status === 'completed');
  const confirmedRequests = serviceRequests.filter(req => req.status === 'confirmed');
  const cancelledRequests = serviceRequests.filter(req => req.status === 'cancelled');
  
  // Solicitações recentes (últimas 5)
  const recentRequests = [...serviceRequests]
    .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
    .slice(0, 5);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
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
          Dashboard do Administrador
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Visão geral da empresa SSX Solar. Gerencie solicitações, instaladores e produtos.
        </p>
      </div>

      {/* KPIs Globais */}
      <KPIs />
      
      {/* Estatísticas de Solicitações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendentes</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>Requer aprovação</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aprovados</p>
              <p className="text-3xl font-bold text-blue-600">{approvedRequests.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Aguardando atribuição</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Em Andamento</p>
              <p className="text-3xl font-bold text-orange-600">{assignedRequests.length + inProgressRequests.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-orange-600 dark:text-orange-400" />
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
              <p className="text-3xl font-bold text-green-600">{completedRequests.length + confirmedRequests.length}</p>
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
      
      {/* Resumo e Ações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo do Sistema */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
            Resumo do Sistema
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Instaladores</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{installers.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Produtos</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{products.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Solicitações</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{serviceRequests.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <X className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cancelados</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{cancelledRequests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/add-installer"
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Adicionar Instalador</span>
            </Link>
            <Link 
              to="/add-product"
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar Produto</span>
            </Link>
            <Link 
              to="/service-requests"
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Gerenciar Solicitações</span>
            </Link>
            <Link 
              to="/reports"
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Relatórios</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Solicitações Recentes */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Solicitações Recentes
          </h3>
          <Link 
            to="/service-requests"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
          >
            Ver todas →
          </Link>
        </div>
        
        {recentRequests.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma solicitação ainda
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              As solicitações dos clientes aparecerão aqui quando forem criadas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cliente / Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Endereço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.clientEmail || 'Cliente não informado'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.equipmentType === 'solar_heater' ? 'Aquecedor Solar' : 'Aquecedor a Gás'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {request.createdAt ? new Date(request.createdAt.seconds * 1000).toLocaleDateString() : 'Data não disponível'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>
                          {request.address?.city}, {request.address?.state}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/service-details/${request.id}`}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Alertas e Notificações */}
      {pendingRequests.length > 0 && (
        <div className="card p-6 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-2" />
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
              Atenção Necessária
            </h3>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 mb-4">
            Existem {pendingRequests.length} solicitações pendentes aguardando sua aprovação.
          </p>
          <Link 
            to="/service-requests"
            className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Revisar Solicitações
          </Link>
        </div>
      )}
    </div>
  );
} 