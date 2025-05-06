import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Rating,
} from '@mui/material';
import {
  Truck,
  Package,
  DollarSign,
  Star,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import useSupplierStore from '../../stores/supplierStore';

interface SupplierFormProps {
  open: boolean;
  onClose: () => void;
  supplier?: {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    paymentTerms: string;
    taxId: string;
  };
}

function SupplierForm({ open, onClose, supplier }: SupplierFormProps) {
  const { addSupplier, updateSupplier } = useSupplierStore();
  const [formData, setFormData] = useState(
    supplier ?? {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      paymentTerms: '',
      taxId: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (supplier) {
      updateSupplier(supplier.id, formData);
    } else {
      addSupplier({ ...formData, rating: 5, status: 'active' });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {supplier ? 'Edit Supplier' : 'Add New Supplier'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Person"
                value={formData.contactPerson}
                onChange={(e) =>
                  setFormData({ ...formData, contactPerson: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Payment Terms"
                value={formData.paymentTerms}
                onChange={(e) =>
                  setFormData({ ...formData, paymentTerms: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tax ID"
                value={formData.taxId}
                onChange={(e) =>
                  setFormData({ ...formData, taxId: e.target.value })
                }
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {supplier ? 'Update' : 'Add'} Supplier
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function SupplierManagement() {
  const { suppliers, purchaseOrders, getSupplierRating, removeSupplier } =
    useSupplierStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierFormProps['supplier']>();

  // Get metrics
  const activeSuppliers = suppliers.filter((s) => s.status === 'active');
  const pendingOrders = purchaseOrders.filter(
    (o) => o.status === 'pending' || o.status === 'approved'
  );
  const unpaidAmount = purchaseOrders
    .filter((o) => o.paymentStatus !== 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const handleEdit = (supplier: typeof selectedSupplier) => {
    setSelectedSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      removeSupplier(id);
    }
  };

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
                {activeSuppliers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {suppliers.length - activeSuppliers.length} inactive
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
                {pendingOrders.length}
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
                ${unpaidAmount.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {purchaseOrders.filter((o) => o.paymentStatus !== 'paid').length}{' '}
                invoices pending
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
                {(
                  suppliers.reduce(
                    (sum, s) => sum + getSupplierRating(s.id),
                    0
                  ) / suppliers.length || 0
                ).toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h6">Supplier Directory</Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => {
                  setSelectedSupplier(undefined);
                  setIsFormOpen(true);
                }}
              >
                Add Supplier
              </Button>
            </Box>

            <List>
              {suppliers.map((supplier) => (
                <ListItem
                  key={supplier.id}
                  sx={{
                    bgcolor: 'background.paper',
                    mb: 1,
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ mr: 2 }}>
                    <Rating
                      value={getSupplierRating(supplier.id)}
                      readOnly
                      size="small"
                    />
                  </Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1">{supplier.name}</Typography>
                        <Chip
                          label={supplier.status}
                          color={supplier.status === 'active' ? 'success' : 'default'}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Phone size={16} style={{ marginRight: 8 }} />
                          {supplier.phone}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Mail size={16} style={{ marginRight: 8 }} />
                          {supplier.email}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MapPin size={16} style={{ marginRight: 8 }} />
                          {supplier.address}
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleEdit(supplier)}
                      sx={{ mr: 1 }}
                    >
                      <Edit2 size={20} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(supplier.id)}
                      color="error"
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <SupplierForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedSupplier(undefined);
        }}
        supplier={selectedSupplier}
      />
    </Box>
  );
}

export default SupplierManagement;