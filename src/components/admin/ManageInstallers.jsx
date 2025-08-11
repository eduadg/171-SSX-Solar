import { useEffect, useMemo, useState } from 'react';
import { getAllInstallers, updateUser, deleteUserData, getInstallerCustomFields, setInstallerCustomFields, listProfileChangeRequests, approveProfileChangeRequest, rejectProfileChangeRequest } from '../../services/users';
import { Loader2, Search, Pencil, Trash2, RefreshCcw, UserCog, Plus, Check, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';

export default function ManageInstallers() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [installers, setInstallers] = useState([]);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fieldDefs, setFieldDefs] = useState([]);
  const [pendingProfileReqs, setPendingProfileReqs] = useState([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return installers;
    return installers.filter((u) => {
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.region?.toLowerCase().includes(q)
      );
    });
  }, [installers, query]);

  async function load() {
    try {
      setLoading(true);
      setError('');
      const data = await getAllInstallers();
      setInstallers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError('Erro ao carregar instaladores');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    async function loadPending() {
      const reqs = await listProfileChangeRequests('pending');
      setPendingProfileReqs(reqs);
    }
    loadPending();
  }, []);

  const doRefresh = async () => {
    try {
      setRefreshing(true);
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  const onSave = async () => {
    if (!selected) return;
    try {
      setSaving(true);
      const { id, uid, name, phone, region, experience, specializations } = selected;
      const userId = id || uid;
      await updateUser(userId, { name, phone, region, experience, specializations });
      setInstallers((prev) => prev.map((u) => (u.id === userId || u.uid === userId ? { ...u, name, phone, region, experience, specializations } : u)));
      setSelected(null);
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (user) => {
    if (!user) return;
    if (!confirm(`Excluir instalador ${user.name || user.email}?`)) return;
    try {
      setDeleting(true);
      const userId = user.id || user.uid;
      await deleteUserData(userId);
      setInstallers((prev) => prev.filter((u) => (u.id || u.uid) !== userId));
      if (selected && (selected.id === userId || selected.uid === userId)) setSelected(null);
    } catch (e) {
      console.error(e);
      alert('Erro ao excluir instalador');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <UserCog className="w-6 h-6 mr-2 text-primary-600" /> Instaladores
        </h1>
        <button onClick={doRefresh} className="btn-secondary inline-flex items-center" disabled={refreshing}>
          <RefreshCcw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} /> Atualizar
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="input-field pl-9 w-full"
            placeholder="Buscar por nome, email ou região"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Região</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map((u) => (
                <tr key={u.id || u.uid}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{u.name || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{u.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{u.phone || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{u.region || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button className="btn-secondary px-2 py-1" onClick={() => setSelected(u)}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="btn-ghost px-2 py-1 text-red-600" onClick={() => onDelete(u)} disabled={deleting}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400" colSpan={5}>
                    Nenhum instalador encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Solicitações de alteração de perfil pendentes */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <UserCog className="w-5 h-5 mr-2 text-orange-500" />
            Solicitações de alteração de perfil
            {pendingProfileReqs.length > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 rounded-full">
                {pendingProfileReqs.length}
              </span>
            )}
          </h2>
          <button onClick={async ()=> setPendingProfileReqs(await listProfileChangeRequests('pending'))} className="btn-secondary">
            <RefreshCcw className="w-4 h-4 mr-1" /> Atualizar
          </button>
        </div>
        {pendingProfileReqs.length === 0 ? (
          <div className="text-center py-8">
            <UserCog className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Nenhuma solicitação pendente.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingProfileReqs.map(req => {
              // Buscar o nome do usuário na lista de instaladores
              const user = installers.find(u => (u.id || u.uid) === req.userId);
              const userName = user?.name || user?.email || req.userId;
              
              return (
                <div key={req.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <UserCog className="w-4 h-4 text-orange-500" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {userName}
                        </p>
                        <span className="text-xs text-gray-500">ID: {req.userId}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(req.updates).map(([key, value]) => (
                          <div key={key} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 capitalize">
                              {key === 'name' ? 'Nome' : 
                               key === 'cpf' ? 'CPF' : 
                               key === 'phone' ? 'Telefone' : 
                               key === 'photoURL' ? 'Foto' : key}
                            </p>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {key === 'photoURL' ? 'Nova foto selecionada' : value || '-'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button 
                        className="btn-primary inline-flex items-center text-sm" 
                        onClick={async()=>{
                          await approveProfileChangeRequest(req.id); 
                          setPendingProfileReqs(await listProfileChangeRequests('pending'));
                          // Recarregar lista de instaladores para mostrar as mudanças
                          load();
                        }}
                      >
                        <Check className="w-4 h-4 mr-1"/> Aprovar
                      </button>
                      <button 
                        className="btn-ghost inline-flex items-center text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
                        onClick={async()=>{
                          await rejectProfileChangeRequest(req.id, 'Reprovado pelo admin'); 
                          setPendingProfileReqs(await listProfileChangeRequests('pending'));
                        }}
                      >
                        <X className="w-4 h-4 mr-1"/> Rejeitar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onClose={() => setSelected(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-lg mx-auto">
            <Dialog.Title className="text-lg font-bold text-white mb-4">Editar Instalador</Dialog.Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome</label>
                <input className="input-field w-full" value={selected?.name || ''} onChange={(e) => setSelected({ ...selected, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input className="input-field w-full" value={selected?.email || ''} disabled />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Telefone</label>
                <input className="input-field w-full" value={selected?.phone || ''} onChange={(e) => setSelected({ ...selected, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Região</label>
                <input className="input-field w-full" value={selected?.region || ''} onChange={(e) => setSelected({ ...selected, region: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Especializações (separe por vírgula)</label>
                <input className="input-field w-full" value={(selected?.specializations || []).join(', ')} onChange={(e) => setSelected({ ...selected, specializations: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Experiência</label>
                <input className="input-field w-full" value={selected?.experience || ''} onChange={(e) => setSelected({ ...selected, experience: e.target.value })} />
              </div>
              {/* Campos personalizados definidos pelo admin para este instalador */}
              <div className="md:col-span-2 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-gray-400">Campos personalizados</label>
                  <button className="btn-ghost inline-flex items-center" onClick={async()=>{
                    const defs = await getInstallerCustomFields(selected?.id || selected?.uid);
                    setFieldDefs(defs);
                  }}>
                    <RefreshCcw className="w-4 h-4 mr-1"/> Recarregar
                  </button>
                </div>
                <div className="space-y-2">
                  {fieldDefs.map((f, idx) => (
                    <div key={f.key} className="flex gap-2">
                      <input className="input-field flex-1" value={f.label} onChange={(e)=>{
                        const copy = [...fieldDefs];
                        copy[idx] = { ...copy[idx], label: e.target.value };
                        setFieldDefs(copy);
                      }} />
                      <input className="input-field w-40" value={f.key} onChange={(e)=>{
                        const copy = [...fieldDefs];
                        copy[idx] = { ...copy[idx], key: e.target.value };
                        setFieldDefs(copy);
                      }} />
                    </div>
                  ))}
                  <button className="btn-secondary inline-flex items-center" onClick={()=> setFieldDefs([...fieldDefs, { key: '', label: '' }])}>
                    <Plus className="w-4 h-4 mr-1"/> Adicionar Campo
                  </button>
                  <button className="btn-primary ml-2" onClick={async()=>{
                    await setInstallerCustomFields(selected?.id || selected?.uid, fieldDefs.filter(f=>f.key && f.label));
                    alert('Campos salvos');
                  }}>Salvar Campos</button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="btn-secondary" onClick={() => setSelected(null)}>Cancelar</button>
              <button className="btn-primary" onClick={onSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
