import { useEffect, useState } from 'react';
import { getPriceTables, addPriceTable, updatePriceTable, deletePriceTable } from '../../services/admin';
import { Loader2, DollarSign, Plus, Trash2 } from 'lucide-react';

export default function Pricing() {
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ name: '', region: '', complexity: 'normal', basePrice: 0 });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const t = await getPriceTables();
      setTables(t);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); }, []);

  const addTable = async () => {
    setSaving(true);
    try {
      const created = await addPriceTable({ ...form, basePrice: Number(form.basePrice||0) });
      setTables(prev => [...prev, created]);
      setForm({ name: '', region: '', complexity: 'normal', basePrice: 0 });
    } finally { setSaving(false); }
  };

  const save = async (id, obj) => { await updatePriceTable(id, obj); load(); };
  const remove = async (id) => { await deletePriceTable(id); load(); };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-5 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Tabelas de Preços</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Defina preços por região e complexidade para padronizar orçamentos.</p>
        <ul className="mt-3 text-sm text-gray-700 dark:text-gray-300 list-disc pl-5">
          <li><span className="font-medium">Preço base</span>: ponto de partida do orçamento.</li>
          <li><span className="font-medium">Região e complexidade</span>: ajuste conforme área e dificuldade.</li>
          <li><span className="font-medium">Edição inline</span>: altere rapidamente direto na lista.</li>
        </ul>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center"><DollarSign className="w-6 h-6 mr-2 text-primary-600"/> Tabelas de Preço</h1>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3">Nova Tabela</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="input-field" placeholder="Nome" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
          <input className="input-field" placeholder="Região" value={form.region} onChange={(e)=>setForm({...form, region: e.target.value})} />
          <select className="input-field" value={form.complexity} onChange={(e)=>setForm({...form, complexity: e.target.value})}>
            <option value="low">Baixa</option>
            <option value="normal">Normal</option>
            <option value="high">Alta</option>
          </select>
          <input className="input-field" placeholder="Preço base" type="number" value={form.basePrice} onChange={(e)=>setForm({...form, basePrice: e.target.value})} />
        </div>
        <button className="btn-primary mt-3 inline-flex items-center" onClick={addTable} disabled={saving}><Plus className="w-4 h-4 mr-1"/> {saving ? 'Adicionando...' : 'Adicionar'}</button>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3">Tabelas</h3>
        <div className="space-y-2">
          {tables.map(t => (
            <div key={t.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
              <input className="input-field" defaultValue={t.name} onBlur={(e)=>save(t.id, { ...t, name: e.target.value })} />
              <input className="input-field" defaultValue={t.region} onBlur={(e)=>save(t.id, { ...t, region: e.target.value })} />
              <select className="input-field w-40" defaultValue={t.complexity} onChange={(e)=>save(t.id, { ...t, complexity: e.target.value })}>
                <option value="low">Baixa</option>
                <option value="normal">Normal</option>
                <option value="high">Alta</option>
              </select>
              <input className="input-field w-32" type="number" defaultValue={t.basePrice} onBlur={(e)=>save(t.id, { ...t, basePrice: Number(e.target.value) })} />
              <button className="btn-ghost text-red-600 ml-auto" onClick={()=>remove(t.id)}><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}
          {tables.length === 0 && <div className="text-sm text-gray-500">Nenhuma tabela.</div>}
        </div>
      </div>
    </div>
  );
}


