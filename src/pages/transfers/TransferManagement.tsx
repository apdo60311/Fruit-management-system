import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Avatar } from '@mui/material';
import { RefreshCw, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

function TransferManagement() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Transfer Management
      </Typography>

      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                  <RefreshCw size={20} />
                </Avatar>
                <Typography variant="h6">Active Transfers</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                3
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                  <CheckCircle2 size={20} />
                </Avatar>
                <Typography variant="h6">Completed Today</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                8
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Successfully transferred
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                  <Clock size={20} />
                </Avatar>
                <Typography variant="h6">Pending Approval</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Awaiting authorization
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'error.light', mr: 2 }}>
                  <AlertTriangle size={20} />
                </Avatar>
                <Typography variant="h6">Issues</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                1
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Requires attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Transfer Management System
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Transfer management features will be implemented here, including:
            </Typography>
            <Box component="ul" sx={{ mt: 2, pl: 2 }}>
              <li>Inter-branch transfer requests</li>
              <li>Transfer authorization workflow</li>
              <li>Real-time transfer status tracking</li>
              <li>Transfer receipt generation</li>
              <li>Automated inventory adjustment</li>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TransferManagement;