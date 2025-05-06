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

interface AccountFormProps {
  open: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  type: Yup.string().required('Type is required'),
  currency: Yup.string().required('Currency is required'),
  description: Yup.string(),
});

function AccountForm({ open, onClose }: AccountFormProps) {
  const { addAccount, supportedCurrencies } = useFinancialStore();

  const formik = useFormik({
    initialValues: {
      name: '',
      type: 'asset',
      currency: 'USD',
      description: '',
      balance: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      addAccount({
        ...values,
        balance: Number(values.balance),
      });
      onClose();
      formik.resetForm();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Account</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Account Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

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
                  <MenuItem value="asset">Asset</MenuItem>
                  <MenuItem value="liability">Liability</MenuItem>
                  <MenuItem value="equity">Equity</MenuItem>
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
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
                name="balance"
                label="Opening Balance"
                type="number"
                value={formik.values.balance}
                onChange={formik.handleChange}
                error={formik.touched.balance && Boolean(formik.errors.balance)}
                helperText={formik.touched.balance && formik.errors.balance}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create Account
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AccountForm;