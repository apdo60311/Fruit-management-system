import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';

import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Inventory from './pages/inventory/Inventory';
import FinancialManagement from './pages/financial/FinancialManagement';
import ShiftManagement from './pages/shifts/ShiftManagement';
import SupplierManagement from './pages/suppliers/SupplierManagement';
import TransferManagement from './pages/transfers/TransferManagement';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';
import useAuthStore from './stores/authStore';

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  // Check authentication on app load
  useEffect(() => {
    const initApp = async () => {
      try {
        // Check if we're running in Electron
        const isElectron = window.electronAPI !== undefined;
        
        if (isElectron) {
          // Get app version
          const version = await window.electronAPI.getAppVersion();
          console.log(`App version: ${version}`);
          
          // Check authentication
          await checkAuth();
        } else {
          // For development in browser
          console.log('Running in browser mode');
          setTimeout(() => checkAuth(), 1000);
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        enqueueSnackbar('Failed to initialize the application', { 
          variant: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, [checkAuth, enqueueSnackbar]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(to right, #3B82F6, #10B981)',
        }}
      >
        <img 
          src="/logo.svg" 
          alt="Fruit Store Manager" 
          style={{ 
            width: 120, 
            height: 120,
            animation: 'pulse 1.5s infinite'
          }} 
        />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/financial" element={<FinancialManagement />} />
          <Route path="/shifts" element={<ShiftManagement />} />
          <Route path="/suppliers" element={<SupplierManagement />} />
          <Route path="/transfers" element={<TransferManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;