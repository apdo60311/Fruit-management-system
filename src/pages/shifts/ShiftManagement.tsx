import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Avatar } from '@mui/material';
import { Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react';

function ShiftManagement() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Shift Management
      </Typography>

      <Grid container spacing={3}>
        {/* Shift Overview Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                  <Clock size={20} />
                </Avatar>
                <Typography variant="h6">Current Shift</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                Morning
              </Typography>
              <Typography variant="body2" color="text.secondary">
                6:00 AM - 2:00 PM
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                  <Users size={20} />
                </Avatar>
                <Typography variant="h6">Staff On Duty</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                4
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Out of 5 scheduled
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                  <CheckCircle2 size={20} />
                </Avatar>
                <Typography variant="h6">Completed Tasks</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                12
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3 remaining
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'error.light', mr: 2 }}>
                  <AlertCircle size={20} />
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
              Current Shift Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Shift management features will be implemented here, including:
            </Typography>
            <Box component="ul" sx={{ mt: 2, pl: 2 }}>
              <li>Digital clock-in/clock-out system</li>
              <li>Real-time employee attendance tracking</li>
              <li>Shift schedule planning</li>
              <li>Automated shift reports</li>
              <li>Shift handover documentation</li>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ShiftManagement;