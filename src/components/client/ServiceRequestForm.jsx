import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { createServiceRequest, EQUIPMENT_TYPES } from '../../services/serviceRequests';
import { getProductsByType } from '../../services/products';
import { 
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Alert,
  CircularProgress
} from '@mui/material';

const steps = ['Tipo de Equipamento', 'Informações do Local', 'Revisão'];

export default function ServiceRequestForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { control, handleSubmit, watch, formState: { errors }, getValues } = useForm({
    defaultValues: {
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
    }
  });
  
  const equipmentType = watch('equipmentType');
  
  // Buscar produtos com base no tipo de equipamento selecionado
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const fetchedProducts = await getProductsByType(equipmentType);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Erro ao carregar produtos. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [equipmentType]);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError('');
      
      // Adicionar ID do cliente aos dados
      const serviceData = {
        ...data,
        clientId: currentUser.uid,
      };
      
      await createServiceRequest(serviceData);
      setSuccess(true);
      
      // Redirecionar após um breve delay
      setTimeout(() => {
        navigate('/service-history');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting service request:', error);
      setError('Erro ao enviar solicitação. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Selecione o Tipo de Equipamento
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="equipmentType"
                  control={control}
                  rules={{ required: 'Este campo é obrigatório' }}
                  render={({ field }) => (
                    <FormControl component="fieldset" error={!!errors.equipmentType}>
                      <FormLabel component="legend">Tipo de Equipamento</FormLabel>
                      <RadioGroup row {...field}>
                        <FormControlLabel 
                          value={EQUIPMENT_TYPES.SOLAR_HEATER} 
                          control={<Radio />} 
                          label="Aquecedor Solar" 
                        />
                        <FormControlLabel 
                          value={EQUIPMENT_TYPES.GAS_HEATER} 
                          control={<Radio />} 
                          label="Aquecedor a Gás" 
                        />
                      </RadioGroup>
                      {errors.equipmentType && (
                        <FormHelperText>{errors.equipmentType.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="productId"
                  control={control}
                  rules={{ required: 'Por favor, selecione um produto' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.productId}>
                      <TextField
                        select
                        label="Modelo do Equipamento"
                        {...field}
                        disabled={loading}
                        error={!!errors.productId}
                        helperText={errors.productId?.message}
                      >
                        {loading ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Carregando produtos...
                          </MenuItem>
                        ) : products.length === 0 ? (
                          <MenuItem disabled>
                            Nenhum produto disponível
                          </MenuItem>
                        ) : (
                          products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                              {product.name} - R$ {product.price.toFixed(2)}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Observações Adicionais"
                      multiline
                      rows={4}
                      placeholder="Informe detalhes adicionais sobre sua necessidade"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Informações do Local de Instalação
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={9}>
                <Controller
                  name="address.street"
                  control={control}
                  rules={{ required: 'Rua é obrigatória' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Rua"
                      error={!!errors.address?.street}
                      helperText={errors.address?.street?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <Controller
                  name="address.number"
                  control={control}
                  rules={{ required: 'Número é obrigatório' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Número"
                      error={!!errors.address?.number}
                      helperText={errors.address?.number?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="address.complement"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Complemento"
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="address.neighborhood"
                  control={control}
                  rules={{ required: 'Bairro é obrigatório' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Bairro"
                      error={!!errors.address?.neighborhood}
                      helperText={errors.address?.neighborhood?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="address.zipCode"
                  control={control}
                  rules={{ required: 'CEP é obrigatório' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="CEP"
                      error={!!errors.address?.zipCode}
                      helperText={errors.address?.zipCode?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={8}>
                <Controller
                  name="address.city"
                  control={control}
                  rules={{ required: 'Cidade é obrigatória' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Cidade"
                      error={!!errors.address?.city}
                      helperText={errors.address?.city?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Controller
                  name="address.state"
                  control={control}
                  rules={{ required: 'Estado é obrigatório' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Estado"
                      error={!!errors.address?.state}
                      helperText={errors.address?.state?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        const values = getValues();
        const selectedProduct = products.find(p => p.id === values.productId);
        
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Revisão da Solicitação
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Equipamento Selecionado
              </Typography>
              <Typography>
                Tipo: {values.equipmentType === EQUIPMENT_TYPES.SOLAR_HEATER ? 'Aquecedor Solar' : 'Aquecedor a Gás'}
              </Typography>
              <Typography>
                Modelo: {selectedProduct?.name || 'Não especificado'}
              </Typography>
              {selectedProduct && (
                <Typography>
                  Preço: R$ {selectedProduct.price.toFixed(2)}
                </Typography>
              )}
              {values.notes && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Observações
                  </Typography>
                  <Typography>
                    {values.notes}
                  </Typography>
                </>
              )}
            </Paper>
            
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Endereço de Instalação
              </Typography>
              <Typography>
                {values.address.street}, {values.address.number}
                {values.address.complement && ` - ${values.address.complement}`}
              </Typography>
              <Typography>
                {values.address.neighborhood}, {values.address.zipCode}
              </Typography>
              <Typography>
                {values.address.city} - {values.address.state}
              </Typography>
            </Paper>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Ao confirmar, sua solicitação será enviada para análise da nossa equipe. 
                Você receberá uma notificação assim que sua solicitação for aprovada.
              </Typography>
            </Box>
          </Box>
        );
      
      default:
        return 'Passo desconhecido';
    }
  };
  
  if (success) {
    return (
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Solicitação enviada com sucesso!
          </Alert>
          <Typography variant="h6" gutterBottom>
            Obrigado pela sua solicitação
          </Typography>
          <Typography variant="body1" paragraph>
            Sua solicitação de instalação foi recebida e está sendo processada.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Você será redirecionado para o histórico de solicitações em instantes...
          </Typography>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Solicitar Instalação
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Voltar
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Confirmar Solicitação'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Próximo
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
}