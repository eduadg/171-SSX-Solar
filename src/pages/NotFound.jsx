import { Link } from 'react-router-dom';
import { Container, Typography, Button, Paper, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 10, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <ErrorOutlineIcon color="error" style={{ fontSize: 60 }} />
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Página Não Encontrada
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          A página que você está procurando não existe ou foi movida.
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