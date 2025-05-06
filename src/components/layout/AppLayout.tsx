import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import useAuthStore from '../../stores/authStore';

// Import icons from lucide-react
import { 
  Menu as MenuIcon,
  Home as HomeIcon,
  Package as PackageIcon,
  DollarSign as DollarSignIcon,
  Clock as ClockIcon,
  Truck as TruckIcon,
  RefreshCw as RefreshCwIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Bell as BellIcon,
  LogOut as LogOutIcon,
  Store as StoreIcon,
  UserCheck as UserCheckIcon,
  Wifi as WifiIcon,
  XCircle as XCircleIcon
} from 'lucide-react';

const drawerWidth = 260;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}));

const menuItems = [
  { text: 'Dashboard', icon: <HomeIcon size={20} />, path: '/' },
  { text: 'Inventory', icon: <PackageIcon size={20} />, path: '/inventory' },
  { text: 'Financial', icon: <DollarSignIcon size={20} />, path: '/financial' },
  { text: 'Staff', icon: <UserCheckIcon size={20} />, path: '/staff' },
  { text: 'Shifts', icon: <ClockIcon size={20} />, path: '/shifts' },
  { text: 'Suppliers', icon: <TruckIcon size={20} />, path: '/suppliers' },
  { text: 'Transfers', icon: <RefreshCwIcon size={20} />, path: '/transfers' },
  { text: 'Reports', icon: <BarChartIcon size={20} />, path: '/reports' },
  { text: 'Settings', icon: <SettingsIcon size={20} />, path: '/settings' },
];

const AppLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [branchAnchorEl, setBranchAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleBranchMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setBranchAnchorEl(event.currentTarget);
  };

  const handleBranchMenuClose = () => {
    setBranchAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const isConnected = true; // This would be from a state that tracks connection

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          ml: { sm: `${drawerOpen ? drawerWidth : 0}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          
          {/* Branch Selector */}
          <Tooltip title="Switch Branch">
            <IconButton 
              size="large" 
              onClick={handleBranchMenuOpen}
              sx={{ mr: 1 }}
            >
              <Badge color="primary" variant="dot">
                <StoreIcon size={22} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={branchAnchorEl}
            open={Boolean(branchAnchorEl)}
            onClose={handleBranchMenuClose}
            PaperProps={{
              elevation: 3,
              sx: { minWidth: 200 }
            }}
          >
            <MenuItem onClick={handleBranchMenuClose}>
              <ListItemIcon>
                <Badge color="success" variant="dot">
                  <StoreIcon size={20} />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Main Branch" />
            </MenuItem>
            <MenuItem onClick={handleBranchMenuClose}>
              <ListItemIcon>
                <Badge color="error" variant="dot">
                  <StoreIcon size={20} />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Secondary Branch" />
            </MenuItem>
          </Menu>
          
          {/* Connection Status */}
          <Tooltip title={isConnected ? "Connected" : "Offline"}>
            <IconButton size="large" sx={{ mr: 1 }}>
              {isConnected ? (
                <WifiIcon size={22} color="#10B981" />
              ) : (
                <XCircleIcon size={22} color="#EF4444" />
              )}
            </IconButton>
          </Tooltip>
          
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              size="large"
              onClick={handleNotificationMenuOpen}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={3} color="error">
                <BellIcon size={22} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationMenuClose}
            PaperProps={{
              elevation: 3,
              sx: { minWidth: 320 }
            }}
          >
            <MenuItem onClick={handleNotificationMenuClose}>
              <ListItemIcon>
                <Badge color="error" variant="dot">
                  <PackageIcon size={20} />
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary="Low Stock Alert" 
                secondary="Apples (Red Delicious) are running low" 
              />
            </MenuItem>
            <MenuItem onClick={handleNotificationMenuClose}>
              <ListItemIcon>
                <Badge color="warning" variant="dot">
                  <TruckIcon size={20} />
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary="Supplier Delivery" 
                secondary="Scheduled delivery from Farm Fresh at 2 PM" 
              />
            </MenuItem>
            <MenuItem onClick={handleNotificationMenuClose}>
              <ListItemIcon>
                <Badge color="info" variant="dot">
                  <UserCheckIcon size={20} />
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary="Shift Change" 
                secondary="Alex clocked in 10 minutes ago" 
              />
            </MenuItem>
          </Menu>
          
          {/* User Profile */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 1 }}
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                {user?.username.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              elevation: 3,
              sx: { minWidth: 200 }
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1">{user?.username || 'User'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role || 'Role'} • {user?.branch || 'Branch'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
              <ListItemIcon>
                <SettingsIcon size={20} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogOutIcon size={20} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar Drawer */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'primary.main',
            color: 'white',
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          py: 3
        }}>
          <img src="/logo.svg" alt="Fruit Store" style={{ height: 40 }} />
          <Typography variant="h5" ml={1} fontWeight="bold">
            Fruit Store
          </Typography>
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  py: 1.25,
                  px: 2.5,
                  mb: 0.5,
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.18)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 42 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 1,
          mx: 2,
          mb: 2,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40, mr: 2 }}>
            {user?.username.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight={500}>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {user?.role || 'Role'}
            </Typography>
          </Box>
        </Box>
      </Drawer>
      
      {/* Main Content */}
      <Main open={drawerOpen} sx={{ mt: '64px', overflowY: 'auto' }}>
        <Outlet />
      </Main>
    </Box>
  );
};

export default AppLayout;