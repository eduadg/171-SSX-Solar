import { Link } from 'react-router-dom';
import { Container, Typography, Button, Paper, Box } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';

export default function Unauthorized() {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 10, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <BlockIcon color="error" style={{ fontSize: 60 }} />
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Acesso Não Autorizado
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Você não tem permissão para acessar esta página.
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/dashboard"
          sx={{ mt: 2 }}
        >
          Voltar ao Dashboard
        </Button>
      </Paper>
    </Container>
  );
} 