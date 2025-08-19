import { useEffect, useState } from 'react';
import { listProfileApprovals, listServiceApprovals, approveServiceChange, rejectServiceChange } from '../../services/admin';
import { listProfileChangeRequests, approveProfileChangeRequest, rejectProfileChangeRequest } from '../../services/users';
import { Loader2, Check, X, UserCheck, ClipboardCheck } from 'lucide-react';

export default function ApprovalsCenter() {
  const [loading, setLoading] = useState(true);
  const [profileReqs, setProfileReqs] = useState([]);
  const [serviceReqs, setServiceReqs] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const [profiles, services] = await Promise.all([
        listProfileChangeRequests('pending'),
        listServiceApprovals()
      ]);
      setProfileReqs(profiles);
      setServiceReqs(services);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Central de Aprovações</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Aqui você revisa solicitações que exigem validação do administrador.</p>
        <ul className="mt-3 text-sm text-gray-700 dark:text-gray-300 list-disc pl-5">
          <li><span className="font-medium">Aprovações de Perfil</span>: alterações realizadas por instaladores (nome, CPF, telefone, foto).</li>
          <li><span className="font-medium">Aprovações de Serviços</span>: alterações críticas em ordens de serviço (ex.: orçamento, prazo).</li>
        </ul>
      </div>
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center"><UserCheck className="w-5 h-5 mr-2 text-primary-600"/> Aprovações de Perfil</h2>
          <button className="btn-secondary" onClick={load}>Atualizar</button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Consulte e decida as alterações de dados pessoais submetidas pelos instaladores.</p>
        {profileReqs.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma solicitação pendente.</p>
        ) : (
          <div className="space-y-3">
            {profileReqs.map((r) => (
              <div key={r.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">Usuário: {r.userId}</p>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2 overflow-x-auto">{JSON.stringify(r.updates, null, 2)}</pre>
                </div>
                <div className="flex gap-2">
                  <button className="btn-primary inline-flex items-center" onClick={async()=>{ await approveProfileChangeRequest(r.id); load(); }}><Check className="w-4 h-4 mr-1"/> Aprovar</button>
                  <button className="btn-ghost inline-flex items-center" onClick={async()=>{ await rejectProfileChangeRequest(r.id, 'Reprovado'); load(); }}><X className="w-4 h-4 mr-1"/> Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center"><ClipboardCheck className="w-5 h-5 mr-2 text-primary-600"/> Aprovações de Serviços</h2>
          <button className="btn-secondary" onClick={load}>Atualizar</button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Revisão de alterações sensíveis em solicitações (preço, escopo, prazos). Em breve com mais detalhes.</p>
        {serviceReqs.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma solicitação pendente.</p>
        ) : (
          <div className="space-y-3">
            {serviceReqs.map((s) => (
              <div key={s.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">Serviço: {s.serviceRequestId}</p>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2 overflow-x-auto">{JSON.stringify(s.change, null, 2)}</pre>
                </div>
                <div className="flex gap-2">
                  <button className="btn-primary inline-flex items-center" onClick={async()=>{ await approveServiceChange(s.id); load(); }}><Check className="w-4 h-4 mr-1"/> Aprovar</button>
                  <button className="btn-ghost inline-flex items-center" onClick={async()=>{ await rejectServiceChange(s.id, 'Reprovado'); load(); }}><X className="w-4 h-4 mr-1"/> Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


