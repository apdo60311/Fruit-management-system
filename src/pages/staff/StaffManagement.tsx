import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  UserPlus, 
  Edit2, 
  Trash2, 
  RefreshCw,
  Store,
} from 'lucide-react';
import useStaffStore from '../../stores/staffStore';

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
      id={`branch-tabpanel-${index}`}
      aria-labelledby={`branch-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface StaffFormData {
  name: string;
  branch: string;
  role: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
}

const initialFormData: StaffFormData = {
  name: '',
  branch: '',
  role: '',
  phone: '',
  email: '',
  status: 'active',
};

const branches = ['Main Branch', 'Secondary Branch'];
const roles = ['Manager', 'Cashier', 'Stock Clerk', 'Sales Associate'];

function StaffManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<StaffFormData>(initialFormData);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  
  const { staff, addStaff, updateStaff, deleteStaff, getStaffByBranch } = useStaffStore();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenForm = (staffId?: string) => {
    if (staffId) {
      const staffMember = staff.find((s) => s.id === staffId);
      if (staffMember) {
        setFormData({
          name: staffMember.name,
          branch: staffMember.branch,
          role: staffMember.role,
          phone: staffMember.phone,
          email: staffMember.email,
          status: staffMember.status,
        });
        setEditingStaffId(staffId);
      }
    } else {
      setFormData(initialFormData);
      setEditingStaffId(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData(initialFormData);
    setEditingStaffId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaffId) {
      updateStaff(editingStaffId, { ...formData, joinDate: new Date().toISOString() });
    } else {
      addStaff({ ...formData, joinDate: new Date().toISOString() });
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      deleteStaff(id);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === 'active' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleOpenForm(params.row.id)} size="small">
              <Edit2 size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row.id)} size="small" color="error">
              <Trash2 size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Staff Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            icon={<Store size={18} />} 
            iconPosition="start" 
            label="All Branches" 
            sx={{ textTransform: 'none' }} 
          />
          <Tab 
            icon={<Store size={18} />} 
            iconPosition="start" 
            label="Main Branch" 
            sx={{ textTransform: 'none' }} 
          />
          <Tab 
            icon={<Store size={18} />} 
            iconPosition="start" 
            label="Secondary Branch" 
            sx={{ textTransform: 'none' }} 
          />
        </Tabs>
      </Box>

      <Card elevation={0}>
        <CardContent>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshCw size={18} />}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<UserPlus size={18} />}
              onClick={() => handleOpenForm()}
            >
              Add Staff
            </Button>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <DataGrid
              rows={staff}
              columns={columns}
              autoHeight
              disableRowSelectionOnClick
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10, 25, 50]}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <DataGrid
              rows={getStaffByBranch('Main Branch')}
              columns={columns}
              autoHeight
              disableRowSelectionOnClick
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10, 25, 50]}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <DataGrid
              rows={getStaffByBranch('Secondary Branch')}
              columns={columns}
              autoHeight
              disableRowSelectionOnClick
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10, 25, 50]}
            />
          </TabPanel>
        </CardContent>
      </Card>

      {/* Add/Edit Staff Dialog */}
      <Dialog open={isFormOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingStaffId ? 'Edit Staff Member' : 'Add New Staff Member'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Branch</InputLabel>
                  <Select
                    value={formData.branch}
                    label="Branch"
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  >
                    {branches.map((branch) => (
                      <MenuItem key={branch} value={branch}>
                        {branch}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    label="Role"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingStaffId ? 'Save Changes' : 'Add Staff'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default StaffManagement;