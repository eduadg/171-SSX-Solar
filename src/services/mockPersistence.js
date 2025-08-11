// Sistema de persistência para dados mock durante a sessão
// Simula um banco de dados local que será transferível para Firebase real

class MockPersistence {
  constructor() {
    this.storageKey = 'ssx_mock_data';
    this.init();
  }

  init() {
    // Inicializar dados base se não existirem
    if (!this.hasData()) {
      this.resetData();
    }
  }

  hasData() {
    // Preferir localStorage para persistir entre abas; manter compat com sessionStorage
    return !!localStorage.getItem(this.storageKey) || !!sessionStorage.getItem(this.storageKey);
  }

  getData() {
    try {
      // Migração automática de sessionStorage -> localStorage se necessário
      const local = localStorage.getItem(this.storageKey);
      const session = sessionStorage.getItem(this.storageKey);
      if (!local && session) {
        localStorage.setItem(this.storageKey, session);
        sessionStorage.removeItem(this.storageKey);
        console.log('🔁 [MOCK PERSISTENCE] Migrado de sessionStorage para localStorage');
      }
      const source = localStorage.getItem(this.storageKey);
      return source ? JSON.parse(source) : this.getDefaultData();
    } catch (error) {
      console.warn('⚠️ [MOCK PERSISTENCE] Erro ao carregar dados:', error);
      return this.getDefaultData();
    }
  }

