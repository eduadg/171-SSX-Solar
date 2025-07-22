import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllServiceRequests } from '../../services/serviceRequests';
import { Loader2, AlertCircle, MapPin } from 'lucide-react';

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

export default function AdminServiceRequests() {
  const [loading, setLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const requestsData = await getAllServiceRequests();
        setServiceRequests(requestsData);
      } catch (error) {
        setError('Erro ao carregar solicitações.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredRequests = statusFilter === 'all'
    ? serviceRequests
    : serviceRequests.filter(req => req.status === statusFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Solicitações de Serviço</h1>
        <div>
          <select
            className="input-field"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="approved">Aprovado</option>
            <option value="assigned">Atribuído</option>
            <option value="in_progress">Em Andamento</option>
            <option value="completed">Concluído</option>
            <option value="confirmed">Confirmado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando solicitações...</p>
        </div>
      ) : error ? (
        <div className="card p-6">
          <div className="flex items-center text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cliente / Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Endereço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Nenhuma solicitação encontrada para o filtro selecionado.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 