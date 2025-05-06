import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { X, Plus } from 'lucide-react';
import useShiftStore from '../../stores/shiftStore';

interface StaffFormProps {
  open: boolean;
  onClose: () => void;
  branchId: string;
}

function StaffForm({ open, onClose, branchId }: StaffFormProps) {
  const { addEmployee } = useShiftStore();
  const [employee, setEmployee] = useState({
    name: '',
    role: '',
    wage: '',
    wageType: 'hourly',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      ...employee,
      wage: Number(employee.wage),
      wageType: employee.wageType as 'hourly' | 'daily' | 'monthly',
      branch: branchId,
      defaultShifts: [branchId],
    });
    onClose();
    setEmployee({ name: '', role: '', wage: '', wageType: 'hourly' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Default Staff Member</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={employee.name}
                onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role"
                value={employee.role}
                onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Wage Amount"
                type="number"
                value={employee.wage}
                onChange={(e) => setEmployee({ ...employee, wage: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Wage Type</InputLabel>
                <Select
                  value={employee.wageType}
                  onChange={(e) => setEmployee({ ...employee, wageType: e.target.value })}
                  label="Wage Type"
                >
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Add Staff
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function DefaultStaffManagement() {
  const { branches, employees, updateEmployee, removeEmployee } = useShiftStore();
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || '');
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);

  const defaultStaff = employees.filter((e) => 
    e.defaultShifts?.includes(selectedBranch)
  );

  const handleRemoveDefaultStaff = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee && employee.defaultShifts) {
      updateEmployee(employeeId, {
        defaultShifts: employee.defaultShifts.filter(id => id !== selectedBranch)
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Default Staff Management
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Branch</InputLabel>
          <Select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            label="Branch"
          >
            {branches.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>
                {branch.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Default Staff Members</Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => setIsStaffFormOpen(true)}
          >
            Add Staff
          </Button>
        </Box>

        <List>
          {defaultStaff.map((employee) => (
            <ListItem
              key={employee.id}
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 1,
              }}
            >
              <ListItemText
                primary={employee.name}
                secondary={
                  <>
                    {employee.role} • {employee.wageType === 'hourly' ? `$${employee.wage}/hr` :
                      employee.wageType === 'daily' ? `$${employee.wage}/day` : `$${employee.wage}/month`}
                  </>
                }
              />
              <IconButton
                edge="end"
                onClick={() => handleRemoveDefaultStaff(employee.id)}
                color="error"
              >
                <X size={20} />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      <StaffForm
        open={isStaffFormOpen}
        onClose={() => setIsStaffFormOpen(false)}
        branchId={selectedBranch}
      />
    </Box>
  );
}

export default DefaultStaffManagement;