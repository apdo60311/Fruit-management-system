import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import useInventoryStore from '../../../stores/inventoryStore';

interface MovementFormProps {
  open: boolean;
  onClose: () => void;
}

function MovementForm({ open, onClose }: MovementFormProps) {
  const { items, locations, addMovement } = useInventoryStore();
  const [formData, setFormData] = useState({
    itemId: '',
    type: 'in',
    quantity: '',
    fromLocation: '',
    toLocation: '',
    reference: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMovement({
      ...formData,
      quantity: Number(formData.quantity),
      date: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Record Inventory Movement</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Item</InputLabel>
                <Select
                  value={formData.itemId}
                  onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                  label="Item"
                >
                  {items.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  label="Type"
                >
                  <MenuItem value="in">Stock In</MenuItem>
                  <MenuItem value="out">Stock Out</MenuItem>
                  <MenuItem value="transfer">Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </Grid>

            {formData.type === 'transfer' && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>From Location</InputLabel>
                    <Select
                      value={formData.fromLocation}
                      onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                      label="From Location"
                    >
                      {locations.map((location) => (
                        <MenuItem key={location} value={location}>
                          {location}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>To Location</InputLabel>
                    <Select
                      value={formData.toLocation}
                      onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                      label="To Location"
                    >
                      {locations.map((location) => (
                        <MenuItem key={location} value={location}>
                          {location}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Record Movement
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function InventoryMovement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { movements, getItemMovements } = useInventoryStore();

  return (
    <Card elevation={0}>
      <CardContent>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Recent Movements</Typography>
          <Button
            variant="contained"
            onClick={() => setIsFormOpen(true)}
          >
            Record Movement
          </Button>
        </Box>

        <Grid container spacing={2}>
          {movements.slice(0, 4).map((movement) => (
            <Grid item xs={12} key={movement.id}>
              <Card variant="outlined">
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      {movement.type === 'in' ? (
                        <ArrowRight size={24} color="#10B981" />
                      ) : movement.type === 'out' ? (
                        <ArrowLeft size={24} color="#EF4444" />
                      ) : (
                        <ArrowRight size={24} color="#3B82F6" />
                      )}
                    </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle1">
                        {movement.type === 'in'
                          ? 'Stock In'
                          : movement.type === 'out'
                          ? 'Stock Out'
                          : 'Transfer'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(movement.date).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">
                        {movement.quantity} units
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ref: {movement.reference}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <MovementForm open={isFormOpen} onClose={() => setIsFormOpen(false)} />
      </CardContent>
    </Card>
  );
}

export default InventoryMovement;