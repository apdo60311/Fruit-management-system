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
  Clock,
  AlarmClock,
  Upload,
} from 'lucide-react';
import useShiftStore from '../../stores/shiftStore';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  shiftId: string;
  employees: Array<{ id: string; name: string }>;
}

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  shiftId: string;
  branchId: string;
}

interface SalesUploadFormProps {
  open: boolean;
  onClose: () => void;
  shiftId: string;
}

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
  const [summary, setSummary] = useState<{
    totalSales: number;
    totalCost: number;
    profit: number;
    staffWages: number;
  } | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSummary(null); // Reset summary when new file is selected
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const text = await file.text();
      const rows = text.split('\n').filter(row => row.trim());
      const salesData = rows.slice(1).map(row => {
        const [productId, quantity, price, cost] = row.split(',');
        return {
          productId,
          quantity: Number(quantity),
          price: Number(price),
          cost: Number(cost)
        };
      });

      const result = endShiftWithSales(shiftId, salesData);
      setSummary(result);
      // Don't close automatically - let user review the summary
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please check the format.');
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
              accept=".csv"
              onChange={handleFileChange}
              style={{ marginBottom: 16 }}
            />
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
    endShift,
    getShiftExpenses,
    getEmployeeShiftStats,
    addStaffToShift,
    removeStaffFromShift,
    endShiftWithSales
  } = useShiftStore();
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || '');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isSalesUploadOpen, setIsSalesUploadOpen] = useState(false);
  const [tabValue, setTabValue] = useState('1');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  const currentShiftData = shifts.find((s) => s.id === currentShift);
  const branchEmployees = employees.filter((e) => e.branch === selectedBranch || !e.branch);
  const activeEmployees = branchEmployees.filter((e) => e.status === 'active');
  const shiftExpenses = currentShiftData ? getShiftExpenses(currentShiftData.id) : [];
  const totalExpenses = shiftExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleStartShift = () => {
    if (!selectedBranch) return;
    
    // Start the shift
    startShift(selectedBranch);
    
    // Add default staff to the shift
    const defaultStaff = employees.filter(e => e.defaultShifts?.includes(selectedBranch));
    defaultStaff.forEach(employee => {
      if (currentShift) {
        addStaffToShift(currentShift, employee.id);
      }
    });
  };

  const handleEndShift = () => {
    if (currentShift) {
      // Show sales upload form when ending shift
      // The shift will be ended after CSV processing
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
      addStaffToShift(currentShift, selectedEmployee);
      setSelectedEmployee('');
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

      <Grid container spacing={3}>
        {/* Overview Cards */}
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
                Out of {branchEmployees.length} scheduled
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

        {/* Tabs Section */}
        <Grid item xs={12}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs onChange={handleTabChange} value={tabValue}>
                <Tab label="Staff Management" value="1" />
                <Tab label="Tasks" value="2" />
                <Tab label="Expenses" value="3" />
              </Tabs>
            </Box>

            <TabPanel value="1">
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Staff Management</Typography>
                  
                  {/* Add staff selector */}
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
                  {branchEmployees.map((employee) => {
                    const stats = currentShift ? getEmployeeShiftStats(employee.id, currentShift) : null;
                    
                    return (
                      <ListItem
                        key={employee.id}
                        sx={{
                          bgcolor: 'background.paper',
                          mb: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <ListItemText
                              primary={employee.name}
                              secondary={employee.role}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
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
                              {stats && employee.status !== 'off-duty' && (
                                <>
                                  {stats.isLate && (
                                    <Tooltip title="Late Arrival">
                                      <Chip
                                        icon={<AlarmClock size={14} />}
                                        label="Late"
                                        color="error"
                                        size="small"
                                      />
                                    </Tooltip>
                                  )}
                                  {stats.overtime > 0 && (
                                    <Tooltip title={`Overtime: ${formatTime(stats.overtime)}`}>
                                      <Chip
                                        icon={<Clock size={14} />}
                                        label="OT"
                                        color="info"
                                        size="small"
                                      />
                                    </Tooltip>
                                  )}
                                </>
                              )}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            {stats && employee.status !== 'off-duty' && (
                              <Box>
                                <Typography variant="caption" display="block" color="text.secondary">
                                  Work: {formatTime(stats.totalWork)}
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary">
                                  Break: {formatTime(stats.totalBreak)}
                                </Typography>
                              </Box>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              {currentShiftData?.employees.includes(employee.id) && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveStaff(employee.id)}
                                  color="error"
                                >
                                  <X size={20} />
                                </IconButton>
                              )}
                              {employee.status === 'off-duty' ? (
                                <IconButton
                                  size="small"
                                  onClick={() => clockIn(employee.id, selectedBranch)}
                                  color="success"
                                  disabled={!currentShiftData?.employees.includes(employee.id)}
                                >
                                  <Play size={20} />
                                </IconButton>
                              ) : (
                                <>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      setBreak(
                                        employee.id,
                                        employee.status === 'active'
                                      )
                                    }
                                    color="warning"
                                    sx={{ mr: 1 }}
                                  >
                                    <Coffee size={20} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => clockOut(employee.id)}
                                    color="error"
                                  >
                                    <Square size={20} />
                                  </IconButton>
                                </>
                              )}
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
                  {currentShiftData?.tasks.map((task) => (
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
          </TabContext>
        </Grid>
      </Grid>

      {currentShift && (
        <>
          <TaskForm
            open={isTaskFormOpen}
            onClose={() => setIsTaskFormOpen(false)}
            shiftId={currentShift as string}
            employees={branchEmployees}
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
              // Only allow closing if user cancels, not after successful upload
              if (!currentShift) {
                setIsSalesUploadOpen(false);
              }
            }}
            shiftId={currentShift || ''}
          />
        </>
      )}
    </Box>
  );
}

export default ShiftManagement;