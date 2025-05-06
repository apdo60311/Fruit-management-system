import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box
} from '@mui/material';
import { FileText, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import useFinancialStore from '../../../stores/financialStore';

interface GenerateReportDialogProps {
  open: boolean;
  onClose: () => void;
}

function GenerateReportDialog({ open, onClose }: GenerateReportDialogProps) {
  const [reportType, setReportType] = useState('balance-sheet');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const { transactions, accounts } = useFinancialStore();

  const generateReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add header
    doc.setFontSize(20);
    doc.text('Financial Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Report Type: ${reportType.replace('-', ' ').toUpperCase()}`, 20, 40);
    doc.text(`Period: ${dateRange.startDate} to ${dateRange.endDate}`, 20, 50);
    
    // Add content based on report type
    let yPos = 70;
    
    if (reportType === 'balance-sheet') {
      // Assets
      doc.setFontSize(14);
      doc.text('Assets', 20, yPos);
      yPos += 10;
      
      accounts
        .filter(account => account.type === 'asset')
        .forEach(account => {
          doc.setFontSize(12);
          doc.text(`${account.name}: $${account.balance.toLocaleString()}`, 30, yPos);
          yPos += 10;
        });
      
      // Liabilities
      yPos += 10;
      doc.setFontSize(14);
      doc.text('Liabilities', 20, yPos);
      yPos += 10;
      
      accounts
        .filter(account => account.type === 'liability')
        .forEach(account => {
          doc.setFontSize(12);
          doc.text(`${account.name}: $${account.balance.toLocaleString()}`, 30, yPos);
          yPos += 10;
        });
    }
    
    // Save the PDF
    doc.save(`financial-report-${reportType}-${dateRange.startDate}.pdf`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generate Financial Report</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Report Type"
              >
                <MenuItem value="balance-sheet">Balance Sheet</MenuItem>
                <MenuItem value="income-statement">Income Statement</MenuItem>
                <MenuItem value="cash-flow">Cash Flow Statement</MenuItem>
                <MenuItem value="trial-balance">Trial Balance</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Report Preview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This report will include:
              </Typography>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                <li>Financial data from {dateRange.startDate} to {dateRange.endDate}</li>
                <li>Summary of all transactions</li>
                <li>Account balances and reconciliation</li>
                <li>Charts and graphs for visualization</li>
              </ul>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={generateReport}
          startIcon={<FileText size={18} />}
        >
          Generate Report
        </Button>
        <Button
          variant="outlined"
          onClick={generateReport}
          startIcon={<Download size={18} />}
        >
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GenerateReportDialog;