import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Iconify from 'src/components/iconify';

dayjs.extend(utc);

// ----------------------------------------------------------------------

export default function UserTableToolbar({ onGetDate, onGetEndDate, NewAction, loading }) {
  const handleDateChange = (newDate) => {
    const date = dayjs(newDate).toDate();
    onGetDate(date);
  };

  const handleEndDateChange = (newDate) => {
    const date = dayjs(newDate).toDate();
    onGetEndDate(date);
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        color: 'primary.main',
        bgcolor: '#aaf4ff',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Start Date"
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select End Date"
            onChange={handleEndDateChange}
            renderInput={(params) => <TextField {...params} sx={{ ml: 4 }} />}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ ml: 'auto' }}>
        <Button
          variant="contained"
          onClick={NewAction}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          disabled={loading}
        >
          {loading ? 'Loading Data...' : 'New Driver Plan Data'}
        </Button>
      </Box>
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  onGetDate: PropTypes.func.isRequired,
  onGetEndDate: PropTypes.func.isRequired,
  NewAction: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
