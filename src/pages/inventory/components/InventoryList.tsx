import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  ArrowUpDown,
  Barcode,
  RefreshCw,
} from 'lucide-react';
import useInventoryStore from '../../../stores/inventoryStore';

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Item Name',
    flex: 1,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Package size={20} />
        <Typography>{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'sku',
    headerName: 'SKU',
    width: 120,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    width: 120,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography>{params.value}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
          {params.row.unit}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => {
      const status = params.row.quantity <= params.row.reorderPoint ? 'low' : 'ok';
      return (
        <Chip
          label={status === 'low' ? 'Low Stock' : 'In Stock'}
          color={status === 'low' ? 'error' : 'success'}
          size="small"
        />
      );
    },
  },
  {
    field: 'location',
    headerName: 'Location',
    width: 150,
  },
  {
    field: 'costPrice',
    headerName: 'Cost Price',
    width: 120,
    valueFormatter: (params) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(params.value);
    },
  },
  {
    field: 'sellingPrice',
    headerName: 'Selling Price',
    width: 120,
    valueFormatter: (params) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(params.value);
    },
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 150,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    sortable: false,
    renderCell: (params) => {
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClose = () => {
        setAnchorEl(null);
      };

      return (
        <>
          <IconButton onClick={handleClick}>
            <MoreVertical size={20} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Edit size={18} style={{ marginRight: 8 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ArrowUpDown size={18} style={{ marginRight: 8 }} />
              Move
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Barcode size={18} style={{ marginRight: 8 }} />
              Generate Barcode
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ color: 'error.main' }}>
              <Trash2 size={18} style={{ marginRight: 8 }} />
              Delete
            </MenuItem>
          </Menu>
        </>
      );
    },
  },
];

function InventoryList() {
  const { items, getLowStockItems } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card elevation={0}>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<Filter size={18} />}
                  onClick={handleFilterClick}
                >
                  Filter
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshCw size={18} />}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Plus size={18} />}
                >
                  Add Item
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <DataGrid
          rows={filteredItems}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          autoHeight
        />

        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
        >
          <MenuItem onClick={handleFilterClose}>Low Stock Items</MenuItem>
          <MenuItem onClick={handleFilterClose}>Out of Stock</MenuItem>
          <MenuItem onClick={handleFilterClose}>Expired Items</MenuItem>
          <MenuItem onClick={handleFilterClose}>By Category</MenuItem>
          <MenuItem onClick={handleFilterClose}>By Location</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}

export default InventoryList;