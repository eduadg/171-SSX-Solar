import { useEffect, useState } from 'react';
import { getKpis } from '../../services/admin';
import { Loader2, BarChart, Clock, AlertTriangle, ShieldCheck, BarChart3 } from 'lucide-react';

export default function KPIs() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const d = await getKpis();
        setData(d);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Indicadores principais</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Acompanhe a saúde operacional: volume de solicitações, velocidade de entrega e qualidade (SLA).</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Solicitações</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{data?.total || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <BarChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tempo Médio (h)</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{data?.avgLeadTimeHours || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cancelados</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{data?.cancelled || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">SLA 48h</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{data?.sla48h || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
          Solicitações por Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {Object.entries(data?.byStatus || {}).map(([s, v]) => (
            <div key={s} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase font-medium">{s}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


