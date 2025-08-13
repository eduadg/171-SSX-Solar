import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getServiceRequestById, startServiceRequest, pauseServiceRequest, resumeServiceRequest, completeServiceRequest, startTravelLog, endTravelLog } from '../../services/serviceRequests';
import { Loader2, Play, Pause, Flag, MapPin, Check } from 'lucide-react';

export default function TimeTracker() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [addrFrom, setAddrFrom] = useState('');
  const [addrTo, setAddrTo] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const req = await getServiceRequestById(id);
      setRequest(req);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const onStart = async () => { await startServiceRequest(id); await load(); };
  const onPause = async () => { await pauseServiceRequest(id); await load(); };
  const onResume = async () => { await resumeServiceRequest(id); await load(); };
  const onComplete = async () => { await completeServiceRequest(id, ''); await load(); };
  const onStartTravel = async () => { await startTravelLog(id, addrFrom); setAddrFrom(''); await load(); };
  const onEndTravel = async () => { await endTravelLog(id, addrTo); setAddrTo(''); await load(); };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Controle de Tempo</h1>
      <div className="card p-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary inline-flex items-center" onClick={onStart}>
            <Play className="w-4 h-4 mr-2" /> Iniciar
          </button>
          <button className="btn-secondary inline-flex items-center" onClick={onPause}>
            <Pause className="w-4 h-4 mr-2" /> Pausar
          </button>
          <button className="btn-secondary inline-flex items-center" onClick={onResume}>
            <Flag className="w-4 h-4 mr-2" /> Retomar
          </button>
          <button className="btn-ghost inline-flex items-center" onClick={onComplete}>
            <Check className="w-4 h-4 mr-2" /> Concluir
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <label className="text-xs text-gray-500">Deslocamento - Origem</label>
            <div className="flex gap-2 mt-1">
              <input className="input-field flex-1" value={addrFrom} onChange={(e)=>setAddrFrom(e.target.value)} placeholder="Endereço de saída" />
              <button className="btn-secondary inline-flex items-center" onClick={onStartTravel}>
                <MapPin className="w-4 h-4 mr-1" /> Iniciar
              </button>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <label className="text-xs text-gray-500">Deslocamento - Destino</label>
            <div className="flex gap-2 mt-1">
              <input className="input-field flex-1" value={addrTo} onChange={(e)=>setAddrTo(e.target.value)} placeholder="Endereço de chegada" />
              <button className="btn-secondary inline-flex items-center" onClick={onEndTravel}>
                <MapPin className="w-4 h-4 mr-1" /> Encerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


