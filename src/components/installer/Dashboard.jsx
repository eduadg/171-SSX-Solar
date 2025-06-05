import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getInstallerServiceRequests } from '../../services/serviceRequests';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Button, 
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TimerIcon from '@mui/icons-material/Timer';

// Componente para exibir o status da solicitação com a cor adequada
const StatusChip = ({ status }) => {
  let color = 'default';
  let label = 'Desconhecido';
  
  switch (status) {
    case 'assigned':
      color = 'info';
      label = 'Atribuído';
      break;
    case 'in_progress':
      color = 'primary';
      label = 'Em Andamento';
      break;
    case 'completed':
      color = 'success';
      label = 'Concluído';
      break;
    case 'confirmed':
      color = 'success';
      label = 'Confirmado';
      break;
    default:
      break;
  }
  
  return <Chip label={label} color={color} size="small" />;
};

export default function InstallerDashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchServiceRequests() {
      try {
        setLoading(true);
        const requests = await getInstallerServiceRequests(currentUser.uid);
        setServiceRequests(requests);
      } catch (error) {
        console.error('Error fetching service requests:', error);
        setError('Erro ao carregar solicitações de serviço.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchServiceRequests();
  }, [currentUser]);
  
  // Filtrar solicitações por status
  const assignedRequests = serviceRequests.filter(req => req.status === 'assigned');
  const inProgressRequests = serviceRequests.filter(req => req.status === 'in_progress');
  const completedRequests = serviceRequests.filter(req => req.status === 'completed' || req.status === 'confirmed');
  
  // Solicitações para hoje (que precisam ser atendidas)
  const todayRequests = [...assignedRequests, ...inProgressRequests];
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard do Instalador
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bem-vindo(a) ao seu painel de controle.
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      ) : (
        <>
          {/* Estatísticas rápidas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ mb: 1 }}>
                  <LocalShippingIcon color="info" fontSize="large" />
                </Box>
                <Typography variant="h6" gutterBottom>Atribuídos</Typography>
                <Typography variant="h3" color="info.main">{assignedRequests.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ mb: 1 }}>
                  <BuildIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6" gutterBottom>Em Andamento</Typography>
                <Typography variant="h3" color="primary.main">{inProgressRequests.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ mb: 1 }}>
                  <CheckCircleIcon color="success" fontSize="large" />
                </Box>
                <Typography variant="h6" gutterBottom>Concluídos</Typography>
                <Typography variant="h3" color="success.main">{completedRequests.length}</Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Serviços de hoje */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Serviços Para Hoje
            </Typography>
          </Box>
          
          {todayRequests.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center', mb: 4 }}>
              <Typography variant="body1" color="textSecondary">
                Você não possui serviços para realizar hoje.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/my-services"
                sx={{ mt: 2 }}
              >
                Ver Todos os Serviços
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {todayRequests.map((request) => (
                <Grid item xs={12} sm={6} md={4} key={request.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" component="div">
                          {request.equipmentType === 'solar_heater' ? 'Aquecedor Solar' : 'Aquecedor a Gás'}
                        </Typography>
                        <StatusChip status={request.status} />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TimerIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {request.status === 'assigned' ? 'Aguardando início' : 'Em progresso'}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Endereço:
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {request.address?.street}, {request.address?.number}
                        {request.address?.complement && ` - ${request.address?.complement}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {request.address?.neighborhood}, {request.address?.city} - {request.address?.state}
                      </Typography>
                      
                      {request.notes && (
                        <>
                          <Typography variant="subtitle2" sx={{ mt: 1 }}>
                            Observações:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {request.notes.length > 100 ? `${request.notes.substring(0, 100)}...` : request.notes}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        component={Link} 
                        to={`/service-details/${request.id}`}
                      >
                        Ver Detalhes
                      </Button>
                      {request.status === 'assigned' && (
                        <Button 
                          size="small" 
                          color="primary" 
                          component={Link} 
                          to={`/start-service/${request.id}`}
                        >
                          Iniciar Serviço
                        </Button>
                      )}
                      {request.status === 'in_progress' && (
                        <Button 
                          size="small" 
                          color="success" 
                          component={Link} 
                          to={`/complete-service/${request.id}`}
                        >
                          Concluir Serviço
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* Informações Úteis */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Dicas Para Instaladores
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Iniciando um Serviço
                </Typography>
                <Typography variant="body2" paragraph>
                  • Sempre verifique todos os materiais antes de ir ao local.
                </Typography>
                <Typography variant="body2" paragraph>
                  • Confirme o endereço com o cliente antes de sair.
                </Typography>
                <Typography variant="body2">
                  • Use o botão "Iniciar Serviço" ao chegar no local.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Durante a Instalação
                </Typography>
                <Typography variant="body2" paragraph>
                  • Documente cada etapa com fotos.
                </Typography>
                <Typography variant="body2" paragraph>
                  • Siga as normas técnicas de segurança.
                </Typography>
                <Typography variant="body2">
                  • Mantenha o cliente informado sobre o processo.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Concluindo o Serviço
                </Typography>
                <Typography variant="body2" paragraph>
                  • Tire fotos do trabalho finalizado.
                </Typography>
                <Typography variant="body2" paragraph>
                  • Explique ao cliente como usar o equipamento.
                </Typography>
                <Typography variant="body2">
                  • Não esqueça de clicar em "Concluir Serviço".
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </Container>
  );
} 