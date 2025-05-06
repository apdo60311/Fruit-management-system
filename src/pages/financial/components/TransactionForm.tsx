import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useFinancialStore from '../../../stores/financialStore';

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object({
  type: Yup.string().required('Type is required'),
  amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
  currency: Yup.string().required('Currency is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  reference: Yup.string().required('Reference is required'),
});

function TransactionForm({ open, onClose }: TransactionFormProps) {
  const { addTransaction, supportedCurrencies } = useFinancialStore();

  const formik = useFormik({
    initialValues: {
      type: 'credit',
      amount: '',
      currency: 'USD',
      description: '',
      category: '',
      reference: '',
      status: 'pending',
    },
    validationSchema,
    onSubmit: (values) => {
      addTransaction({
        ...values,
        date: new Date().toISOString(),
        amount: Number(values.amount),
      });
      onClose();
      formik.resetForm();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Transaction</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  error={formik.touched.type && Boolean(formik.errors.type)}
                  label="Type"
                >
                  <MenuItem value="credit">Credit</MenuItem>
                  <MenuItem value="debit">Debit</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  name="currency"
                  value={formik.values.currency}
                  onChange={formik.handleChange}
                  error={formik.touched.currency && Boolean(formik.errors.currency)}
                  label="Currency"
                >
                  {supportedCurrencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="amount"
                label="Amount"
                type="number"
                value={formik.values.amount}
                onChange={formik.handleChange}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="category"
                label="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="reference"
                label="Reference"
                value={formik.values.reference}
                onChange={formik.handleChange}
                error={formik.touched.reference && Boolean(formik.errors.reference)}
                helperText={formik.touched.reference && formik.errors.reference}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create Transaction
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TransactionForm;