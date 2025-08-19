import { useEffect, useState } from 'react';
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, getReservations, reserveForService, consumeReservation } from '../../services/admin';
import { Loader2, Package, Plus, Trash2, Save, ClipboardList } from 'lucide-react';

export default function Inventory() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({ name: '', sku: '', stock: 0, minStock: 0, unit: 'un' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [inv, res] = await Promise.all([getInventory(), getReservations()]);
      setItems(inv);
      setReservations(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addItem = async () => {
    setSaving(true);
    try {
      const created = await addInventoryItem({ ...form, stock: Number(form.stock||0), minStock: Number(form.minStock||0) });
      setItems(prev => [...prev, created]);
      setForm({ name: '', sku: '', stock: 0, minStock: 0, unit: 'un' });
    } finally { setSaving(false); }
  };

  const remove = async (id) => { await deleteInventoryItem(id); load(); };
  const save = async (id, item) => { await updateInventoryItem(id, item); load(); };

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
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Estoque e Insumos</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Controle de materiais para instalação e manutenção.</p>
        <ul className="mt-3 text-sm text-gray-700 dark:text-gray-300 list-disc pl-5">
          <li><span className="font-medium">Adicionar itens</span>: cadastre novos insumos com estoque mínimo.</li>
          <li><span className="font-medium">Reservas</span>: vincule materiais a serviços e dê baixa quando utilizados.</li>
          <li><span className="font-medium">Alertas</span>: configure <em>minStock</em> para monitorar reposição.</li>
        </ul>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center"><Package className="w-6 h-6 mr-2 text-primary-600"/> Estoque</h1>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3">Adicionar item</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input className="input-field" placeholder="Nome" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
          <input className="input-field" placeholder="SKU" value={form.sku} onChange={(e)=>setForm({...form, sku: e.target.value})} />
          <input className="input-field" placeholder="Estoque" type="number" value={form.stock} onChange={(e)=>setForm({...form, stock: e.target.value})} />
          <input className="input-field" placeholder="Mínimo" type="number" value={form.minStock} onChange={(e)=>setForm({...form, minStock: e.target.value})} />
          <input className="input-field" placeholder="Unidade" value={form.unit} onChange={(e)=>setForm({...form, unit: e.target.value})} />
        </div>
        <button className="btn-primary mt-3 inline-flex items-center" onClick={addItem} disabled={saving}><Plus className="w-4 h-4 mr-1"/> {saving ? 'Adicionando...' : 'Adicionar'}</button>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3">Itens</h3>
        <div className="space-y-2">
          {items.map(i => (
            <div key={i.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
              <input className="input-field" defaultValue={i.name} onBlur={(e)=>save(i.id, { ...i, name: e.target.value })} />
              <input className="input-field w-32" defaultValue={i.sku} onBlur={(e)=>save(i.id, { ...i, sku: e.target.value })} />
              <input className="input-field w-28" type="number" defaultValue={i.stock} onBlur={(e)=>save(i.id, { ...i, stock: Number(e.target.value) })} />
              <input className="input-field w-28" type="number" defaultValue={i.minStock} onBlur={(e)=>save(i.id, { ...i, minStock: Number(e.target.value) })} />
              <input className="input-field w-20" defaultValue={i.unit} onBlur={(e)=>save(i.id, { ...i, unit: e.target.value })} />
              <button className="btn-ghost text-red-600 ml-auto" onClick={()=>remove(i.id)}><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}
          {items.length === 0 && <div className="text-sm text-gray-500">Nenhum item.</div>}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center"><ClipboardList className="w-5 h-5 mr-2"/> Reservas</h3>
        <div className="space-y-2">
          {reservations.map(r => (
            <div key={r.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">Serviço:</span> {r.serviceRequestId} • <span className="font-medium">Item:</span> {r.itemId} • <span className="font-medium">Qtd:</span> {r.quantity}
              </div>
              {r.status !== 'consumed' && (
                <button className="btn-secondary" onClick={async()=>{ await consumeReservation(r.id); load(); }}>Dar Baixa</button>
              )}
            </div>
          ))}
          {reservations.length === 0 && <div className="text-sm text-gray-500">Nenhuma reserva.</div>}
        </div>
      </div>
    </div>
  );
}


