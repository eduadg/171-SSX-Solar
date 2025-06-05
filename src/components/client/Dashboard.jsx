import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getClientServiceRequests } from '../../services/serviceRequests';
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
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';

// Componente para exibir o status da solicitação com a cor adequada
const StatusChip = ({ status }) => {
  let color = 'default';
  let label = 'Desconhecido';
  
  switch (status) {
    case 'pending':
      color = 'warning';
      label = 'Pendente';
      break;
    case 'approved':
      color = 'info';
      label = 'Aprovado';
      break;
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
    case 'cancelled':
      color = 'error';
      label = 'Cancelado';
      break;
    default:
      break;
  }
  
  return <Chip label={label} color={color} size="small" />;
};

export default function ClientDashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchServiceRequests() {
      try {
        setLoading(true);
        const requests = await getClientServiceRequests(currentUser.uid);
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
  
  // Filtra as solicitações recentes (últimas 5)
  const recentRequests = serviceRequests.slice(0, 5);
  
  // Conta solicitações por status
  const pendingCount = serviceRequests.filter(req => req.status === 'pending' || req.status === 'approved').length;
  const inProgressCount = serviceRequests.filter(req => req.status === 'assigned' || req.status === 'in_progress').length;
  const completedCount = serviceRequests.filter(req => req.status === 'completed').length;
  const needsConfirmationCount = serviceRequests.filter(req => req.status === 'completed').length;
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard do Cliente
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
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" gutterBottom>Pendentes</Typography>
                <Typography variant="h3" color="text.secondary">{pendingCount}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" gutterBottom>Em Andamento</Typography>
                <Typography variant="h3" color="primary">{inProgressCount}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" gutterBottom>Concluídos</Typography>
                <Typography variant="h3" color="success.main">{completedCount}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: needsConfirmationCount > 0 ? 'warning.light' : '' }}>
                <Typography variant="h6" gutterBottom>Aguardando Confirmação</Typography>
                <Typography variant="h3" color={needsConfirmationCount > 0 ? 'warning.dark' : 'text.secondary'}>{needsConfirmationCount}</Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Ações rápidas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Ações Rápidas
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button 
                      variant="contained" 
                      component={Link} 
                      to="/request-service"
                      startIcon={<AddIcon />}
                      fullWidth
                    >
                      Solicitar Serviço
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button 
                      variant="outlined" 
                      component={Link} 
                      to="/service-history"
                      startIcon={<HistoryIcon />}
                      fullWidth
                    >
                      Histórico
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Dicas Rápidas
                </Typography>
                <Typography variant="body2" paragraph>
                  • Para solicitar um novo serviço, clique em "Solicitar Serviço".
                </Typography>
                <Typography variant="body2" paragraph>
                  • Após a conclusão de um serviço, é necessário confirmar a instalação.
                </Typography>
                <Typography variant="body2">
                  • Você pode acompanhar o status de todas as suas solicitações no "Histórico de Serviços".
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Solicitações recentes */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Solicitações Recentes
            </Typography>
          </Box>
          
          {recentRequests.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                Você ainda não possui solicitações de serviço.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/request-service"
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
              >
                Solicitar Serviço
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {recentRequests.map((request) => (
                <Grid item xs={12} sm={6} md={4} key={request.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" component="div">
                          {request.equipmentType === 'solar_heater' ? 'Aquecedor Solar' : 'Aquecedor a Gás'}
                        </Typography>
                        <StatusChip status={request.status} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Solicitado em: {request.createdAt ? new Date(request.createdAt.seconds * 1000).toLocaleDateString() : 'Data não disponível'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {request.address?.street}, {request.address?.number}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {request.address?.city} - {request.address?.state}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" component={Link} to={`/service-details/${request.id}`}>
                        Ver Detalhes
                      </Button>
                      {request.status === 'completed' && (
                        <Button size="small" color="success" component={Link} to={`/confirm-service/${request.id}`}>
                          Confirmar Conclusão
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          
          {serviceRequests.length > 5 && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button 
                variant="outlined" 
                component={Link} 
                to="/service-history"
              >
                Ver Todas as Solicitações
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
} 