import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Tabs, Tab, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DollarSign, TrendingUp, Receipt, CreditCard, FileText, Download } from 'lucide-react';
import useFinancialStore from '../../stores/financialStore';

// Components will be implemented in separate files
import TransactionForm from './components/TransactionForm';
import AccountForm from './components/AccountForm';
import FinancialChart from './components/FinancialChart';
import GenerateReportDialog from './components/GenerateReportDialog';

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
      id={`financial-tabpanel-${index}`}
      aria-labelledby={`financial-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const transactionColumns: GridColDef[] = [
  { field: 'date', headerName: 'Date', width: 120 },
  { field: 'type', headerName: 'Type', width: 100 },
  { field: 'amount', headerName: 'Amount', width: 120,
    valueFormatter: (params) => {
      const value = params.value as number;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    }
  },
  { field: 'currency', headerName: 'Currency', width: 100 },
  { field: 'description', headerName: 'Description', width: 200 },
  { field: 'category', headerName: 'Category', width: 150 },
  { field: 'reference', headerName: 'Reference', width: 150 },
  { field: 'status', headerName: 'Status', width: 120 }
];

function FinancialManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [isReportDialogOpen, setReportDialogOpen] = useState(false);
  const { transactions, accounts, getBalance, getCashFlow } = useFinancialStore();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const totalAssets = accounts
    .filter(account => account.type === 'asset')
    .reduce((sum, account) => sum + account.balance, 0);

  const totalLiabilities = accounts
    .filter(account => account.type === 'liability')
    .reduce((sum, account) => sum + account.balance, 0);

  const monthlyRevenue = transactions
    .filter(t => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Financial Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage your financial transactions, accounts, and reports
        </Typography>
      </Box>

      {/* Financial Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: 'primary.light',
                    borderRadius: 1,
                    p: 1,
                    mr: 2
                  }}
                >
                  <DollarSign size={24} color="#1976d2" />
                </Box>
                <Typography variant="subtitle1">Total Assets</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                ${totalAssets.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Net worth across all accounts
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: 'success.light',
                    borderRadius: 1,
                    p: 1,
                    mr: 2
                  }}
                >
                  <TrendingUp size={24} color="#2e7d32" />
                </Box>
                <Typography variant="subtitle1">Monthly Revenue</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                ${monthlyRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total income this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: 'error.light',
                    borderRadius: 1,
                    p: 1,
                    mr: 2
                  }}
                >
                  <Receipt size={24} color="#d32f2f" />
                </Box>
                <Typography variant="subtitle1">Monthly Expenses</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                ${monthlyExpenses.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total expenses this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: 'warning.light',
                    borderRadius: 1,
                    p: 1,
                    mr: 2
                  }}
                >
                  <CreditCard size={24} color="#ed6c02" />
                </Box>
                <Typography variant="subtitle1">Liabilities</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                ${totalLiabilities.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total outstanding debts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card elevation={0}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Transactions" />
            <Tab label="Accounts" />
            <Tab label="Reports" />
          </Tabs>
        </Box>

        {/* Transactions Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<FileText size={18} />}
              sx={{ mr: 2 }}
            >
              New Transaction
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download size={18} />}
            >
              Export
            </Button>
          </Box>
          <DataGrid
            rows={transactions}
            columns={transactionColumns}
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
        </TabPanel>

        {/* Accounts Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Chart of Accounts
          </Typography>
          {/* Account management interface will be implemented here */}
        </TabPanel>

        {/* Reports Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Financial Reports
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => setReportDialogOpen(true)}
              >
                Balance Sheet
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => setReportDialogOpen(true)}
              >
                Profit & Loss
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => setReportDialogOpen(true)}
              >
                Cash Flow
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Report Generation Dialog */}
      <GenerateReportDialog
        open={isReportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
      />
    </Box>
  );
}

export default FinancialManagement;