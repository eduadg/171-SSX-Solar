import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createServiceRequest, EQUIPMENT_TYPES } from '../../services/serviceRequests';
import { getProductsByType } from '../../services/products';
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  MapPin,
  Package,
  FileText,
  Loader2,
  Zap,
  Flame
} from 'lucide-react';

const steps = [
  { id: 0, title: 'Tipo de Equipamento', description: 'Escolha o equipamento desejado' },
  { id: 1, title: 'Informações do Local', description: 'Endereço da instalação' },
  { id: 2, title: 'Revisão', description: 'Confirme os dados' }
];

export default function ServiceRequestForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    equipmentType: 'solar_heater',
    productId: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    notes: '',
  });
  
  // Buscar produtos com base no tipo de equipamento selecionado
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError('');
        console.log('🔄 [SERVICE REQUEST] Buscando produtos do tipo:', formData.equipmentType);
        
        const fetchedProducts = await getProductsByType(formData.equipmentType);
        console.log('✅ [SERVICE REQUEST] Produtos recebidos:', fetchedProducts);
        
        // Garantir que products seja sempre um array
        if (Array.isArray(fetchedProducts)) {
          setProducts(fetchedProducts);
        } else {
          console.warn('⚠️ [SERVICE REQUEST] Produtos não são um array:', fetchedProducts);
          setProducts([]);
        }
      } catch (error) {
        console.error('❌ [SERVICE REQUEST] Erro ao carregar produtos:', error);
        setError('Erro ao carregar produtos. Por favor, tente novamente.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [formData.equipmentType]);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.equipmentType && formData.productId;
      case 1:
        return formData.address.street && formData.address.number && 
               formData.address.neighborhood && formData.address.city && 
               formData.address.state && formData.address.zipCode;
      default:
        return true;
    }
  };
  
  const onSubmit = async () => {
    try {
      console.log('📝 [SERVICE REQUEST FORM] Iniciando submissão...');
      console.log('📋 [SERVICE REQUEST FORM] Dados do formulário:', formData);
      console.log('👤 [SERVICE REQUEST FORM] Usuário atual:', currentUser);
      
      setSubmitting(true);
      setError('');
      
      // Adicionar ID do cliente aos dados
      const serviceData = {
        ...formData,
        clientId: currentUser.uid,
        clientEmail: currentUser.email,
      };
      
      console.log('📋 [SERVICE REQUEST FORM] Dados completos para envio:', serviceData);
      
      const result = await createServiceRequest(serviceData);
      console.log('✅ [SERVICE REQUEST FORM] Solicitação criada com sucesso:', result);
      
      setSuccess(true);
      
      // Redirecionar após um breve delay
      setTimeout(() => {
        console.log('🔄 [SERVICE REQUEST FORM] Redirecionando para /service-history...');
        navigate('/service-history');
      }, 2000);
      
    } catch (error) {
      console.error('❌ [SERVICE REQUEST FORM] Erro ao enviar solicitação:', error);
      setError('Erro ao enviar solicitação. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Selecione o Tipo de Equipamento
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div 
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.equipmentType === 'solar_heater' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleInputChange('equipmentType', 'solar_heater')}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      formData.equipmentType === 'solar_heater' 
                        ? 'bg-primary-100 dark:bg-primary-800' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Zap className={`w-6 h-6 ${
                        formData.equipmentType === 'solar_heater' 
                          ? 'text-primary-600 dark:text-primary-400' 
                          : 'text-gray-500'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Aquecedor Solar</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Energia renovável e sustentável</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.equipmentType === 'gas_heater' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleInputChange('equipmentType', 'gas_heater')}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      formData.equipmentType === 'gas_heater' 
                        ? 'bg-primary-100 dark:bg-primary-800' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Flame className={`w-6 h-6 ${
                        formData.equipmentType === 'gas_heater' 
                          ? 'text-primary-600 dark:text-primary-400' 
                          : 'text-gray-500'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Aquecedor a Gás</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Aquecimento rápido e eficiente</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Modelo do Equipamento
              </label>
              {loading ? (
                <div className="flex items-center justify-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <Loader2 className="w-6 h-6 text-primary-600 animate-spin mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Carregando produtos...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8 border-2 border-dashed border-red-300 dark:border-red-600 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
                  <span className="text-red-600 dark:text-red-400">{error}</span>
                </div>
              ) : (
                <select
                  value={formData.productId}
                  onChange={(e) => handleInputChange('productId', e.target.value)}
                  className="input-field"
                >
                  <option value="">Selecione um produto</option>
                  {Array.isArray(products) && products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - R$ {product.price?.toFixed(2)}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações Adicionais
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="input-field"
                placeholder="Informe detalhes adicionais sobre sua necessidade"
              />
            </div>
          </div>
        );
        
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                Informações do Local da Instalação
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rua/Avenida *
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className="input-field"
                  placeholder="Nome da rua"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número *
                </label>
                <input
                  type="text"
                  value={formData.address.number}
                  onChange={(e) => handleInputChange('address.number', e.target.value)}
                  className="input-field"
                  placeholder="123"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Complemento
              </label>
              <input
                type="text"
                value={formData.address.complement}
                onChange={(e) => handleInputChange('address.complement', e.target.value)}
                className="input-field"
                placeholder="Apartamento, casa, bloco, etc."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bairro *
                </label>
                <input
                  type="text"
                  value={formData.address.neighborhood}
                  onChange={(e) => handleInputChange('address.neighborhood', e.target.value)}
                  className="input-field"
                  placeholder="Nome do bairro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CEP *
                </label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  className="input-field"
                  placeholder="00000-000"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className="input-field"
                  placeholder="Nome da cidade"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado *
                </label>
                <select
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  className="input-field"
                >
                  <option value="">Selecione o estado</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="PR">Paraná</option>
                  <option value="SC">Santa Catarina</option>
                  {/* Adicione outros estados conforme necessário */}
                </select>
              </div>
            </div>
          </div>
        );
        
      case 2: {
        const selectedProduct = products.find(p => p.id === formData.productId);
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-600" />
                Revisão da Solicitação
              </h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Equipamento */}
              <div className="card p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Equipamento Selecionado
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tipo:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formData.equipmentType === 'solar_heater' ? 'Aquecedor Solar' : 'Aquecedor a Gás'}
                    </p>
                  </div>
                  {selectedProduct && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Modelo:</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedProduct.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Preço:</p>
                        <p className="font-medium text-green-600">R$ {selectedProduct.price?.toFixed(2)}</p>
                      </div>
                    </>
                  )}
                  {formData.notes && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Observações:</p>
                      <p className="text-sm text-gray-900 dark:text-white">{formData.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Endereço */}
              <div className="card p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Local da Instalação
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formData.address.street}, {formData.address.number}
                    {formData.address.complement && ` - ${formData.address.complement}`}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formData.address.neighborhood}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formData.address.city} - {formData.address.state}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    CEP: {formData.address.zipCode}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                    Próximos Passos
                  </h5>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Após enviar sua solicitação, nossa equipe irá analisá-la e entrar em contato 
                    em até 24 horas para agendar uma visita técnica gratuita.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }
        
      default:
        return 'Etapa desconhecida';
    }
  };
  
  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Solicitação Enviada com Sucesso!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sua solicitação foi recebida e está sendo processada. Nossa equipe entrará em contato em breve.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Redirecionando para o histórico...
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Solicitar Instalação
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Preencha os dados abaixo para solicitar a instalação do seu equipamento
        </p>
      </div>
      
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index <= activeStep 
                  ? 'bg-primary-600 border-primary-600 text-white' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                {index < activeStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-0.5 ml-4 ${
                  index < activeStep ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 text-center">
              <p className={`text-sm font-medium ${
                index <= activeStep ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}
      
      {/* Form Content */}
      <div className="card p-8 mb-8">
        {getStepContent(activeStep)}
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={activeStep === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate('/client/dashboard')}
            className="btn-ghost"
          >
            Cancelar
          </button>
          
          {activeStep === steps.length - 1 ? (
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Enviar Solicitação</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!validateStep(activeStep)}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>Próximo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}