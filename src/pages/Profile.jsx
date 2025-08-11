import { useMemo, useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Camera, Pencil, Save, X, RefreshCcw } from 'lucide-react';
import { createProfileChangeRequest, getInstallerCustomFields, getUserById } from '../services/users';

export default function Profile() {
  const { currentUser, userRole } = useAuth();

  const [editing, setEditing] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    cpf: currentUser?.cpf || '',
    phone: currentUser?.phone || '',
    photoURL: currentUser?.photoURL || '',
  });
  const [photoPreview, setPhotoPreview] = useState(currentUser?.photoURL || '');
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const fileInputRef = useRef(null);

  const displayRole = useMemo(() => {
    if (userRole === 'admin') return 'Administrador';
    if (userRole === 'installer') return 'Instalador';
    return 'Cliente';
  }, [userRole]);

  const displayName = useMemo(() => {
    return profileData?.name || currentUser?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Usuário';
  }, [currentUser, profileData]);

  const avatar = useMemo(() => {
    const base = (
      <div className="relative">
        {photoPreview ? (
          <img src={photoPreview} alt="Foto de perfil" className="w-28 h-28 rounded-2xl object-cover shadow-md" />
        ) : (
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-600 to-orange-500 text-white flex items-center justify-center text-3xl shadow-md">
            {(displayName || 'U').substring(0, 1).toUpperCase()}
          </div>
        )}
        {userRole === 'installer' && editing && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow hover:shadow-md transition"
            title="Alterar foto"
          >
            <Camera className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
        )}
      </div>
    );
    return base;
  }, [photoPreview, userRole, editing, displayName]);

  const refreshProfile = async () => {
    try {
      if (!currentUser?.uid && !currentUser?.id) return;
      setLoadingProfile(true);
      const userId = currentUser?.uid || currentUser?.id;
      const data = await getUserById(userId);
      setProfileData(data);
      if (!editing) {
        setForm({
          name: data?.name || '',
          cpf: data?.cpf || '',
          phone: data?.phone || '',
          photoURL: data?.photoURL || ''
        });
        if (data?.photoURL) setPhotoPreview(data.photoURL);
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.uid]);

  // Carregar campos personalizados para instalador
  useEffect(() => {
    async function loadCustomFields() {
      if (userRole === 'installer') {
        const defs = await getInstallerCustomFields(currentUser?.uid || currentUser?.id);
        setCustomFields(Array.isArray(defs) ? defs : []);
        const init = {};
        defs.forEach((d) => {
          init[d.key] = (profileData && profileData[d.key]) || currentUser?.[d.key] || '';
        });
        setForm((f) => ({ ...init, ...f }));
      }
    }
    loadCustomFields();
  }, [userRole, currentUser?.uid, profileData]);

  const onPickPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Selecione uma imagem válida.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result?.toString() || '';
      setPhotoPreview(dataUrl);
      setForm((f) => ({ ...f, photoURL: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const submitEditRequest = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const updates = { name: form.name, cpf: form.cpf, phone: form.phone };
      if (form.photoURL && form.photoURL !== profileData?.photoURL && form.photoURL !== currentUser?.photoURL) {
        updates.photoURL = form.photoURL;
      }
      customFields.forEach((f) => {
        updates[f.key] = form[f.key] || '';
      });

      await createProfileChangeRequest({ userId: currentUser?.uid || currentUser?.id, updates });
      setSuccess('Solicitação enviada para aprovação do administrador.');
      setEditing(false);
    } catch (e) {
      setError('Erro ao enviar solicitação.');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Gerencie suas informações pessoais e de conta</p>
      </div>

      {/* Cartão principal */}
      <div className="card p-0 overflow-hidden">
        {/* Barra superior decorativa */}
        <div className="h-20 bg-gradient-to-r from-primary-600 to-orange-500" />

        <div className="p-6 pt-0">
          {/* Header do perfil */}
          <div className="flex items-start gap-6 -mt-10">
            {avatar}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onPickPhoto} />

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white leading-tight">
                    {editing ? (
                      <input
                        className="input-field text-base mt-1"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    ) : (
                      displayName
                    )}
                  </h2>
                </div>

                {userRole === 'installer' && (
                  <div className="flex gap-2 -mt-5">
                    {!editing ? (
                      <button
                        className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm text-gray-800 dark:text-gray-100 shadow-sm hover:shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                        onClick={() => setEditing(true)}
                      >
                        <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 to-orange-500/0 group-hover:from-primary-500/10 group-hover:to-orange-500/10 transition-colors" />
                        <Pencil className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                    ) : (
                      <>
                        <button className="btn-ghost rounded-lg" onClick={() => setEditing(false)}>
                          <X className="w-4 h-4 mr-1" /> Cancelar
                        </button>
                        <button
                          className="btn-primary rounded-lg shadow-md hover:shadow-lg"
                          onClick={submitEditRequest}
                          disabled={saving}
                        >
                          <Save className="w-4 h-4 mr-1" /> {saving ? 'Enviando...' : 'Enviar para aprovação'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Informações do usuário em seção separada */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-sm font-medium">
                  {displayRole}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{profileData?.email || currentUser?.email}</span>
              </div>

              {(success || error) && (
                <div
                  className={`mt-4 rounded-lg p-3 text-sm ${
                    success
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}
                >
                  {success || error}
                </div>
              )}
            </div>
          </div>

          {/* Conteúdo */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna 1: Pessoais */}
            <div className="col-span-1 lg:col-span-2">
              <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Informações pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome já controlado no header, mostrar espelho aqui quando não editando */}
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Nome completo</p>
                    {editing ? (
                      <input
                        className="input-field mt-1"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 dark:text-white">{displayName}</p>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">CPF</p>
                    {editing ? (
                      <input
                        className="input-field mt-1"
                        placeholder="000.000.000-00"
                        value={form.cpf}
                        onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 dark:text-white">{profileData?.cpf || currentUser?.cpf || '-'}</p>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Telefone</p>
                    {editing ? (
                      <input
                        className="input-field mt-1"
                        placeholder="(00) 00000-0000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 dark:text-white">{profileData?.phone || currentUser?.phone || '-'}</p>
                    )}
                  </div>
                </div>

                {/* Campos personalizados */}
                {userRole === 'installer' && customFields.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customFields.map((f) => (
                      <div key={f.key} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{f.label}</p>
                        {editing ? (
                          <input
                            className="input-field mt-1"
                            value={form[f.key] || ''}
                            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          />
                        ) : (
                          <p className="text-sm text-gray-900 dark:text-white">{profileData?.[f.key] || currentUser?.[f.key] || '-'}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Coluna 2: Conta */}
            <div className="col-span-1">
              <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Conta</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-sm text-gray-900 dark:text-white">{profileData?.email || currentUser?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Papel</p>
                      <p className="text-sm text-gray-900 dark:text-white">{displayRole}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ID do usuário</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 break-all">{currentUser?.uid || currentUser?.id}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
    
