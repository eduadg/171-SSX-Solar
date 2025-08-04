import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceRequestById } from '../../services/serviceRequests';
import { getAllInstallers as getAllInstallersService } from '../../services/users';
import { assignInstallerToServiceRequest } from '../../services/serviceRequests';
import { Loader2, AlertCircle, MapPin, ArrowLeft } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { useAuth } from '../../contexts/AuthContext';

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

export default function AdminServiceRequestDetails() {
  const { id } = useParams();
  const { userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [error, setError] = useState('');
  const [installers, setInstallers] = useState([]);
  const [selectedInstaller, setSelectedInstaller] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const data = await getServiceRequestById(id);
        setRequest(data);
      } catch (err) {
        setError('Erro ao carregar detalhes da solicitação.');
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  async function handleAssignInstaller() {
    if (!selectedInstaller) return;
    setAssigning(true);
    setError('');
    setSuccessMsg('');
    try {
      const updated = await assignInstallerToServiceRequest(request.id, selectedInstaller);
      setRequest(updated);
      setSuccessMsg('Instalador atribuído com sucesso!');
    } catch (err) {
      setError('Erro ao atribuir instalador.');
    } finally {
      setAssigning(false);
      setShowModal(false); // Fechar modal após atribuição
    }
  }

  // Nova função para abrir o modal e buscar instaladores
  async function openAssignModal() {
    setShowModal(true);
    try {
      console.log('[DEBUG] Buscando instaladores...');
      const installersData = await getAllInstallersService();
      console.log('[DEBUG] Tipo de installersData:', typeof installersData, installersData);
      setInstallers(Array.isArray(installersData) ? installersData : []);
      console.log('[DEBUG] Instaladores retornados:', installersData);
    } catch (err) {
      setInstallers([]);
      console.error('[DEBUG] Erro ao buscar instaladores:', err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Carregando detalhes...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="card p-6">
        <div className="flex items-center text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>{error || 'Solicitação não encontrada.'}</p>
        </div>
        <Link to="/service-requests" className="btn-primary mt-6 inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-transparent px-4 py-8">
      <div className="w-full max-w-2xl mt-10">
        <div className="flex items-center mb-6">
          <Link to="/service-requests" className="btn-secondary inline-flex items-center mr-4 shadow-md hover:shadow-lg transition">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-100 flex-1">Detalhes da Solicitação</h1>
          <StatusBadge status={request.status} />
        </div>
        <div className="card p-8 rounded-2xl shadow-xl bg-gray-800/80 border border-gray-700 space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <span className="font-semibold text-gray-300">Cliente:</span>
              <div className="flex flex-col items-end">
                {request.clientName && (
                  <span className="text-gray-100">{request.clientName}</span>
                )}
                <span className="text-gray-400 text-sm">{request.clientEmail}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-300">Equipamento:</span>
              <span className="text-gray-100">{request.equipmentType === 'solar_heater' ? 'Aquecedor Solar' : 'Aquecedor a Gás'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-300">Produto:</span>
              <span className="text-gray-100">{request.productId || '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-300">Endereço:</span>
              <span className="flex items-center text-gray-100">
                <MapPin className="w-4 h-4 mr-1 text-primary-400" />
                {request.address?.street}, {request.address?.number} - {request.address?.city}, {request.address?.state}
              </span>
            </div>
          </div>
          <hr className="border-gray-700" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-300">Status:</span>
              <StatusBadge status={request.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-300">Data de Criação:</span>
              <span className="text-gray-100">{request.createdAt ? new Date(request.createdAt.seconds * 1000).toLocaleString() : '-'}</span>
            </div>
            {request.updatedAt && (
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-300">Última Atualização:</span>
                <span className="text-gray-100">{new Date(request.updatedAt.seconds * 1000).toLocaleString()}</span>
              </div>
            )}
          </div>
          <hr className="border-gray-700" />
          {request.notes && (
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-300">Notas:</span>
              <span className="text-gray-100">{request.notes}</span>
            </div>
          )}
          {request.installerName && (
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-300">Instalador:</span>
              <span className="text-gray-100">{request.installerName}</span>
            </div>
          )}
          {request.technicalNotes && (
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-300">Notas Técnicas:</span>
              <span className="text-gray-100">{request.technicalNotes}</span>
            </div>
          )}
          {request.images && request.images.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-gray-300">Imagens:</span>
              <div className="flex flex-wrap gap-4 mt-2">
                {request.images.map((img, idx) => (
                  <img key={idx} src={img.url} alt={`Imagem ${idx + 1}`} className="w-32 h-24 object-cover rounded shadow" />
                ))}
              </div>
            </div>
          )}
          {/* Botão de atribuição apenas para admin */}
          {request.status === 'pending' && userRole === 'admin' && (
            <button
              className="btn-primary w-fit mb-4"
              onClick={openAssignModal}
            >
              Atribuir Instalador
            </button>
          )}
          {/* Modal de atribuição */}
          <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md mx-auto z-10">
                <Dialog.Title className="text-xl font-bold mb-4 text-white">Atribuir Instalador</Dialog.Title>
                <select
                  className="input-field w-full mb-4"
                  value={selectedInstaller}
                  onChange={e => setSelectedInstaller(e.target.value)}
                >
                  <option value="">Selecione um instalador</option>
                  {Array.isArray(installers) && installers.map(inst => (
                    <option key={inst.uid} value={inst.uid}>
                      {inst.name} ({inst.region})
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 justify-end">
                  <button
                    className="btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn-primary"
                    onClick={handleAssignInstaller}
                    disabled={!selectedInstaller || assigning}
                  >
                    {assigning ? 'Atribuindo...' : 'Atribuir'}
                  </button>
                </div>
                {successMsg && <div className="text-green-400 font-medium mt-4">{successMsg}</div>}
                {error && <div className="text-red-400 font-medium mt-4">{error}</div>}
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
}