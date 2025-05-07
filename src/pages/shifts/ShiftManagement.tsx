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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Tab,
  Tabs,
  Tooltip,
} from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import {
  Play,
  Square,
  Coffee,
  Plus,
  Check,
  X,
  DollarSign,
  Store,
  Timer,
  Users,
  AlarmClock,
  Upload,
} from 'lucide-react';
import useShiftStore from '../../stores/shiftStore';
import { ExpenseFormProps, SalesUploadFormProps, ShiftFormProps, TaskFormProps } from '../../interfaces/props-interfaces';


function TaskForm({ open, onClose, shiftId, employees }: TaskFormProps) {
  const { addTask } = useShiftStore();
  const [task, setTask] = useState({
    description: '',
    assignedTo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(shiftId, { ...task, status: 'pending' });
    onClose();
    setTask({ description: '', assignedTo: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Task</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Description"
                value={task.description}
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Assign To</InputLabel>
                <Select
                  value={task.assignedTo}
                  onChange={(e) =>
                    setTask({ ...task, assignedTo: e.target.value })
                  }
                  label="Assign To"
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Add Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function ExpenseForm({ open, onClose, shiftId, branchId }: ExpenseFormProps) {
  const { addExpense } = useShiftStore();
  const [expense, setExpense] = useState({
    description: '',
    amount: '',
    category: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      ...expense,
      amount: Number(expense.amount),
      date: new Date().toISOString(),
      shiftId,
      branchId,
    });
    onClose();
    setExpense({ description: '', amount: '', category: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Shift Expense</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={expense.description}
                onChange={(e) =>
                  setExpense({ ...expense, description: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={expense.amount}
                onChange={(e) =>
                  setExpense({ ...expense, amount: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={expense.category}
                  onChange={(e) =>
                    setExpense({ ...expense, category: e.target.value })
                  }
                  label="Category"
                >
                  <MenuItem value="supplies">Supplies</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="utilities">Utilities</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Add Expense
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function SalesUploadForm({ open, onClose, shiftId }: SalesUploadFormProps) {
  const { endShiftWithSales } = useShiftStore();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [summary, setSummary] = useState<{
    totalSales: number;
    totalCost: number;
    profit: number;
    staffWages: number;
  } | null>(null);
  const [processing, setProcessing] = useState(false);

  const validateCSV = (text: string): { isValid: boolean; error?: string } => {
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return { isValid: false, error: 'File is empty or missing data rows' };
    }

    const header = lines[0].toLowerCase().trim();
    if (header !== 'productid,quantity,price,cost') {
      return { isValid: false, error: 'Invalid CSV header. Expected: productId,quantity,price,cost' };
    }

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      
      if (row.length !== 4) {
        return { isValid: false, error: `Invalid number of columns in row ${i}` };
      }

      const [productId, quantity, price, cost] = row;
      if (!productId.trim()) {
        return { isValid: false, error: `Empty product ID in row ${i}` };
      }
      if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
        return { isValid: false, error: `Invalid quantity in row ${i}` };
      }
      if (isNaN(Number(price)) || Number(price) < 0) {
        return { isValid: false, error: `Invalid price in row ${i}` };
      }
      if (isNaN(Number(cost)) || Number(cost) < 0) {
        return { isValid: false, error: `Invalid cost in row ${i}` };
      }
    }

    return { isValid: true };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSummary(null);
      setFileError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setProcessing(true);
    setFileError('');

    try {
      const text = await file.text();
      
      const validation = validateCSV(text);
      if (!validation.isValid) {
        setFileError(validation.error || 'Invalid file format');
        setProcessing(false);
        return;
      }

      const rows = text.split('\n').filter(row => row.trim());
      const salesData = rows.slice(1).map(row => {
        const [productId, quantity, price, cost] = row.split(',');
        return {
          productId: productId.trim(),
          quantity: Number(quantity),
          price: Number(price),
          cost: Number(cost)
        };
      });

      const result = endShiftWithSales(shiftId, salesData);
      setSummary(result);
    } catch (error) {
      console.error('Error processing file:', error);
      setFileError('Error processing file. Please check the format.');
    } finally {
      setProcessing(false);
    }
  };

  const handleFinish = () => {
    if (summary) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Sales Data</DialogTitle>
      <DialogContent>
        {!summary ? (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Upload a CSV file with the following columns:
              </Typography>
              <Typography variant="body2" component="div">
                <code>productId,quantity,price,cost</code>
              </Typography>
            </Box>

            <input
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileChange}
              style={{ marginBottom: 16 }}
            />

            {fileError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {fileError}
              </Typography>
            )}
          </>
        ) : (
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>Shift Summary</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Total Sales</Typography>
                <Typography variant="h6" color="primary.main">${summary.totalSales.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Total Cost</Typography>
                <Typography variant="h6">${summary.totalCost.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Staff Wages</Typography>
                <Typography variant="h6">${summary.staffWages.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Net Profit</Typography>
                <Typography variant="h6" color={summary.profit >= 0 ? 'success.main' : 'error.main'}>
                  ${summary.profit.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Review Summary</Typography>
              <Typography variant="body2" color="text.secondary">
                Please review the shift summary above. Click "Complete Shift" to finalize the shift and save these results.
              </Typography>
            </Box>
          </Paper>
        )}
      </DialogContent>
      <DialogActions>
        {!summary ? (
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleUpload}
              variant="contained"
              disabled={!file || processing}
              startIcon={<Upload size={20} />}
            >
              {processing ? 'Processing...' : 'Process Sales'}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setSummary(null)}>Upload Different File</Button>
            <Button onClick={handleFinish} variant="contained" color="success">
              Complete Shift
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
const ShiftForm: React.FC<ShiftFormProps> = ({ open, onClose, branch, shiftType }) => {
  const { addShift } = useShiftStore();
  const [formData] = useState({
    name: `${new Date().toLocaleDateString()} - ${shiftType}`,
    type: shiftType,
    branch: branch,
    employees: [] as string[],
    status: 'upcoming' as const,
    startTime: new Date().toISOString(),
    endTime: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addShift(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Shift</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Branch: {branch}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Shift Type: {shiftType}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Assigned Staff Members:
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Create Shift
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function ShiftManagement() {
  const {
    employees,
    shifts,
    currentShift,
    branches,
    clockIn,
    clockOut,
    setBreak,
    updateTask,
    startShift,
    getShiftExpenses,
    getEmployeeShiftStats,
    addStaffToShift,
    removeStaffFromShift,
    setCurrentShift,
  } = useShiftStore();

  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || '');
  const [selectedShiftType, setSelectedShiftType] = useState<'morning' | 'night'>('morning');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isSalesUploadOpen, setIsSalesUploadOpen] = useState(false);
  const [tabValue, setTabValue] = useState('1');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const todayShifts = shifts.filter((shift) => {
    const shiftDate = new Date(shift.startTime).toISOString().split('T')[0];
    return (
      shift.branch === selectedBranch &&
      shift.type === selectedShiftType &&
      shiftDate === selectedDate
    );
  });

  const currentShiftData = currentShift ? shifts.find((s) => s.id === currentShift) : null;
  
  const availableEmployees = employees.filter((e) => 
    e.branch === selectedBranch && 
    e.shiftPreferences.some((p:any) => p.branchId === selectedBranch && p.type === selectedShiftType)
  );

  const activeEmployees = availableEmployees.filter((e) => e.status === 'active');
  const shiftExpenses = currentShiftData ? getShiftExpenses(currentShiftData.id) : [];
  const totalExpenses = shiftExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleStartShift = () => {
    if (!selectedBranch) return;
    startShift(selectedBranch);
  };

  const handleEndShift = () => {
    if (currentShift) {
      setIsSalesUploadOpen(true);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleAddStaff = () => {
    if (currentShift && selectedEmployee) {
      const employee = employees.find(e => e.id === selectedEmployee);
      if (employee?.shiftPreferences.some((p:any) => p.branchId === selectedBranch && p.type === selectedShiftType)) {
        addStaffToShift(currentShift, selectedEmployee);
        setSelectedEmployee('');
      }
    }
  };

  const handleRemoveStaff = (employeeId: string) => {
    if (currentShift) {
      removeStaffFromShift(currentShift, employeeId);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Shift Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Branch</InputLabel>
            <Select
              value={selectedBranch}
              onChange={(e) => {
                const newBranchId = e.target.value;
                if (currentShiftData && currentShiftData.branch !== newBranchId) {
                  setCurrentShift(null);
                }
                setSelectedBranch(newBranchId);
              }}
              label="Branch"
            >
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Shift Type</InputLabel>
            <Select
              value={selectedShiftType}
              onChange={(e) => {
                const newType = e.target.value as 'morning' | 'night';
                if (currentShiftData && currentShiftData.type !== newType) {
                  setCurrentShift(null);
                }
                setSelectedShiftType(newType);
              }}
              label="Shift Type"
            >
              <MenuItem value="morning">Morning (10:00-20:00)</MenuItem>
              <MenuItem value="night">Night (20:00-10:00)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                  <Store size={20} />
                </Avatar>
                <Typography variant="h6">Current Shift</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {currentShiftData ? (
                  new Date(currentShiftData.startTime).toLocaleTimeString()
                ) : (
                  'No Active Shift'
                )}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                {!currentShiftData ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStartShift}
                    disabled={!selectedBranch}
                  >
                    Start Shift
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleEndShift}
                  >
                    End Shift
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                  <Users size={20} />
                </Avatar>
                <Typography variant="h6">Staff On Duty</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {activeEmployees.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Out of {availableEmployees.length} available
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                  <Timer size={20} />
                </Avatar>
                <Typography variant="h6">Active Time</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {activeEmployees.reduce((sum, emp) => sum + (emp.totalActiveTime || 0), 0)} min
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total active minutes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.light', mr: 2 }}>
                  <DollarSign size={20} />
                </Avatar>
                <Typography variant="h6">Shift Expenses</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                ${totalExpenses.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {shiftExpenses.length} expense entries
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs onChange={handleTabChange} value={tabValue}>
                <Tab label="Staff Management" value="1" />
                <Tab label="Tasks" value="2" />
                <Tab label="Expenses" value="3" />
                <Tab label="History" value="4" />
              </Tabs>
            </Box>

            <TabPanel value="1">
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Staff Management</Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl sx={{ minWidth: 200 }}>
                      <InputLabel>Add Staff</InputLabel>
                      <Select
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        label="Add Staff"
                      >
                        {employees
                          .filter(e => !currentShiftData?.employees.includes(e.id))
                          .map((employee) => (
                            <MenuItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      onClick={handleAddStaff}
                      disabled={!selectedEmployee}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>

                <List>
                  {currentShiftData?.employees
                    .map((employeeId : any) => availableEmployees.find(e => e.id === employeeId))
                    .filter((employee:any): employee is NonNullable<typeof employee> => employee !== undefined)
                    .map((employee:any) => {
                    const stats = currentShift ? getEmployeeShiftStats(employee.id, currentShift) : null;
                    
                    return (
                      <ListItem
                        key={employee.id}
                        sx={{
                          bgcolor: stats?.isLate ? 'error.soft' : 'background.paper',
                          mb: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs={12} sm={3}>
                            <ListItemText
                              primary={employee.name}
                              secondary={employee.role}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={employee.status}
                                color={
                                  employee.status === 'active'
                                    ? 'success'
                                    : employee.status === 'on-break'
                                    ? 'warning'
                                    : 'default'
                                }
                                size="small"
                              />
                              {stats && stats.isLate && (
                                <Tooltip title={`Late by ${formatTime(stats.lateMinutes)}`}>
                                  <Chip
                                    icon={<AlarmClock size={14} />}
                                    label="Late"
                                    color="error"
                                    size="small"
                                  />
                                </Tooltip>
                              )}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            {stats && (
                              <Box>
                                <Typography variant="caption" display="block" color="text.secondary">
                                  Work: {formatTime(stats.totalWork)}
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary">
                                  Break: {formatTime(stats.totalBreak)}
                                </Typography>
                                {stats.overtime > 0 && (
                                  <Typography variant="caption" display="block" color="info.main">
                                    OT: {formatTime(stats.overtime)}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              {employee.status === 'off-duty' ? (
                                <Tooltip title="Clock In">
                                  <IconButton
                                    size="small"
                                    onClick={() => clockIn(employee.id, selectedBranch)}
                                    color="success"
                                  >
                                    <Play size={20} />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <>
                                  <Tooltip title={employee.status === 'active' ? 'Take Break' : 'End Break'}>
                                    <IconButton
                                      size="small"
                                      onClick={() => setBreak(employee.id, employee.status === 'active')}
                                      color="warning"
                                    >
                                      <Coffee size={20} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Clock Out">
                                    <IconButton
                                      size="small"
                                      onClick={() => clockOut(employee.id)}
                                      color="error"
                                    >
                                      <Square size={20} />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                              <Tooltip title="Remove from Shift">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveStaff(employee.id)}
                                  color="error"
                                >
                                  <X size={20} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Grid>
                        </Grid>
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            </TabPanel>

            <TabPanel value="2">
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">Shift Tasks</Typography>
                  <Button
                    variant="contained"
                    startIcon={<Plus size={20} />}
                    onClick={() => setIsTaskFormOpen(true)}
                    disabled={!currentShift}
                  >
                    Add Task
                  </Button>
                </Box>

                <List>
                  {currentShiftData?.tasks.map((task:any) => (
                    <ListItem
                      key={task.id}
                      sx={{
                        bgcolor: 'background.paper',
                        mb: 1,
                        borderRadius: 1,
                      }}
                    >
                      <ListItemText
                        primary={task.description}
                        secondary={
                          employees.find((e) => e.id === task.assignedTo)?.name
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() =>
                            updateTask(currentShift!, task.id, {
                              status:
                                task.status === 'completed' ? 'pending' : 'completed',
                            })
                          }
                        >
                          {task.status === 'completed' ? (
                            <X size={20} />
                          ) : (
                            <Check size={20} />
                          )}
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </TabPanel>

            <TabPanel value="3">
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">Shift Expenses</Typography>
                  <Button
                    variant="contained"
                    startIcon={<Plus size={20} />}
                    onClick={() => setIsExpenseFormOpen(true)}
                    disabled={!currentShift}
                  >
                    Add Expense
                  </Button>
                </Box>

                <List>
                  {shiftExpenses.map((expense) => (
                    <ListItem
                      key={expense.id}
                      sx={{
                        bgcolor: 'background.paper',
                        mb: 1,
                        borderRadius: 1,
                      }}
                    >
                      <ListItemText
                        primary={expense.description}
                        secondary={`Category: ${expense.category}`}
                      />
                      <Typography variant="h6" color="primary">
                        ${expense.amount.toFixed(2)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </TabPanel>

            <TabPanel value="4">
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Today's Shifts</Typography>
                <List>
                  {todayShifts.map((shift) => (
                    <ListItem
                      key={shift.id}
                      sx={{
                        bgcolor: 'background.paper',
                        mb: 1,
                        borderRadius: 1,
                      }}
                    >
                      <ListItemText
                        primary={`${shift.type} Shift`}
                        secondary={
                          <>
                            Start: {new Date(shift.startTime).toLocaleTimeString()}
                            {shift.endTime && ` • End: ${new Date(shift.endTime).toLocaleTimeString()}`}
                            {` • Status: ${shift.status}`}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                  {todayShifts.length === 0 && (
                    <Typography color="text.secondary">
                      No shifts found for today
                    </Typography>
                  )}
                </List>
              </Paper>
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>

      {currentShift && (
        <>
          <TaskForm
            open={isTaskFormOpen}
            onClose={() => setIsTaskFormOpen(false)}
            shiftId={currentShift as string}
            employees={availableEmployees}
          />
          <ExpenseForm
            open={isExpenseFormOpen}
            onClose={() => setIsExpenseFormOpen(false)}
            shiftId={currentShift as string}
            branchId={selectedBranch}
          />
          <SalesUploadForm
            open={isSalesUploadOpen}
            onClose={() => {
              if (!currentShift) {
                setIsSalesUploadOpen(false);
              }
            }}
            shiftId={currentShift || ''}
          />
        </>
      )}

      {selectedBranch && (
        <ShiftForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          branch={selectedBranch}
          shiftType={selectedShiftType}
        />
      )}
    </Box>
  );
}

export default ShiftManagement;