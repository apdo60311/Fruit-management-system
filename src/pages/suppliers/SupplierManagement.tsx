import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Avatar } from '@mui/material';
import { Truck, Package, DollarSign, Star } from 'lucide-react';

function SupplierManagement() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Supplier Management
      </Typography>

      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                  <Truck size={20} />
                </Avatar>
                <Typography variant="h6">Active Suppliers</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                12
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2 pending approval
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                  <Package size={20} />
                </Avatar>
                <Typography variant="h6">Pending Orders</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Due this week
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
                <Typography variant="h6">Outstanding Payments</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                $4,250
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3 invoices pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.light', mr: 2 }}>
                  <Star size={20} />
                </Avatar>
                <Typography variant="h6">Average Rating</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                4.8
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on 45 reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Supplier Management System
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Supplier management features will be implemented here, including:
            </Typography>
            <Box component="ul" sx={{ mt: 2, pl: 2 }}>
              <li>Supplier database with contact information</li>
              <li>Purchase order generation system</li>
              <li>Outstanding payments tracking</li>
              <li>Delivery schedule management</li>
              <li>Quality rating system</li>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SupplierManagement;