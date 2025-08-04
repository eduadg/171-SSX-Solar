import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getInstallerServiceRequests } from '../../services/serviceRequests';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';

export default function MyServices() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRequests() {
      try {
        const data = await getInstallerServiceRequests(currentUser.uid);
        setRequests(data);
      } catch (e) {
        console.error('Error fetching installer services:', e);
        setError('Erro ao carregar seus serviços');
      } finally {
        setLoading(false);
      }
    }
    if (currentUser) fetchRequests();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum serviço atribuído.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent px-4 py-8">
      <div className="w-full max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-gray-100">Meus Serviços</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <div key={req.id} className="card p-4 bg-gray-800/80 border border-gray-700 rounded-xl shadow">
              <h2 className="font-semibold text-gray-100">
                {req.equipmentType === 'solar_heater' ? 'Aquecedor Solar' : 'Aquecedor a Gás'}
              </h2>
              <p className="text-gray-300 text-sm">{req.clientName}</p>
              <p className="text-gray-300 text-sm">{req.clientEmail}</p>
              <p className="text-gray-300 text-sm mt-2">
                Status: <span className="font-medium">{req.status}</span>
              </p>
              <Link to={`/service-details/${req.id}`} className="btn-primary mt-4 inline-block">
                Detalhes
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}