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

interface Employee {
  id: string;
  name: string;
  role: string;
  branch: string;
  status: 'active' | 'on-break' | 'off-duty';
  wage: number;
  wageType: 'hourly' | 'daily' | 'monthly';
  defaultShifts?: string[];
  timeLogs: any[];
}

function StaffForm({ open, onClose, branchId }: StaffFormProps) {
  const { addEmployee, currentShift, addStaffToShift } = useShiftStore();
  const [employee, setEmployee] = useState({
    name: '',
    role: '',
    wage: '',
    wageType: 'hourly' as 'hourly' | 'daily' | 'monthly',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employeeData = {
      name: employee.name,
      role: employee.role,
      wage: Number(employee.wage),
      wageType: employee.wageType,
      branch: branchId,
      defaultShifts: [branchId],
      shiftPreferences: [],
      timeLogs: [],
      status: 'off-duty' as const
    };

    try {
      // Cast the result to Employee type since we know the structure
      const newEmployee = addEmployee(employeeData) as unknown as Employee;
    
      // Check if currentShift exists and we have the employee
      if (currentShift && newEmployee?.id) {
        addStaffToShift(currentShift, newEmployee.id);
      }
    } catch (error) {
      console.error('Failed to add employee:', error);
    }

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
                  onChange={(e) => setEmployee({ ...employee, wageType: e.target.value as 'hourly' | 'daily' | 'monthly' })}
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

interface DefaultStaffProps {
  branchId: string;
}

const DefaultStaffManagement: React.FC<DefaultStaffProps> = ({ branchId }) => {
  const { branches, employees, updateEmployee } = useShiftStore();
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(branchId);

  const handleDefaultStaffChange = (employeeId: string, isDefault: boolean) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    const updatedDefaultShifts = isDefault 
      ? [...(employee.defaultShifts || []), branchId]
      : (employee.defaultShifts || []).filter(id => id !== branchId);

    updateEmployee(employeeId, {
      defaultShifts: updatedDefaultShifts
    });
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
          {employees.filter(e => e.defaultShifts?.includes(branchId)).map((employee) => (
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
                onClick={() => handleDefaultStaffChange(employee.id, false)}
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
        branchId={branchId}
      />
    </Box>
  );
};

export default DefaultStaffManagement;