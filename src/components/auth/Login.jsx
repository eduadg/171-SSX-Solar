import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Avatar, 
  Alert,
  Grid,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Dados mockados para desenvolvimento rápido
const mockUsers = {
  client: {
    email: 'cliente@ssxsolar.com',
    password: '123456',
    role: 'client'
  },
  installer: {
    email: 'instalador@ssxsolar.com',
    password: '123456',
    role: 'installer'
  },
  admin: {
    email: 'admin@ssxsolar.com',
    password: '123456',
    role: 'admin'
  }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, getUserRole } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Falha ao fazer login. Verifique suas credenciais.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Função para login rápido com usuários mockados
  async function handleQuickLogin(userType) {
    const user = mockUsers[userType];
    
    try {
      setError('');
      setLoading(true);
      
      console.log(`Tentando login rápido como ${userType}:`, user);
      
      // Preencher os campos do formulário com os dados mockados
      setEmail(user.email);
      setPassword(user.password);
      
      // Simular login
      const result = await login(user.email, user.password);
      console.log('Login bem-sucedido:', result);
      
      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(`Falha ao fazer login rápido como ${userType}: ${error.message}`);
      console.error('Erro no login rápido:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
          <LockOutlinedIcon fontSize="large" />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
          SSX Solar
        </Typography>
        <Typography component="h2" variant="h5" sx={{ mb: 4 }}>
          Sistema de Gerenciamento de Instalações
        </Typography>
        
        <Grid container spacing={4}>
          {/* Formulário de login real */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography component="h2" variant="h6" gutterBottom align="center">
                Login
              </Typography>
              
              {error && <Alert severity="error" sx={{ width: '100%', mt: 2, mb: 2 }}>{error}</Alert>}
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary">
                      Esqueceu a senha?
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          {/* Acesso rápido para desenvolvimento */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography component="h2" variant="h6" gutterBottom align="center">
                Acesso Rápido (Desenvolvimento)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }} align="center">
                Clique em um dos botões abaixo para entrar rapidamente como:
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 1 }}>
                        <PersonIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">Cliente</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Email: {mockUsers.client.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Senha: {mockUsers.client.password}
                      </Typography>
                      <Button 
                        variant="contained" 
                        fullWidth
                        onClick={() => handleQuickLogin('client')}
                        disabled={loading}
                      >
                        Entrar como Cliente
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 1 }}>
                        <BuildIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">Instalador</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Email: {mockUsers.installer.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Senha: {mockUsers.installer.password}
                      </Typography>
                      <Button 
                        variant="contained" 
                        fullWidth
                        onClick={() => handleQuickLogin('installer')}
                        disabled={loading}
                      >
                        Entrar como Instalador
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 1 }}>
                        <AdminPanelSettingsIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">Administrador</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Email: {mockUsers.admin.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Senha: {mockUsers.admin.password}
                      </Typography>
                      <Button 
                        variant="contained" 
                        fullWidth
                        onClick={() => handleQuickLogin('admin')}
                        disabled={loading}
                      >
                        Entrar como Administrador
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} SSX Solar. Todos os direitos reservados.
        </Typography>
      </Box>
    </Container>
  );
}