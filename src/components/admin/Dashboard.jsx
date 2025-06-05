import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllServiceRequests } from '../../services/serviceRequests';
import { getAllInstallers } from '../../services/users';
import { getAllProducts } from '../../services/products';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Button, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import GroupIcon from '@mui/icons-material/Group';
import InventoryIcon from '@mui/icons-material/Inventory';

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

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [installers, setInstallers] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Carregar tudo em paralelo
        const [requestsData, installersData, productsData] = await Promise.all([
          getAllServiceRequests(),
          getAllInstallers(),
          getAllProducts()
        ]);
        
        setServiceRequests(requestsData);
        setInstallers(installersData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Erro ao carregar dados do dashboard.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Filtrar solicitações por status
  const pendingRequests = serviceRequests.filter(req => req.status === 'pending');
  const approvedRequests = serviceRequests.filter(req => req.status === 'approved');
  const assignedRequests = serviceRequests.filter(req => req.status === 'assigned');
  const inProgressRequests = serviceRequests.filter(req => req.status === 'in_progress');
  const completedRequests = serviceRequests.filter(req => req.status === 'completed');
  const confirmedRequests = serviceRequests.filter(req => req.status === 'confirmed');
  const cancelledRequests = serviceRequests.filter(req => req.status === 'cancelled');
  
  // Solicitações recentes (últimas 5)
  const recentRequests = [...serviceRequests]
    .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
    .slice(0, 5);
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard do Administrador
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Visão geral da empresa SSX Solar.
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
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ mb: 1 }}>
                  <PendingActionsIcon color="warning" fontSize="large" />
                </Box>
                <Typography variant="body1" gutterBottom>Pendentes</Typography>
                <Typography variant="h4" color="warning.main">{pendingRequests.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ mb: 1 }}>
                  <AssignmentIcon color="info" fontSize="large" />
                </Box>
                <Typography variant="body1" gutterBottom>Aprovados</Typography>
                <Typography variant="h4" color="info.main">{approvedRequests.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ mb: 1 }}>
                  <BuildIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="body1" gutterBottom>Em Andamento</Typography>
                <Typography variant="h4" color="primary.main">{assignedRequests.length + inProgressRequests.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ mb: 1 }}>
                  <CheckCircleIcon color="success" fontSize="large" />
                </Box>
                <Typography variant="body1" gutterBottom>Concluídos</Typography>
                <Typography variant="h4" color="success.main">{completedRequests.length + confirmedRequests.length}</Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Resumo e Ações */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Resumo */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resumo do Sistema
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <GroupIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          Instaladores: <strong>{installers.length}</strong>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <InventoryIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          Produtos: <strong>{products.length}</strong>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          Total de Serviços: <strong>{serviceRequests.length}</strong>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CancelIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          Cancelados: <strong>{cancelledRequests.length}</strong>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Ações Rápidas */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Ações Rápidas
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        component={Link}
                        to="/service-requests"
                        startIcon={<AssignmentIcon />}
                      >
                        Ver Solicitações
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        fullWidth
                        component={Link}
                        to="/add-installer"
                        startIcon={<PersonAddIcon />}
                      >
                        Novo Instalador
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button 
                        variant="outlined"
                        color="primary"
                        fullWidth
                        component={Link}
                        to="/add-product"
                        startIcon={<AddCircleIcon />}
                      >
                        Novo Produto
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button 
                        variant="outlined"
                        color="primary"
                        fullWidth
                        component={Link}
                        to="/reports"
                        startIcon={<AssignmentIcon />}
                      >
                        Relatórios
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Solicitações Pendentes */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Solicitações Recentes
            </Typography>
          </Box>
          
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Equipamento</TableCell>
                  <TableCell>Endereço</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhuma solicitação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  recentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        {request.createdAt ? new Date(request.createdAt.seconds * 1000).toLocaleDateString() : 'N/D'}
                      </TableCell>
                      <TableCell>{request.clientName || 'Nome não disponível'}</TableCell>
                      <TableCell>
                        {request.equipmentType === 'solar_heater' ? 'Aquecedor Solar' : 'Aquecedor a Gás'}
                      </TableCell>
                      <TableCell>
                        {request.address?.city}, {request.address?.state}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={request.status} />
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          component={Link} 
                          to={`/service-details/${request.id}`}
                        >
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ textAlign: 'center' }}>
            <Button 
              variant="contained" 
              component={Link} 
              to="/service-requests"
            >
              Ver Todas as Solicitações
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
} 