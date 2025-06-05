import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';

export default function DashboardRouter() {
  const { userRole, currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    // Verificar se o usuário está logado
    if (!currentUser) {
      console.log("Usuário não autenticado, redirecionando para login");
      navigate('/login');
      return;
    }

    // Redirecionar com base no papel do usuário
    console.log("Redirecionando para dashboard com role:", userRole);
    console.log("Dados do usuário:", currentUser);

    let path = '';
    
    switch(userRole) {
      case 'client':
        path = '/client/dashboard';
        break;
      case 'installer':
        path = '/installer/dashboard';
        break;
      case 'admin':
        path = '/admin/dashboard';
        break;
      default:
        // Se o papel do usuário não for reconhecido, redirecionar para página não autorizada
        console.error("Papel de usuário desconhecido:", userRole);
        setError(`Papel de usuário não reconhecido: ${userRole}`);
        path = '/unauthorized';
        break;
    }

    setRedirectPath(path);
    
    // Pequeno atraso para garantir que os logs apareçam antes do redirecionamento
    const timer = setTimeout(() => {
      navigate(path);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [userRole, currentUser, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Redirecionando para seu dashboard ({redirectPath})...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Papel de usuário: {userRole || 'Desconhecido'}
          </Typography>
        </>
      )}
    </Box>
  );
} 