  setData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      console.log('💾 [MOCK PERSISTENCE] Dados salvos:', Object.keys(data).map(key => `${key}: ${Array.isArray(data[key]) ? data[key].length : (typeof data[key] === 'object' ? Object.keys(data[key]).length : '-')}`));
    } catch (error) {
      console.error('❌ [MOCK PERSISTENCE] Erro ao salvar dados:', error);
    }
  }

  getDefaultData() {
    return {
      serviceRequests: [
        {
          id: 'req-001',
          clientId: 'client-123',
          clientName: 'Cliente Teste',
          clientEmail: 'cliente@ssxsolar.com',
          equipmentType: 'solar_heater',
          productId: 'prod-001',
          status: 'pending',
          address: {
            street: 'Rua das Flores',
            number: '123',
            complement: 'Apto 45',
            neighborhood: 'Vila Madalena',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '05427-001'
          },
          notes: 'Instalação residencial - Prédio com 4 andares, apartamento no 2º andar',
          priority: 'normal',
          createdAt: { seconds: Math.floor(Date.now()/1000) - 86400 }, // 1 dia atrás
          updatedAt: { seconds: Math.floor(Date.now()/1000) - 86400 },
        },
        {
          id: 'req-002',
          clientId: 'client-123',
          clientName: 'Cliente Teste',
          clientEmail: 'cliente@ssxsolar.com',
          equipmentType: 'solar_heater',
          productId: 'prod-002',
          status: 'in_progress',
          address: {
            street: 'Rua das Flores',
            number: '123',
            complement: 'Apto 45',
            neighborhood: 'Vila Madalena',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '05427-001'
          },
          notes: 'Manutenção preventiva - Sistema instalado há 2 anos',
          priority: 'high',
          installerId: 'installer-123',
          installerName: 'Instalador Teste',
          createdAt: { seconds: Math.floor(Date.now()/1000) - 172800 }, // 2 dias atrás
          updatedAt: { seconds: Math.floor(Date.now()/1000) - 3600 }, // 1 hora atrás
          startedAt: { seconds: Math.floor(Date.now()/1000) - 3600 },
        },
        {
          id: 'req-003',
          clientId: 'client-123',
          clientName: 'Cliente Teste',
          clientEmail: 'cliente@ssxsolar.com',
          equipmentType: 'gas_heater',
          productId: 'prod-003',
          status: 'completed',
          address: {
            street: 'Av. Paulista',
            number: '456',
            complement: '',
            neighborhood: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01310-100'
          },
          notes: 'Substituição de aquecedor antigo - Cliente satisfeito',
          priority: 'normal',
          installerId: 'installer-123',
          installerName: 'Instalador Teste',
          createdAt: { seconds: Math.floor(Date.now()/1000) - 259200 }, // 3 dias atrás
          updatedAt: { seconds: Math.floor(Date.now()/1000) - 86400 }, // 1 dia atrás
          startedAt: { seconds: Math.floor(Date.now()/1000) - 172800 }, // 2 dias atrás
          completedAt: { seconds: Math.floor(Date.now()/1000) - 86400 }, // 1 dia atrás
          technicalNotes: 'Instalação concluída com sucesso. Sistema testado e funcionando perfeitamente.',
          images: [
            { url: 'https://picsum.photos/800/600?random=1', uploadedAt: { seconds: Math.floor(Date.now()/1000) - 86400 } },
            { url: 'https://picsum.photos/800/600?random=2', uploadedAt: { seconds: Math.floor(Date.now()/1000) - 86400 } }
          ]
        },
        // Dados para outros usuários para demonstrar o sistema completo
        {
          id: 'req-004',
          clientId: 'client-456',
          clientName: 'Maria Santos',
          clientEmail: 'maria@cliente.com',
          equipmentType: 'solar_heater',
          productId: 'prod-005',
          status: 'assigned',
          address: {
            street: 'Rua dos Jardins',
            number: '789',
            complement: 'Casa',
            neighborhood: 'Jardim Paulista',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567'
          },
          notes: 'Casa térrea com boa exposição solar',
          priority: 'normal',
          installerId: 'installer-123',
          installerName: 'Instalador Teste',
          createdAt: { seconds: Math.floor(Date.now()/1000) - 86400 },
          updatedAt: { seconds: Math.floor(Date.now()/1000) - 7200 },
        },
        {
          id: 'req-005',
          clientId: 'client-789',
          clientName: 'João Silva',
          clientEmail: 'joao@cliente.com',
          equipmentType: 'gas_heater',
          productId: 'prod-003',
          status: 'approved',
          address: {
            street: 'Av. Brigadeiro Faria Lima',
            number: '1000',
            complement: 'Conjunto 101',
            neighborhood: 'Itaim Bibi',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '04538-132'
          },
          notes: 'Escritório comercial - Instalação urgente',
          priority: 'high',
          createdAt: { seconds: Math.floor(Date.now()/1000) - 43200 },
          updatedAt: { seconds: Math.floor(Date.now()/1000) - 43200 },
        }
      ],
      users: [
        {
          id: 'client-123',
          uid: 'client-123',
          email: 'cliente@ssxsolar.com',
          name: 'Cliente Teste',
          role: 'client',
          phone: '(11) 99999-9999',
          address: 'Rua das Flores, 123 - Vila Madalena, São Paulo, SP',
          cpf: '123.456.789-10',
          createdAt: { seconds: Math.floor(Date.now()/1000) - 2592000 },
          updatedAt: { seconds: Math.floor(Date.now()/1000) - 86400 },
        },
        {
          id: 'installer-123',
          uid: 'installer-123',
          email: 'instalador@ssxsolar.com',
          name: 'Instalador Teste',
          role: 'installer',
          phone: '(11) 88888-8888',
          specializations: ['solar_heater', 'gas_heater'],
          experience: '5 anos',
          region: 'São Paulo - Zona Sul',
          createdAt: { seconds: Math.floor(Date.now()/1000) - 5184000 },
          updatedAt: { seconds: Math.floor(Date.now()/1000) - 172800 },
        },
        {
          id: 'admin-123',
          uid: 'admin-123',
          email: 'admin@ssxsolar.com',
          name: 'Administrador Teste',
          role: 'admin',
          phone: '(11) 77777-7777',
          permissions: ['all'],
          createdAt: { seconds: Math.floor(Date.now()/1000) - 7776000 },
          updatedAt: { seconds: Math.floor(Date.now()/1000) - 259200 },
        }
      ],
      // Solicitações de alteração de perfil (aprovadas pelo admin)
      profileChangeRequests: [],
      // Definições de campos personalizados por instalador
      installerFieldDefinitions: {}
    };
  }

  resetData() {
    const defaultData = this.getDefaultData();
    this.setData(defaultData);
    console.log('🔄 [MOCK PERSISTENCE] Dados resetados para valores padrão');
    return defaultData;
  }

  // Métodos para Service Requests
  getServiceRequests() {
    const requests = this.getData().serviceRequests || [];
    console.log('🟦 [MOCK PERSISTENCE] getServiceRequests retornou', requests.length, 'solicitações:', requests.map(r => r.id));
    return requests;
  }

  addServiceRequest(request) {
    const data = this.getData();
    const newRequest = {
      ...request,
      id: `req-${Date.now()}`,
      createdAt: { seconds: Math.floor(Date.now()/1000) },
      updatedAt: { seconds: Math.floor(Date.now()/1000) }
    };
    
    data.serviceRequests.push(newRequest);
    this.setData(data);
    
    console.log('➕ [MOCK PERSISTENCE] Nova solicitação adicionada:', newRequest.id);
    return newRequest;
  }

  updateServiceRequest(id, updates) {
    const data = this.getData();
    const index = data.serviceRequests.findIndex(req => req.id === id);
    
    if (index !== -1) {
      data.serviceRequests[index] = {
        ...data.serviceRequests[index],
        ...updates,
        updatedAt: { seconds: Math.floor(Date.now()/1000) }
      };
      this.setData(data);
      console.log('📝 [MOCK PERSISTENCE] Solicitação atualizada:', id);
      return data.serviceRequests[index];
    }
    
    throw new Error('Service request not found');
  }

  getServiceRequestById(id) {
    const requests = this.getServiceRequests();
    return requests.find(req => req.id === id);
  }

  getServiceRequestsByClientId(clientId) {
    const requests = this.getServiceRequests();
    return requests.filter(req => req.clientId === clientId);
  }

  getServiceRequestsByInstallerId(installerId) {
    const requests = this.getServiceRequests();
    return requests.filter(req => req.installerId === installerId);
  }

  // Métodos para Users
  getUsers() {
    return this.getData().users || [];
  }

  getUserById(id) {
    const users = this.getUsers();
    return users.find(user => user.id === id || user.uid === id);
  }

  // Atualizar usuário (merge)
  updateUser(id, updates) {
    const data = this.getData();
    const idx = data.users.findIndex(u => u.id === id || u.uid === id);
    if (idx === -1) throw new Error('User not found');
    data.users[idx] = {
      ...data.users[idx],
      ...updates,
      updatedAt: { seconds: Math.floor(Date.now()/1000) }
    };
    this.setData(data);
    return data.users[idx];
  }

  // Definições de campos personalizados por instalador
  getInstallerFieldDefinitions(installerId) {
    const data = this.getData();
    const defs = data.installerFieldDefinitions || {};
    return defs[installerId] || [];
  }

  setInstallerFieldDefinitions(installerId, fields) {
    const data = this.getData();
    if (!data.installerFieldDefinitions) data.installerFieldDefinitions = {};
    data.installerFieldDefinitions[installerId] = Array.isArray(fields) ? fields : [];
    this.setData(data);
    return data.installerFieldDefinitions[installerId];
  }

  // Solicitações de alteração de perfil
  getProfileChangeRequests(status) {
    const list = this.getData().profileChangeRequests || [];
    if (!status) return list;
    return list.filter(r => r.status === status);
  }

  addProfileChangeRequest(request) {
    const data = this.getData();
    const newReq = {
      id: `pcr-${Date.now()}`,
      status: 'pending',
      createdAt: { seconds: Math.floor(Date.now()/1000) },
      updatedAt: { seconds: Math.floor(Date.now()/1000) },
      ...request,
    };
    data.profileChangeRequests.push(newReq);
    this.setData(data);
    return newReq;
  }

  updateProfileChangeRequest(id, updates) {
    const data = this.getData();
    const idx = data.profileChangeRequests.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Request not found');
    data.profileChangeRequests[idx] = {
      ...data.profileChangeRequests[idx],
      ...updates,
      updatedAt: { seconds: Math.floor(Date.now()/1000) }
    };
    this.setData(data);
    return data.profileChangeRequests[idx];
  }

  approveProfileChangeRequest(id) {
    const data = this.getData();
    const idx = data.profileChangeRequests.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Request not found');
    const req = data.profileChangeRequests[idx];
    // aplicar atualizações no usuário
    const userIdx = data.users.findIndex(u => u.id === req.userId || u.uid === req.userId);
    if (userIdx !== -1) {
      data.users[userIdx] = {
        ...data.users[userIdx],
        ...req.updates,
        updatedAt: { seconds: Math.floor(Date.now()/1000) }
      };
    }
    // marcar como aprovado
    data.profileChangeRequests[idx] = {
      ...req,
      status: 'approved',
      updatedAt: { seconds: Math.floor(Date.now()/1000) }
    };
    this.setData(data);
    return data.profileChangeRequests[idx];
  }

  rejectProfileChangeRequest(id, reason = '') {
    const data = this.getData();
    const idx = data.profileChangeRequests.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Request not found');
    const req = data.profileChangeRequests[idx];
    data.profileChangeRequests[idx] = {
      ...req,
      status: 'rejected',
      rejectionReason: reason,
      updatedAt: { seconds: Math.floor(Date.now()/1000) }
    };
    this.setData(data);
    return data.profileChangeRequests[idx];
  }

  // Método para limpar todos os dados (útil para testes)
  clearAll() {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey);
    console.log('🗑️ [MOCK PERSISTENCE] Todos os dados removidos');
  }

  // Método para exportar dados (útil para migração)
  exportData() {
    const data = this.getData();
    console.log('📤 [MOCK PERSISTENCE] Exportando dados:', data);
    return data;
  }

  // Método para importar dados
  importData(data) {
    this.setData(data);
    console.log('📥 [MOCK PERSISTENCE] Dados importados com sucesso');
  }
}

// Instância singleton
const mockPersistence = new MockPersistence();

export default mockPersistence; 