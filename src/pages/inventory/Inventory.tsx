import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  ArrowUpDown,
  Download,
  Upload,
  BarChart2,
} from 'lucide-react';
import useInventoryStore from '../../stores/inventoryStore';
import InventoryList from './components/InventoryList';
import InventoryMovement from './components/InventoryMovement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function Inventory() {
  const [tabValue, setTabValue] = useState(0);
  const { items, getLowStockItems } = useInventoryStore();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const totalItems = items.length;
  const lowStockItems = getLowStockItems().length;
  const totalValue = items.reduce(
    (sum, item) => sum + item.quantity * item.costPrice,
    0
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Inventory Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage your inventory across all locations
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                  <Package size={20} />
                </Avatar>
                <Typography variant="subtitle1">Total Items</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {totalItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across all locations
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'error.light', mr: 2 }}>
                  <AlertTriangle size={20} />
                </Avatar>
                <Typography variant="subtitle1">Low Stock</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {lowStockItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items below reorder point
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                  <TrendingDown size={20} />
                </Avatar>
                <Typography variant="subtitle1">Total Value</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                ${totalValue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current inventory value
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                  <ArrowUpDown size={20} />
                </Avatar>
                <Typography variant="subtitle1">Movements</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                24
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In last 7 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card elevation={0}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Inventory List" />
            <Tab label="Movements" />
            <Tab label="Reports" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Download size={18} />}
              sx={{ mr: 2 }}
            >
              Import
            </Button>
            <Button
              variant="outlined"
              startIcon={<Upload size={18} />}
              sx={{ mr: 2 }}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<BarChart2 size={18} />}
            >
              Analytics
            </Button>
          </Box>
          <InventoryList />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <InventoryMovement />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Inventory Reports
          </Typography>
          {/* Reports interface will be implemented here */}
        </TabPanel>
      </Card>
    </Box>
  );
}

export default Inventory;