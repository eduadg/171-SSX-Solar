import { useEffect, useState } from 'react';
import { getServiceTemplates, addServiceTemplate, updateServiceTemplate, deleteServiceTemplate, getServiceFieldDefs, addServiceFieldDef, updateServiceFieldDef, deleteServiceFieldDef } from '../../services/admin';
import { Loader2, FileText, Plus, Trash2 } from 'lucide-react';

export default function ServiceTemplates() {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({ name: '', serviceType: 'solar_heater', region: '', complexity: 'normal', baseDurationMin: 120 });
  const [fields, setFields] = useState([]);
  const [selectedType, setSelectedType] = useState('solar_heater');
  const [fieldDraft, setFieldDraft] = useState({ key: '', label: '', type: 'text', required: false });

  const load = async () => {
    setLoading(true);
    try {
      const tpls = await getServiceTemplates();
      setTemplates(tpls);
      const defs = await getServiceFieldDefs(selectedType);
      setFields(defs);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, [selectedType]);

  const addTpl = async () => {
    const created = await addServiceTemplate({ ...form, baseDurationMin: Number(form.baseDurationMin||0) });
    setTemplates(prev => [...prev, created]);
    setForm({ name: '', serviceType: 'solar_heater', region: '', complexity: 'normal', baseDurationMin: 120 });
  };

  const saveTpl = async (id, obj) => { await updateServiceTemplate(id, obj); load(); };
  const removeTpl = async (id) => { await deleteServiceTemplate(id); load(); };

  const addField = async () => {
    const created = await addServiceFieldDef(selectedType, fieldDraft);
    setFields(prev => [...prev, created]);
    setFieldDraft({ key: '', label: '', type: 'text', required: false });
  };
  const saveField = async (fid, obj) => { await updateServiceFieldDef(selectedType, fid, obj); load(); };
  const removeField = async (fid) => { await deleteServiceFieldDef(selectedType, fid); load(); };

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
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Templates de Serviços</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Padronize execução e checklist por tipo de serviço.</p>
        <ul className="mt-3 text-sm text-gray-700 dark:text-gray-300 list-disc pl-5">
          <li><span className="font-medium">Templates</span>: defina região, complexidade e duração base.</li>
          <li><span className="font-medium">Campos por tipo</span>: configure campos obrigatórios (texto, booleano, foto).</li>
          <li>Esses campos aparecem para o instalador no checklist do serviço.</li>
        </ul>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center"><FileText className="w-6 h-6 mr-2 text-primary-600"/> Templates de Serviço</h1>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3">Novo Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input className="input-field" placeholder="Nome" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
          <select className="input-field" value={form.serviceType} onChange={(e)=>setForm({...form, serviceType: e.target.value})}>
            <option value="solar_heater">Solar</option>
            <option value="gas_heater">Gás</option>
          </select>
          <input className="input-field" placeholder="Região" value={form.region} onChange={(e)=>setForm({...form, region: e.target.value})} />
          <select className="input-field" value={form.complexity} onChange={(e)=>setForm({...form, complexity: e.target.value})}>
            <option value="low">Baixa</option>
            <option value="normal">Normal</option>
            <option value="high">Alta</option>
          </select>
          <input className="input-field" placeholder="Duração base (min)" type="number" value={form.baseDurationMin} onChange={(e)=>setForm({...form, baseDurationMin: e.target.value})} />
        </div>
        <button className="btn-primary mt-3 inline-flex items-center" onClick={addTpl}><Plus className="w-4 h-4 mr-1"/> Adicionar</button>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3">Templates</h3>
        <div className="space-y-2">
          {templates.map(t => (
            <div key={t.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
              <input className="input-field" defaultValue={t.name} onBlur={(e)=>saveTpl(t.id, { ...t, name: e.target.value })} />
              <select className="input-field w-40" defaultValue={t.serviceType} onChange={(e)=>saveTpl(t.id, { ...t, serviceType: e.target.value })}>
                <option value="solar_heater">Solar</option>
                <option value="gas_heater">Gás</option>
              </select>
              <input className="input-field" defaultValue={t.region} onBlur={(e)=>saveTpl(t.id, { ...t, region: e.target.value })} />
              <select className="input-field w-40" defaultValue={t.complexity} onChange={(e)=>saveTpl(t.id, { ...t, complexity: e.target.value })}>
                <option value="low">Baixa</option>
                <option value="normal">Normal</option>
                <option value="high">Alta</option>
              </select>
              <input className="input-field w-40" type="number" defaultValue={t.baseDurationMin} onBlur={(e)=>saveTpl(t.id, { ...t, baseDurationMin: Number(e.target.value) })} />
              <button className="btn-ghost text-red-600 ml-auto" onClick={()=>removeTpl(t.id)}><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}
          {templates.length === 0 && <div className="text-sm text-gray-500">Nenhum template.</div>}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3">Campos por tipo de serviço</h3>
        <div className="flex items-center gap-2 mb-3">
          <select className="input-field w-40" value={selectedType} onChange={(e)=>setSelectedType(e.target.value)}>
            <option value="solar_heater">Solar</option>
            <option value="gas_heater">Gás</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="input-field" placeholder="Label" value={fieldDraft.label} onChange={(e)=>setFieldDraft({...fieldDraft, label: e.target.value})} />
          <input className="input-field" placeholder="Key" value={fieldDraft.key} onChange={(e)=>setFieldDraft({...fieldDraft, key: e.target.value})} />
          <select className="input-field" value={fieldDraft.type} onChange={(e)=>setFieldDraft({...fieldDraft, type: e.target.value})}>
            <option value="text">Texto</option>
            <option value="boolean">Booleano</option>
            <option value="photo">Foto</option>
          </select>
          <select className="input-field" value={fieldDraft.required} onChange={(e)=>setFieldDraft({...fieldDraft, required: e.target.value === 'true'})}>
            <option value="false">Opcional</option>
            <option value="true">Obrigatório</option>
          </select>
        </div>
        <button className="btn-primary mt-3 inline-flex items-center" onClick={addField}><Plus className="w-4 h-4 mr-1"/> Adicionar Campo</button>

        <div className="mt-4 space-y-2">
          {fields.map(f => (
            <div key={f.id || f.key} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
              <input className="input-field" defaultValue={f.label} onBlur={(e)=>saveField(f.id, { ...f, label: e.target.value })} />
              <input className="input-field" defaultValue={f.key} onBlur={(e)=>saveField(f.id, { ...f, key: e.target.value })} />
              <select className="input-field w-40" defaultValue={f.type} onChange={(e)=>saveField(f.id, { ...f, type: e.target.value })}>
                <option value="text">Texto</option>
                <option value="boolean">Booleano</option>
                <option value="photo">Foto</option>
              </select>
              <select className="input-field w-40" defaultValue={String(f.required)} onChange={(e)=>saveField(f.id, { ...f, required: e.target.value === 'true' })}>
                <option value="false">Opcional</option>
                <option value="true">Obrigatório</option>
              </select>
              <button className="btn-ghost text-red-600 ml-auto" onClick={()=>removeField(f.id)}><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}
          {fields.length === 0 && <div className="text-sm text-gray-500">Nenhum campo.</div>}
        </div>
      </div>
    </div>
  );
}


