import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getServiceRequestById, getChecklistTemplate, getServiceChecklist, saveServiceChecklist, uploadInstallationImage } from '../../services/serviceRequests';
import { Loader2, CheckSquare, Upload, Save } from 'lucide-react';

export default function Checklist() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [checklist, setChecklist] = useState({});
  const [saving, setSaving] = useState(false);

  const template = useMemo(() => getChecklistTemplate(request?.equipmentType), [request?.equipmentType]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const req = await getServiceRequestById(id);
        setRequest(req);
        const saved = await getServiceChecklist(id);
        if (saved) setChecklist(saved);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const toggleBool = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !(prev?.[key]) }));
  };

  const setText = (key, value) => {
    setChecklist((prev) => ({ ...prev, [key]: value }));
  };

  const onUpload = async (key, file) => {
    if (!file) return;
    const url = await uploadInstallationImage(id, file);
    setChecklist((prev) => ({ ...prev, [key]: [ ...(prev?.[key] || []), url ] }));
  };

  const onSave = async () => {
    setSaving(true);
    try {
      // Valida obrigatórios
      const missing = (template || []).filter((f) => f.required && !checklist?.[f.key]);
      if (missing.length > 0) {
        alert('Preencha os campos obrigatórios: ' + missing.map(m=>m.label).join(', '));
        setSaving(false);
        return;
      }
      await saveServiceChecklist(id, checklist);
      alert('Checklist salvo.');
    } finally {
      setSaving(false);
    }
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
          <CheckSquare className="w-6 h-6 mr-2 text-primary-600" /> Checklist de Serviço
        </h1>
        <button className="btn-primary inline-flex items-center" onClick={onSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(template || []).map((field) => (
            <div key={field.key} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{field.label}{field.required && <span className="text-red-500"> *</span>}</p>
              </div>
              {field.type === 'boolean' && (
                <button className={`px-3 py-2 rounded-lg text-sm ${checklist?.[field.key] ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`} onClick={() => toggleBool(field.key)}>
                  {checklist?.[field.key] ? 'Concluído' : 'Pendente'}
                </button>
              )}
              {field.type === 'text' && (
                <textarea className="input-field w-full" rows={3} value={checklist?.[field.key] || ''} onChange={(e)=>setText(field.key, e.target.value)} />
              )}
              {field.type === 'photo' && (
                <div className="space-y-2">
                  <label className="btn-secondary inline-flex items-center w-fit">
                    <Upload className="w-4 h-4 mr-2" /> Enviar foto
                    <input type="file" accept="image/*" className="hidden" onChange={(e)=> onUpload(field.key, e.target.files?.[0])} />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(checklist?.[field.key] || []).map((url, idx) => (
                      <img key={idx} src={url} alt={`${field.key}-${idx}`} className="w-24 h-20 object-cover rounded" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


