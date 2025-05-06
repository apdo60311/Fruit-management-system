import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Switch, FormControlLabel, Divider } from '@mui/material';

function Settings() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        System Settings
      </Typography>

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                General Settings
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable Notifications"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Auto-backup Data"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Dark Mode"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Real-time Updates"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Security Settings
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Two-Factor Authentication"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Session Timeout"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="IP Restriction"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Audit Logging"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Notification Preferences
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Low Stock Alerts"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Payment Reminders"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Shift Changes"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Price Updates"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                System Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Version
                  </Typography>
                  <Typography variant="body1">1.0.0</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Backup
                  </Typography>
                  <Typography variant="body1">Today, 3:30 PM</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Database Size
                  </Typography>
                  <Typography variant="body1">256 MB</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">July 15, 2025</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Settings;