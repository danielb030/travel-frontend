import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import PropTypes from 'prop-types';
import timezone from 'dayjs/plugin/timezone';
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
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
} from '@mui/material';

import { formatTime } from './utils';
import userStore from '../../store/userStore';

dayjs.extend(utc);
dayjs.extend(timezone);

const initData = {
  _id: '',
  dossier_no: '',
  verified: 'false',
  status: 'OK',
  service: null,
  service_type: 'Arv',
  agency_ref: '',
  client: '',
  agency: null,
  from: null,
  to: null,
  excursion: '',
  service_date: '',
  flight_no: '',
  flight_time: '',
  adult: '',
  child: '',
  infant: '',
  teen: '',
  resa_remark: '',
  from_region: null,
  to_region: null,
  vehicle_type: null,
  invoice_no: '',
  amount: '',
  adult_price: '',
  child_price: '',
  teen_price: '',
  total_price: '',
  currency: 'USD',
  last_update: '',
  license: [],
};

const verifyUserList = [
  'Angelique',
  'Arielle',
  'Jenny M',
  'Magda',
  'Karen',
  'Jenny A',
  'Walyd',
  'Mkaribu',
];

export default function ResaModal({
  open,
  onClose,
  onSave,
  initialData,
  maxNumber,
  hotel,
  agency,
  service,
  vehicle,
  excursion,
}) {
  const [formData, setFormData] = useState(initData);
  const [errors, setErrors] = useState({});
  const { name: userName } = userStore();

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
        flight_time: formatTime(initialData.flight_time),
      });
    } else {
      setFormData({ ...initData, dossier_no: maxNumber + 1, by: userName });
    }
  }, [initialData, maxNumber, userName]);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'status',
      'service',
      'service_type',
      'agency_ref',
      'client',
      'agency',
      'from',
      'to',
      'service_date',
      'vehicle_type',
      'adult',
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field] === '') {
        newErrors[field] = 'This field is required';
      } else if (typeof formData[field] === 'string' && formData[field].trim() === '') {
        newErrors[field] = 'Can not be empty string';
      }
    });

    if (formData.service_date < new Date()) {
      newErrors.service_date = 'Service date can not be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let formattedValue = value;

    // Disable spaces for specific fields

    // Convert to uppercase for specific fields
    if (name === 'client' || name === 'agency_ref' || name === 'flight_no' || name === 'inv_no') {
      formattedValue = formattedValue.toUpperCase();
    }

    setFormData({ ...formData, [name]: formattedValue });
    setErrors({ ...errors, [name]: '' }); // Clear error when field is changed

    // Update region when "from" or "to" changes
    if (name === 'from' || name === 'to') {
      const selectedHotel = hotel.find((item) => item.name === value);
      if (selectedHotel) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          [`${name}_region`]: selectedHotel.h_region,
        }));
      }
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      const savedData = { ...formData };

      savedData.client = savedData.client.trim();
      savedData.agency_ref = savedData.agency_ref.trim();
      savedData.flight_no = savedData.flight_no.trim();
      savedData.invoice_no = savedData.invoice_no ? savedData.invoice_no.trim() : '';
      Object.entries(savedData).forEach(([key, value]) => {
        if (value instanceof Date) {
          const date = new Date(value);
          // const timezoneOffsetHours = -date.getTimezoneOffset() / 60;

          // const newDate =
          //   timezoneOffsetHours === 2 ? new Date(date.getTime() + 10800000).toString() : value;

          savedData[key] = date;
        } else {
          const time = Date.parse(`1970-01-01T${value}`);
          if (!Number.isNaN(time)) {
            savedData[key] = formatTimeToString(time);
          }
        }
      });
      onSave(savedData);
      onClose();
    }
  };

  const agencyOptions = agency
    .map((item) => ({
      label: item.name,
      value: item.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

  const hotelOptions = hotel
    .map((item) => ({
      label: item.name,
      value: item.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

  const serviceOptions = service
    .map((item) => ({ label: item.name, value: item.name }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

  const vehicleOptions = vehicle
    .map((item) => ({ label: item.name, value: item.name }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

  const excursionOptions = excursion
    .map((item) => ({ label: item.name, value: item.name }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        {initialData ? 'Edit Reservation' : 'New Reservation'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ mt: 2 }}>
            General Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dossier No"
                name="dossier_no"
                disabled
                value={formData.dossier_no}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="By"
                name="by"
                value={formData.by}
                disabled
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="verified-label">Verified</InputLabel>
                <Select
                  labelId="verified-label"
                  label="Verified"
                  name="verified"
                  value={formData.verified}
                  onChange={handleChange}
                  disabled={!verifyUserList.includes(userName)}
                >
                  <MenuItem value="false">Not Verified</MenuItem>
                  <MenuItem value="true">Verified</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" error={!!errors.status} required>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="OK">OK</MenuItem>
                  <MenuItem value="CXL">CXL</MenuItem>
                </Select>
                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                error={!!errors.client}
                helperText={errors.client}
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={agencyOptions}
                getOptionLabel={(option) => option.label.toUpperCase()}
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
                  <TextField
                    {...params}
                    label="Agency"
                    variant="outlined"
                    required
                    error={!!errors.agency}
                    helperText={errors.agency}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Agency Ref"
                name="agency_ref"
                value={formData.agency_ref}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                error={!!errors.agency_ref}
                helperText={errors.agency_ref}
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Service Date"
                  name="service_date"
                  value={dayjs(formData.service_date)}
                  error={!!errors.service_date}
                  helperText={errors.service_date}
                  onChange={(date) => {
                    const formattedDate = date ? date.toDate() : null;
                    setFormData({
                      ...formData,
                      service_date: formattedDate, // Set as Date object
                    });
                    setErrors({ ...errors, service_date: '' });
                  }}
                  minDate={dayjs()}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Service Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={serviceOptions}
                getOptionLabel={(option) => option.label.toUpperCase()}
                value={serviceOptions.find((option) => option.value === formData.service) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'service',
                      value: newValue ? newValue.value : '',
                    },
                  });
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Service"
                    variant="outlined"
                    required
                    error={!!errors.service}
                    helperText={errors.service}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" error={!!errors.service_type} required>
                <InputLabel id="service-type-label">Service Type</InputLabel>
                <Select
                  labelId="service-type-label"
                  label="Service Type"
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Arv">Arv</MenuItem>
                  <MenuItem value="Dep">Dep</MenuItem>
                  <MenuItem value="Inh">Inh</MenuItem>
                </Select>
                {errors.service_type && <FormHelperText>{errors.service_type}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Flight No"
                name="flight_no"
                value={formData.flight_no}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Flight Time"
                name="flight_time"
                value={formData.flight_time}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="time"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={hotelOptions}
                getOptionLabel={(option) => option.label}
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
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="From"
                    variant="outlined"
                    required
                    error={!!errors.from}
                    helperText={errors.from}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Region From"
                name="from_region"
                value={formData.from_region || ''}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={hotelOptions}
                getOptionLabel={(option) => option.label}
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
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="To"
                    variant="outlined"
                    required
                    error={!!errors.to}
                    helperText={errors.to}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Region To"
                name="to_region"
                value={formData.to_region || ''}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={vehicleOptions}
                getOptionLabel={(option) => option.label}
                value={
                  vehicleOptions.find((option) => option.value === formData.vehicle_type) || null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'vehicle_type',
                      value: newValue ? newValue.value : '',
                    },
                  });
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type of Vehicle"
                    variant="outlined"
                    required
                    error={!!errors.vehicle_type}
                    helperText={errors.vehicle_type}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={excursionOptions}
                getOptionLabel={(option) => option.label}
                value={
                  excursionOptions.find((option) => option.value === formData.excursion) || null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'excursion',
                      value: newValue ? newValue.value : '',
                    },
                  });
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Excursion" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Remarks"
                name="resa_remark"
                value={formData.resa_remark}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Pricing Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Adult"
                name="adult"
                value={formData.adult}
                onChange={handleChange}
                fullWidth
                error={!!errors.adult}
                helperText={errors.adult}
                variant="outlined"
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Adult Price"
                name="adult_price"
                value={formData.adult_price}
                onChange={handleChange}
                error={!!errors.adult_price}
                helperText={errors.adult_price}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Child (3-11)"
                name="child"
                value={formData.child}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
                required
                error={!!errors.child}
                helperText={errors.child}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Child Price"
                name="child_price"
                value={formData.child_price}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Teen (12-18)"
                name="teen"
                value={formData.teen}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Teen Price"
                name="teen_price"
                value={formData.teen_price}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Infant (0-2)"
                name="infant"
                value={formData.infant}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Total Price"
                name="total_price"
                value={
                  formData.adult_price * formData.adult +
                  formData.child_price * formData.child +
                  formData.teen_price * formData.teen
                }
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
                disabled
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Additional Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="currency-label">Currency</InputLabel>
                <Select
                  labelId="currency-label"
                  label="Currency"
                  name="cur"
                  value={formData.cur}
                  onChange={handleChange}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="TZS">TZS</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Invoice No"
                name="invoice_no"
                value={formData.invoice_no}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
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

ResaModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  initialData: PropTypes.object,
  maxNumber: PropTypes.any,
  hotel: PropTypes.any,
  agency: PropTypes.any,
  service: PropTypes.any,
  vehicle: PropTypes.any,
  excursion: PropTypes.any,
};
