import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { User, Lock, Eye, EyeOff, Store } from 'lucide-react';
import useAuthStore from '../../stores/authStore';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await login(values.username, values.password);
      // No need to navigate here as the App component will handle redirection based on auth state
    },
  });
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #3B82F6 30%, #10B981 90%)',
      }}
    >
      <Grid container sx={{ height: '100%' }}>
        {/* Left side - Login Form */}
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <Box
            sx={{
              px: 4,
              py: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '450px',
              mx: 'auto',
              width: '100%',
            }}
          >
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Store size={40} color="#3B82F6" />
              <Typography
                component="h1"
                variant="h4"
                fontWeight="bold"
                color="primary"
                sx={{ ml: 1 }}
              >
                Fruit Store Manager
              </Typography>
            </Box>
            
            <Typography component="h2" variant="h5" sx={{ mt: 2, mb: 1 }}>
              Sign in to your account
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Enter your credentials to access the management system
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                fullWidth
                id="username"
                name="username"
                label="Username"
                autoComplete="username"
                autoFocus
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={20} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 4, mb: 2, py: 1.5 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
              
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                For development, use: admin / password
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        {/* Right side - Image */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', sm: 'block' },
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 4,
              color: 'white',
            }}
          >
            <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
              Fruit Store Management System
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: '600px', textAlign: 'center', mb: 4 }}>
              Streamline operations, boost efficiency, and grow your business with our comprehensive management solution
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;