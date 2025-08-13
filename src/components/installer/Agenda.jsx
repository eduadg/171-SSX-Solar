import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getInstallerServiceRequests } from '../../services/serviceRequests';
import { getInstallerAvailability, addAvailabilityBlock, deleteAvailabilityBlock } from '../../services/users';
import { Calendar as CalendarIcon, Plus, Trash2, Loader2, Clock, Package, Shield } from 'lucide-react';

export default function Agenda() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [form, setForm] = useState({ date: '', start: '', end: '', note: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [reqs, av] = await Promise.all([
          getInstallerServiceRequests(currentUser?.uid || currentUser?.id),
          getInstallerAvailability(currentUser?.uid || currentUser?.id)
        ]);
        setRequests(Array.isArray(reqs) ? reqs : []);
        setAvailability(Array.isArray(av) ? av : []);
      } finally {
        setLoading(false);
      }
    }
    if (currentUser) load();
  }, [currentUser]);

  const groupedByDate = useMemo(() => {
    const groups = {};
    (requests || []).forEach((r) => {
      const ts = r.startedAt?.seconds || r.createdAt?.seconds || 0;
      const dateKey = ts ? new Date(ts * 1000).toISOString().slice(0, 10) : 'Sem data';
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(r);
    });
    return groups;
  }, [requests]);

  const addBlock = async () => {
    if (!form.date || !form.start || !form.end) return;
    setSaving(true);
    try {
      const block = { date: form.date, start: form.start, end: form.end, note: form.note };
      const created = await addAvailabilityBlock(currentUser?.uid || currentUser?.id, block);
      setAvailability((prev) => [...prev, created]);
      setForm({ date: '', start: '', end: '', note: '' });
    } finally {
      setSaving(false);
    }
  };

  const removeBlock = async (id) => {
    await deleteAvailabilityBlock(currentUser?.uid || currentUser?.id, id);
    setAvailability((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <CalendarIcon className="w-6 h-6 mr-2 text-primary-600" /> Minha Agenda
        </h1>
      </div>

      {/* Disponibilidade / bloqueios */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Disponibilidade e Bloqueios</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input type="date" className="input-field" value={form.date} onChange={(e)=>setForm({...form, date: e.target.value})} />
          <input type="time" className="input-field" value={form.start} onChange={(e)=>setForm({...form, start: e.target.value})} />
          <input type="time" className="input-field" value={form.end} onChange={(e)=>setForm({...form, end: e.target.value})} />
          <input type="text" className="input-field" placeholder="Nota (opcional)" value={form.note} onChange={(e)=>setForm({...form, note: e.target.value})} />
        </div>
        <button className="btn-primary mt-3 inline-flex items-center" onClick={addBlock} disabled={saving}>
          <Plus className="w-4 h-4 mr-1" /> {saving ? 'Adicionando...' : 'Adicionar Bloqueio'}
        </button>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {availability.map((b)=> (
            <div key={b.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{b.date}</span> • {b.start} - {b.end} {b.note ? `• ${b.note}` : ''}
              </div>
              <button className="btn-ghost text-red-600" onClick={()=>removeBlock(b.id)}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {availability.length === 0 && (
            <div className="text-sm text-gray-500">Nenhum bloqueio cadastrado.</div>
          )}
        </div>
      </div>

      {/* Serviços por data */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Serviços</h2>
        <div className="space-y-4">
          {Object.keys(groupedByDate).length === 0 && (
            <div className="text-sm text-gray-500">Nenhum serviço encontrado.</div>
          )}
          {Object.entries(groupedByDate).map(([date, list]) => (
            <div key={date}>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{date}</div>
              <div className="space-y-2">
                {list.map((req) => (
                  <div key={req.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-primary-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{req.equipmentType === 'solar_heater' ? 'Aquecedor Solar' : 'Aquecedor a Gás'}</div>
                        <div className="text-xs text-gray-500">{req.address?.street}, {req.address?.number} - {req.address?.city}/{req.address?.state}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <Clock className="w-4 h-4" /> {req.startedAt?.seconds ? new Date(req.startedAt.seconds*1000).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}) : '--:--'}
                      <Shield className="w-4 h-4" /> {req.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


