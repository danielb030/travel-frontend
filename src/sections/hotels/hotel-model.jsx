import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import {
  Grid,
  Stack,
  Dialog,
  Select,
  Button,
  MenuItem,
  TextField,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  FormHelperText,
} from '@mui/material';

const initData = {
  hotel_id: '',
  name: '',
  h_group: '',
  h_addr: '',
  h_region: '',
  h_plan_region: '',
  _id: '',
};

export default function Hotel({ open, onClose, onSave, initialData, maxNumber }) {
  const [formData, setFormData] = useState(initData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
    } else {
      setFormData({ ...initData, hotel_id: maxNumber + 1 });
    }
  }, [initialData, maxNumber]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedValue = name === 'name' ? value.toUpperCase() : value;
    setFormData({ ...formData, [name]: updatedValue });
    // Clear error when field is filled
    if (name === 'h_region' && value) {
      setFormErrors({ ...formErrors, h_region: '' });
    }
  };

  const handleSave = () => {
    // Validate hotel region
    if (!formData.h_region) {
      setFormErrors({ ...formErrors, h_region: 'Hotel Region is required' });
      return;
    }
    const savedData = { ...formData };
    onSave(savedData);
    onClose();
  };

  const regions = [
    'Intra City',
    'North',
    'North East',
    'North West',
    'Not applicable',
    'Pemba Island',
    'South',
    'South East',
    'Tanzania',
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        {initialData ? 'Edit Hotel' : 'New Hotel'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hotel No"
                name="hotel_id"
                value={formData.hotel_id}
                onChange={handleChange}
                type="number"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hotel Name"
                name="name"
                value={formData.name}
                onChange={(e) => {
                  const uppercaseName = e.target.value.toUpperCase();
                  setFormData({ ...formData, name: uppercaseName });
                }}
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hotel Group"
                name="h_group"
                value={formData.h_group}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hotel Address"
                name="h_addr"
                value={formData.h_addr}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" error={!!formErrors.h_region} required>
                <InputLabel id="hotel-region-label">Hotel Region</InputLabel>
                <Select
                  labelId="hotel-region-label"
                  label="Hotel Region"
                  name="h_region"
                  value={formData.h_region}
                  onChange={handleChange}
                >
                  {regions.map((region) => (
                    <MenuItem key={region} value={region}>
                      {region}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.h_region && <FormHelperText>{formErrors.h_region}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hotel Plan Region"
                name="h_plan_region"
                value={formData.h_plan_region}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

Hotel.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  initialData: PropTypes.object,
  maxNumber: PropTypes.any,
};
