import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableToolbar({
  filterName,
  onFilterName,
  onNewExcursion,
  pdfAction,
  excelAction,
}) {
  const [open, setOpen] = useState(null);

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
        }}
      >
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search Excursion..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={onNewExcursion}
        >
          New Excursion
        </Button>
        <Button onClick={handleOpenMenu} sx={{ ml: 2 }} variant="contained" color="secondary">
          <Iconify icon="eva:more-vertical-fill" />
          Export Data
        </Button>
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
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onNewExcursion: PropTypes.func,
  pdfAction: PropTypes.func,
  excelAction: PropTypes.func,
};
