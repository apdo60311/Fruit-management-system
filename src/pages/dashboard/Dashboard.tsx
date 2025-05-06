import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Badge from '@mui/material/Badge';
import Skeleton from '@mui/material/Skeleton';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  AlertCircle,
  Clock,
  RefreshCw,
  BarChart2,
  ChevronRight,
  ArrowRight,
  Store,
  ShoppingCart,
  Truck,
  Bell,
  CheckCircle2
} from 'lucide-react';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Mock data
const salesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Sales',
      data: [12000, 19000, 14000, 22000, 24000, 18000, 29000],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const inventoryData = {
  labels: ['Apples', 'Oranges', 'Bananas', 'Grapes', 'Berries'],
  datasets: [
    {
      label: 'Stock Level',
      data: [65, 42, 80, 55, 38],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#8B5CF6',
        '#EC4899'
      ],
      borderWidth: 0,
    },
  ],
};

const salesBranchData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Main Branch',
      data: [5000, 6200, 7800, 4500, 7000, 9500, 8000],
      backgroundColor: '#3B82F6',
    },
    {
      label: 'Secondary Branch',
      data: [4200, 3800, 5500, 3000, 4800, 6700, 5500],
      backgroundColor: '#10B981',
    },
  ],
};

const Dashboard = () => {
  const [branchTab, setBranchTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleBranchTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setBranchTab(newValue);
  };

  const LoadingSkeleton = () => (
    <Box sx={{ py: 3 }}>
      <Skeleton variant="rectangular" width="40%" height={40} sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Grid>
      </Grid>
    </Box>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Box sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 4, 
        gap: 2 
      }}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<RefreshCw size={18} />}
          onClick={() => setIsLoading(true)}
          sx={{ minWidth: 120 }}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Branch selector tabs */}
      <Box sx={{ mb: 4, width: '100%', overflowX: 'auto' }}>
        <Tabs 
          value={branchTab} 
          onChange={handleBranchTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
            },
          }}
        >
          <Tab 
            icon={<Store size={18} />} 
            iconPosition="start" 
            label="All Branches" 
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.95rem',
              minHeight: 48,
            }} 
          />
          <Tab 
            icon={<Badge color="success" variant="dot" sx={{ '& .MuiBadge-badge': { right: -4 } }}>
              <Store size={18} />
            </Badge>} 
            iconPosition="start" 
            label="Main Branch" 
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.95rem',
              minHeight: 48,
            }} 
          />
          <Tab 
            icon={<Badge color="error" variant="dot" sx={{ '& .MuiBadge-badge': { right: -4 } }}>
              <Store size={18} />
            </Badge>} 
            iconPosition="start" 
            label="Secondary Branch" 
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.95rem',
              minHeight: 48,
            }} 
          />
        </Tabs>
      </Box>

      {/* Key metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: 'primary.main' }}>
                  <DollarSign size={20} />
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp size={16} color="#10B981" />
                  <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                    +12.5%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h5" fontWeight="bold">
                $28,950
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Sales Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: 'secondary.main' }}>
                  <Package size={20} />
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingDown size={16} color="#EF4444" />
                  <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                    -3.2%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h5" fontWeight="bold">
                1,482
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items in Stock
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: 'warning.main' }}>
                  <Users size={20} />
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp size={16} color="#10B981" />
                  <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                    +5.8%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h5" fontWeight="bold">
                385
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: 'error.main' }}>
                  <AlertCircle size={20} />
                </Avatar>
                <Chip 
                  label="3 Critical" 
                  size="small" 
                  color="error" 
                  sx={{ height: 24 }}
                />
              </Box>
              <Typography variant="h5" fontWeight="bold">
                8 Alerts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Require Attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card elevation={0} sx={{ 
            borderRadius: 2,
            height: '100%',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                mb: 3,
                gap: 2
              }}>
                <Typography variant="h6" fontWeight="600">
                  Sales Overview
                </Typography>
                <Button
                  endIcon={<ArrowRight size={16} />}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  Detailed Report
                </Button>
              </Box>
              <Box sx={{ height: { xs: '250px', sm: '300px' } }}>
                <Line
                  data={salesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)',
                        },
                        ticks: {
                          callback: (value) => `$${value / 1000}k`,
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card elevation={0} sx={{ 
            borderRadius: 2,
            height: '100%',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                mb: 3,
                gap: 2
              }}>
                <Typography variant="h6" fontWeight="600">
                  Inventory Status
                </Typography>
                <Button
                  endIcon={<ArrowRight size={16} />}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ 
                height: { xs: '250px', sm: '300px' }, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <Doughnut
                  data={inventoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 12,
                          padding: 15,
                          font: {
                            size: 11
                          }
                        },
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Branch comparison */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ 
            borderRadius: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                mb: 3,
                gap: 2
              }}>
                <Typography variant="h6" fontWeight="600">
                  Branch Comparison
                </Typography>
                <Button
                  endIcon={<ArrowRight size={16} />}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  Full Analysis
                </Button>
              </Box>
              <Box sx={{ height: { xs: '250px', sm: '280px' } }}>
                <Bar
                  data={salesBranchData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                          boxWidth: 12,
                          usePointStyle: true,
                          font: {
                            size: 11
                          }
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)',
                        },
                        ticks: {
                          callback: (value) => `$${value / 1000}k`,
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </Box>
              
              {/* Branch metrics comparison */}
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Main Branch
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      $18,240 <Typography component="span" variant="body2" color="success.main">+18%</Typography>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={78} 
                      sx={{ 
                        mt: 1, 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          backgroundColor: '#3B82F6',
                        }
                      }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Secondary Branch
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      $10,710 <Typography component="span" variant="body2" color="success.main">+5%</Typography>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={42} 
                      sx={{ 
                        mt: 1, 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          backgroundColor: '#10B981',
                        }
                      }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Main Branch Stock
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      842 items <Typography component="span" variant="body2" color="error.main">-2%</Typography>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={65} 
                      sx={{ 
                        mt: 1, 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          backgroundColor: '#F59E0B',
                        }
                      }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Secondary Branch Stock
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      640 items <Typography component="span" variant="body2" color="error.main">-5%</Typography>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={52} 
                      sx={{ 
                        mt: 1, 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          backgroundColor: '#F59E0B',
                        }
                      }} 
                    />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Recent activity and alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ 
            borderRadius: 2,
            height: '100%',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                mb: 2,
                gap: 2
              }}>
                <Typography variant="h6" fontWeight="600">
                  Recent Activities
                </Typography>
                <Button
                  endIcon={<ArrowRight size={16} />}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <List sx={{ px: 0 }}>
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 42 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <Clock size={16} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Emma started her shift"
                    secondary="Main Branch • 2 hours ago"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <IconButton edge="end">
                    <ChevronRight size={18} />
                  </IconButton>
                </ListItem>
                <Divider component="li" />
                
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 42 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                      <ShoppingCart size={16} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="New sale completed"
                    secondary="$152.25 • Secondary Branch • 3 hours ago"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <IconButton edge="end">
                    <ChevronRight size={18} />
                  </IconButton>
                </ListItem>
                <Divider component="li" />
                
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 42 }}>
                    <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                      <Truck size={16} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Supplier delivery received"
                    secondary="Farm Fresh • Main Branch • 5 hours ago"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <IconButton edge="end">
                    <ChevronRight size={18} />
                  </IconButton>
                </ListItem>
                <Divider component="li" />
                
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 42 }}>
                    <Avatar sx={{ bgcolor: 'error.main', width: 32, height: 32 }}>
                      <RefreshCw size={16} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Inventory transfer completed"
                    secondary="Main → Secondary • 6 hours ago"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <IconButton edge="end">
                    <ChevronRight size={18} />
                  </IconButton>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ 
            borderRadius: 2,
            height: '100%',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                mb: 2,
                gap: 2
              }}>
                <Typography variant="h6" fontWeight="600">
                  Alerts & Notifications
                </Typography>
                <Button
                  endIcon={<ArrowRight size={16} />}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <List sx={{ px: 0 }}>
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 42 }}>
                    <Avatar sx={{ bgcolor: 'error.main', width: 32, height: 32 }}>
                      <AlertCircle size={16} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Low stock alert"
                    secondary="Apples (Red Delicious) • Main Branch"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <Chip 
                    label="Critical" 
                    size="small" 
                    color="error" 
                    sx={{ height: 24 }}
                  />
                </ListItem>
                <Divider component="li" />
                
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 42 }}>
                    <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                      <Bell size={16} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Daily report ready"
                    secondary="Financial summary for July 15, 2025"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <Chip 
                    label="New" 
                    size="small" 
                    color="primary" 
                    sx={{ height: 24 }}
                  />
                </ListItem>
                <Divider component="li" />
                
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 42 }}>
                    <Avatar sx={{ bgcolor: 'error.main', width: 32, height: 32 }}>
                      <AlertCircle size={16} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="System maintenance"
                    secondary="Scheduled for July 18, 2025 at 2:00 AM"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <Chip 
                    label="Important" 
                    size="small" 
                    color="warning" 
                    sx={{ height: 24 }}
                  />
                </ListItem>
                <Divider component="li" />
                
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 42 }}>
                    <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                      <CheckCircle2 size={16} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Inventory check complete"
                    secondary="Secondary Branch • No discrepancies found"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <Chip 
                    label="Resolved" 
                    size="small" 
                    color="success" 
                    sx={{ height: 24 }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;