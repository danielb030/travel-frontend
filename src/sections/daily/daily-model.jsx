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
  service_type: null,
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
  pickup_time: '',
  driver: '',
  license: [],
  guid: '',
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

export default function DailyModal({
  open,
  onClose,
  onSave,
  initialData,
  maxNumber,
  hotel,
  agency,
  service,
  vehicle,
  driver,
  guid,
  excursion,
}) {
  const [formData, setFormData] = useState(initData);
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
        pickup_time: formatTime(initialData.pickup_time),
      });
    } else {
      setFormData({ ...initData, dossier_no: maxNumber + 1, by: userName });
    }
  }, [initialData, maxNumber, userName]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let formattedValue = value;

    // Disable spaces for specific fields
    if (
      name === 'client' ||
      name === 'agency_ref' ||
      name === 'flight_no' ||
      name === 'inv_no' ||
      name === 'invoice_no' ||
      name === 'amount'
    ) {
      formattedValue = value.replace(/\s+/g, ''); // Remove spaces
    }
    setFormData({ ...formData, [name]: formattedValue });

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

    // Update license when guid changes
    if (name === 'guid') {
      const selectedGuid = guid.find((item) => item.name === value);
      if (selectedGuid) {
        setFormData((prevData) => ({
          ...prevData,
          guid: value,
          license: selectedGuid.license || [], // Assuming the license is stored in the guid object
        }));
      }
    }
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

  const driverOptions = driver
    .map((item) => ({ label: item.name, value: item.name }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

  const guidOptions = guid
    .map((item) => ({ label: item.name, value: item.name }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

  const excursionOptions = excursion
    .map((item) => ({ label: item.name, value: item.name }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Daily Planning</DialogTitle>
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
              <FormControl fullWidth variant="outlined">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <MenuItem value="OK">OK</MenuItem>
                  <MenuItem value="CXL">CXL</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Client"
                name="client"
                value={formData.client ? formData.client.toUpperCase() : ''}
                onChange={handleChange}
                fullWidth
                variant="outlined"
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
                  <TextField {...params} label="Agency" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Agency Reference"
                name="agency_ref"
                value={formData.agency_ref ? formData.agency_ref.toUpperCase() : ''}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Service Date"
                  name="service_date"
                  value={dayjs.utc(formData.service_date).tz('Asia/Dubai')}
                  onChange={(date) => {
                    const formattedDate = date ? date.toDate() : null;
                    setFormData({
                      ...formData,
                      service_date: formattedDate, // Set as Date object
                    });
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
                options={serviceOptions} // Array of options
                getOptionLabel={(option) => option.label.toUpperCase()} // Determines the string to display
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
                  <TextField {...params} label="Service" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="service-type-label">Service Type</InputLabel>
                <Select
                  labelId="service-type-label"
                  label="Service Type"
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                >
                  <MenuItem value="Arv">Arv</MenuItem>
                  <MenuItem value="Dep">Dep</MenuItem>
                  <MenuItem value="Inh">Inh</MenuItem>
                </Select>
              </FormControl>
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
                label="Flight No"
                name="flight_no"
                value={formData.flight_no ? formData.flight_no.toUpperCase() : ''}
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
                renderInput={(params) => <TextField {...params} label="From" variant="outlined" />}
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
                renderInput={(params) => <TextField {...params} label="To" variant="outlined" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={vehicleOptions} // Array of options
                getOptionLabel={(option) => option.label} // Determines the string to display
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
                  <TextField {...params} label="Type of Vehicle" variant="outlined" />
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

            <Grid item xs={12} sm={3}>
              <TextField
                label="Adult"
                name="adult"
                value={formData.adult}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                type="number"
                required
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
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Driver Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={driverOptions} // Array of options
                getOptionLabel={(option) => option.label} // Determines the string to display
                value={driverOptions.find((option) => option.value === formData.driver) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'driver',
                      value: newValue ? newValue.value : '',
                    },
                  });
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Driver" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={guidOptions}
                getOptionLabel={(option) => option.label}
                value={guidOptions.find((option) => option.value === formData.guid) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'guid',
                      value: newValue ? newValue.value : '',
                    },
                  });
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Guide" variant="outlined" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="License"
                name="license"
                value={
                  Array.isArray(formData.license) ? formData.license.join(', ') : formData.license
                }
                disabled
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

DailyModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  initialData: PropTypes.object,
  maxNumber: PropTypes.any,
  hotel: PropTypes.any,
  agency: PropTypes.any,
  service: PropTypes.any,
  vehicle: PropTypes.any,
  driver: PropTypes.any,
  guid: PropTypes.any,
  excursion: PropTypes.any,
};
