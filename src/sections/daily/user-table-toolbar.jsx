import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Iconify from 'src/components/iconify';

dayjs.extend(utc);

// ----------------------------------------------------------------------

export default function UserTableToolbar({
  onGetDate,
  onGetEndDate,
  NewAction,
  pdfAction,
  excelAction,
  loading,
}) {
  const [open, setOpen] = useState(null);

  const handleDateChange = (newDate) => {
    const date = dayjs(newDate).toDate();
    onGetDate(date);
  };

  const handleEndDateChange = (newDate) => {
    const date = dayjs(newDate).toDate();
    onGetEndDate(date);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const exportPdf = () => {
    pdfAction();
    setOpen(null);
  };

  const exportExcel = () => {
    excelAction();
    setOpen(null);
  };

  return (
    <>
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Start Date"
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                clearable: true,
                onClear: () => handleDateChange(null),
              },
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ ml: 4 }}>
          <DatePicker
            sx={{ ml: 4 }}
            label="Select End Date"
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                clearable: true,
                onClear: () => handleEndDateChange(null),
              },
            }}
            onChange={handleEndDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <>
          <Button
            variant="contained"
            onClick={NewAction}
            format="DD/MM/YYYY"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            disabled={loading}
          >
            {loading ? 'Loading Data...' : 'New Daily Data'}{' '}
          </Button>

          <Button onClick={handleOpenMenu} sx={{ ml: 2 }} variant="contained" color="secondary">
            <Iconify icon="eva:more-vertical-fill" />
            Export Data
          </Button>
        </>
      </Toolbar>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={exportPdf}>
          {/* <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} /> */}
          PDF
        </MenuItem>

        <MenuItem onClick={exportExcel} sx={{ color: 'error.main' }}>
          {/* <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} /> */}
          EXCEL
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableToolbar.propTypes = {
  onGetDate: PropTypes.func,
  onGetEndDate: PropTypes.func,
  NewAction: PropTypes.func,
  pdfAction: PropTypes.func,
  excelAction: PropTypes.func,
  loading: PropTypes.any,
};
