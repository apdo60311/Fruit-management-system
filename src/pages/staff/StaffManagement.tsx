import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@mui/material';
import useShiftStore from '../../stores/shiftStore';
import { Employee, Staff, StaffFormProps } from '../../interfaces/staff-interfaces';
import { ShiftPreference } from '../../interfaces/shift-interface';


const StaffForm: React.FC<StaffFormProps> = ({ open, onClose, editingStaff = null }) => {
  const { addEmployee, updateEmployee, branches } = useShiftStore();
  const [formData, setFormData] = useState({
    name: editingStaff?.name || '',
    role: editingStaff?.role || '',
    email: editingStaff?.email || '',
    phone: editingStaff?.phone || '',
    branch: editingStaff?.branch || branches[0]?.id || '',
    wage: editingStaff?.wage || 0,
    wageType: editingStaff?.wageType || ('hourly' as const),
    shiftPreferences: editingStaff?.shiftPreferences || [] as ShiftPreference[],
  });

  const handleShiftPreferenceChange = (branchId: string, shiftType: 'morning' | 'night', checked: boolean) => {
    setFormData(prev => {
      const newPreferences = [...prev.shiftPreferences];
      if (checked) {
        newPreferences.push({ branchId, type: shiftType });
      } else {
        const index = newPreferences.findIndex(p => p.branchId === branchId && p.type === shiftType);
        if (index !== -1) {
          newPreferences.splice(index, 1);
        }
      }
      return { ...prev, shiftPreferences: newPreferences };
    });
  };

  const handleSubmit = () => {
    if (editingStaff) {
      updateEmployee(editingStaff.id, formData);
    } else {
      addEmployee(formData);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            fullWidth
          />
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            fullWidth
          />
          <TextField
            label="Branch"
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            fullWidth
          />
          <TextField
            label="Wage"
            type="number"
            value={formData.wage}
            onChange={(e) => setFormData({ ...formData, wage: parseFloat(e.target.value) })}
            fullWidth
          />
          <TextField
            label="Wage Type"
            select
            value={formData.wageType}
            onChange={(e) => setFormData({ ...formData, wageType: e.target.value as 'hourly' | 'daily' | 'monthly' })}
            fullWidth
          >
            <MenuItem value="hourly">Hourly</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </TextField>

          <Typography variant="h6" sx={{ mt: 2 }}>Shift Assignments</Typography>
          {branches.map((branch) => (
            <Card key={branch.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1">{branch.name}</Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.shiftPreferences.some(
                          p => p.branchId === branch.id && p.type === 'morning'
                        )}
                        onChange={(e) => handleShiftPreferenceChange(branch.id, 'morning', e.target.checked)}
                      />
                    }
                    label="Morning Shift"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.shiftPreferences.some(
                          p => p.branchId === branch.id && p.type === 'night'
                        )}
                        onChange={(e) => handleShiftPreferenceChange(branch.id, 'night', e.target.checked)}
                      />
                    }
                    label="Night Shift"
                  />
                </FormGroup>
              </CardContent>
            </Card>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editingStaff ? 'Update' : 'Add'} Staff Member
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function StaffManagement() {
  const { employees, updateEmployee } = useShiftStore(); 
  const { branches } = useShiftStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const handleEdit = (member: Employee) => {
    setEditingStaff(member as unknown as Staff);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingStaff(null);
  };

  const handleRemoveStaff = (id: string) => {
    updateEmployee(id, { status: 'off-duty' });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Staff Management
        </Typography>
        <Button variant="contained" onClick={() => setIsFormOpen(true)}>
          Add New Staff Member
        </Button>
      </Box>

      <Grid container spacing={3}>
        {employees.map((member) => (
          <Grid item xs={12} md={6} lg={4} key={member.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{member.name}</Typography>
                <Typography color="textSecondary">{member.role}</Typography>
                {isStaffMember(member) && (
                  <>
                    <Typography variant="body2">Email: {member.email}</Typography>
                    <Typography variant="body2">Phone: {member.phone}</Typography>
                  </>
                )}
                <Typography variant="body2">Branch: {member.branch}</Typography>
                <Typography variant="body2">Wage: {member.wage}</Typography>
                <Typography variant="body2">Wage Type: {member.wageType}</Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Assigned Shifts:</Typography>
                  {member.shiftPreferences?.map((pref: any, index:any) => {
                    const branch = branches.find(b => b.id === pref.branchId);
                    return (
                      <Chip
                        key={index}
                        label={`${branch?.name} - ${pref.type}`}
                        size="small"
                        sx={{ m: 0.5 }}
                      />
                    );
                  })}
                </Box>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button size="small" onClick={() => handleEdit(member)}>
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleRemoveStaff(member.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <StaffForm
        open={isFormOpen}
        onClose={handleClose}
        editingStaff={editingStaff}
      />
    </Box>
  );
}

function isStaffMember(member: Employee): member is Staff {
  return 'email' in member && 'phone' in member;
}

export default StaffManagement;