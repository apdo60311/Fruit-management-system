import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Avatar } from '@mui/material';
import { BarChart2, TrendingUp, DollarSign, Users } from 'lucide-react';

function Reports() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Reports & Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                  <BarChart2 size={20} />
                </Avatar>
                <Typography variant="h6">Total Reports</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                24
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generated this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                  <TrendingUp size={20} />
                </Avatar>
                <Typography variant="h6">Growth Rate</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                15%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Compared to last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                  <DollarSign size={20} />
                </Avatar>
                <Typography variant="h6">Revenue</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                $45K
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly average
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.light', mr: 2 }}>
                  <Users size={20} />
                </Avatar>
                <Typography variant="h6">Customer Base</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                520
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Reporting System
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Reporting features will be implemented here, including:
            </Typography>
            <Box component="ul" sx={{ mt: 2, pl: 2 }}>
              <li>Daily/weekly/monthly financial reports</li>
              <li>Inventory movement analysis</li>
              <li>Employee performance metrics</li>
              <li>Profit/loss analysis</li>
              <li>Sales trends visualization</li>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports;