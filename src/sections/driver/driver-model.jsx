import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Grid,
  Stack,
  Dialog,
  Button,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { formatTime } from './utils';

const initData = {
  driver_no: null,
  order_for: null,
  agency: null,
  client: null,
  from: null,
  to: null,
  pickup_time: null,
  fligth_no: null,
  arb_dep: null,
  service_date: null,
  adult: null,
  child: null,
  infant: null,
  teen: null,
  resa_remark: null,
  veh_cat: null,
  veh_no: null,
  comments: null,
  _id: '',
};

export default function DriverModal({
  open,
  onClose,
  onSave,
  initialData,
  maxNumber,
  hotel,
  agency,
}) {
  const [formData, setFormData] = useState(initData);

  function formatTimeToString(time) {
    const d = new Date(time);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        pickup_time: formatTime(initialData.pickup_time),
      });
    } else {
      setFormData({ ...initData, driver_no: maxNumber + 1 });
    }
  }, [initialData, maxNumber]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    const savedData = { ...formData }; // Ensure immutability by copying formData
    Object.entries(savedData).forEach(([key, value]) => {
      if (value instanceof Date) {
        const date = new Date(value);
        const timezoneOffsetHours = -date.getTimezoneOffset() / 60;

        const newDate =
          timezoneOffsetHours === 2 ? new Date(date.getTime() + 10800000).toString() : value;

        savedData[key] = newDate;
      } else {
        const time = Date.parse(`1970-01-01T${value}`);
        if (!Number.isNaN(time)) {
          savedData[key] = formatTimeToString(time);
        }
      }
    });
    onSave(savedData);
    onClose();
  };

  const agencyOptions = agency.map((item) => ({ label: item.name, value: item.name }));
  const hotelOptions = hotel.map((item) => ({ label: item.name, value: item.name }));
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        {initialData ? 'Edit Driver Data' : 'New Driver Data'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ mt: 2 }}>
            General Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data No"
                name="driver_no"
                value={formData.driver_no}
                disabled
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Transfer order for"
                name="order_for"
                value={formData.order_for}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={agencyOptions} // Array of options
                getOptionLabel={(option) => option.label} // Determines the string to display
                value={agencyOptions.find((option) => option.value === formData.agency) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'agency',
                      value: newValue ? newValue.value : '',
                    },
                  });
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Agency" variant="outlined" />
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Service Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={hotelOptions} // Array of options
                getOptionLabel={(option) => option.label} // Determines the string to display
                value={hotelOptions.find((option) => option.value === formData.from) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'from',
                      value: newValue ? newValue.value : '',
                    },
                  });
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="From" variant="outlined" />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={hotelOptions} // Array of options
                getOptionLabel={(option) => option.label} // Determines the string to display
                value={hotelOptions.find((option) => option.value === formData.to) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'to',
                      value: newValue ? newValue.value : '',
                    },
                  });
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="To" variant="outlined" />}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Service Date"
                  name="service_date"
                  value={dayjs(formData.service_date)}
                  onChange={(date) =>
                    setFormData({ ...formData, service_date: date ? dayjs(date).toDate() : null })
                  }
                  fullWidth
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Arrival/Departure"
                name="arb_dep"
                value={formData.arb_dep}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Pickup Time"
                name="pickup_time"
                value={formData.pickup_time}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="time"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Flight No"
                name="fligth_no"
                value={formData.fligth_no}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Adult"
                name="adult"
                value={formData.adult}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Child"
                name="child"
                value={formData.child}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Infant"
                name="infant"
                value={formData.infant}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Teen"
                name="teen"
                value={formData.teen}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Resa_remarks"
                name="resa_remark"
                value={formData.resa_remark}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Driver Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vehicle Category"
                name="veh_cat"
                value={formData.veh_cat}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vehicle No"
                name="veh_no"
                value={formData.veh_no}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Comments"
                name="comments"
                value={formData.comments}
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

DriverModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  initialData: PropTypes.object,
  maxNumber: PropTypes.any,
  hotel: PropTypes.any,
  agency: PropTypes.any,
};
