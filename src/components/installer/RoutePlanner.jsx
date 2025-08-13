import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getInstallerServiceRequests } from '../../services/serviceRequests';
import { MapPin, Loader2, Route } from 'lucide-react';

export default function RoutePlanner() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const reqs = await getInstallerServiceRequests(currentUser?.uid || currentUser?.id);
        setRequests(Array.isArray(reqs) ? reqs : []);
      } finally {
        setLoading(false);
      }
    }
    if (currentUser) load();
  }, [currentUser]);

  const addressToString = (a) => !a ? '' : `${a.street || ''}, ${a.number || ''} - ${a.city || ''}/${a.state || ''}`;

  const suggestedStops = useMemo(() => {
    // Simples ordenação por createdAt: pode ser substituído por API Directions
    return (requests || [])
      .filter(r => r.status === 'assigned' || r.status === 'in_progress')
      .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0))
      .slice(0, 5);
  }, [requests]);

  const buildGoogleMapsUrl = () => {
    const waypoints = suggestedStops.map(s => encodeURIComponent(addressToString(s.address))).join('/');
    const parts = [
      'https://www.google.com/maps/dir',
      encodeURIComponent(origin || 'Minha localização'),
      waypoints,
      encodeURIComponent(destination || (addressToString(suggestedStops.at(-1)?.address) || ''))
    ].filter(Boolean);
    return parts.join('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Route className="w-6 h-6 mr-2 text-primary-600" /> Planejador de Rotas
        </h1>
      </div>

      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500">Origem</label>
            <input className="input-field w-full" placeholder="Endereço de partida" value={origin} onChange={(e)=>setOrigin(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500">Paradas sugeridas</label>
            <div className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded p-3">
              {(suggestedStops || []).map(s => (
                <div key={s.id} className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span>{addressToString(s.address)}</span>
                </div>
              ))}
              {suggestedStops.length === 0 && <div>Nenhuma parada sugerida.</div>}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500">Destino</label>
            <input className="input-field w-full" placeholder="Endereço final" value={destination} onChange={(e)=>setDestination(e.target.value)} />
          </div>
        </div>
        <a className="btn-primary mt-4 inline-flex items-center" href={buildGoogleMapsUrl()} target="_blank" rel="noreferrer">
          <MapPin className="w-4 h-4 mr-2" /> Abrir no Google Maps
        </a>
      </div>
    </div>
  );
}


