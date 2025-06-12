import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getClientServiceRequests } from '../../services/serviceRequests';

export default function DashboardDebug() {
  const { currentUser } = useAuth();
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      if (!currentUser?.uid) {
        setError('Usuário não encontrado');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 [DEBUG] Buscando dados para:', currentUser.uid);
        const requests = await getClientServiceRequests(currentUser.uid);
        console.log('✅ [DEBUG] Dados recebidos:', requests);
        
        // Verificar estrutura dos dados
        if (requests && requests.length > 0) {
          console.log('🔍 [DEBUG] Primeira solicitação:', requests[0]);
          console.log('🔍 [DEBUG] Tipo do endereço:', typeof requests[0]?.address);
          console.log('🔍 [DEBUG] Conteúdo do endereço:', requests[0]?.address);
        }
        
        setServiceRequests(requests || []);
      } catch (err) {
        console.error('❌ [DEBUG] Erro:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentUser]);

  const formatAddress = (address) => {
    try {
      if (!address) return 'Sem endereço';
      if (typeof address === 'string') return address;
      if (typeof address === 'object') {
        return `${address.street || ''}, ${address.number || ''} - ${address.city || ''}`;
      }
      return 'Endereço inválido';
    } catch (e) {
      console.error('Erro ao formatar endereço:', e);
      return 'Erro no endereço';
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!currentUser) return <div>Usuário não logado</div>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">🔍 Dashboard Debug</h2>
      
      <div className="mb-4">
        <h3 className="font-medium">Usuário Atual:</h3>
        <p>Nome: {currentUser.name}</p>
        <p>Email: {currentUser.email}</p>
        <p>UID: {currentUser.uid}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-medium">Solicitações ({serviceRequests.length}):</h3>
        {serviceRequests.length === 0 ? (
          <p>Nenhuma solicitação encontrada</p>
        ) : (
          <div className="space-y-2">
            {serviceRequests.map((request, index) => (
              <div key={request.id || index} className="border p-3 rounded">
                <p><strong>ID:</strong> {String(request.id || 'sem-id')}</p>
                <p><strong>Status:</strong> {String(request.status || 'sem-status')}</p>
                <p><strong>Tipo:</strong> {String(request.equipmentType || 'sem-tipo')}</p>
                <p><strong>Endereço:</strong> {formatAddress(request.address)}</p>
                <p><strong>Notas:</strong> {String(request.notes || 'sem-notas')}</p>
                <p><strong>Criado:</strong> {request.createdAt?.seconds 
                  ? new Date(request.createdAt.seconds * 1000).toLocaleString()
                  : 'sem-data'
                }</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 