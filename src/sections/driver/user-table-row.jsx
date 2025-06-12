import { useState } from 'react';
import PropTypes from 'prop-types';

// import Stack from '@mui/material/Stack';
// import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
// import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { formatTime } from './utils';

function formatDateToString(date) {
  if (!date) return '';

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // months are zero-indexed
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

// ----------------------------------------------------------------------

export default function UserTableRow({
  id,
  driver_no,
  order_for,
  agency,
  client,
  from,
  to,
  pickup_time,
  fligth_no,
  arb_dep,
  service_date,
  adult,
  child,
  infant,
  teen,
  resa_remark,
  veh_cat,
  veh_no,
  comments,
  editAction,
  deleteAction,
  exportAction,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEdit = () => {
    editAction();
    setOpen(null);
  };
  const handleDelete = () => {
    deleteAction();
    setOpen(null);
  };

  const handleexport = () => {
    exportAction(id);
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell>{driver_no}</TableCell>
        <TableCell>{order_for}</TableCell>
        <TableCell>{agency}</TableCell>
        <TableCell>{client}</TableCell>
        <TableCell>{from}</TableCell>
        <TableCell>{to}</TableCell>
        <TableCell>{formatTime(pickup_time)}</TableCell>
        <TableCell>{fligth_no}</TableCell>
        <TableCell>{arb_dep}</TableCell>
        <TableCell>{formatDateToString(service_date)}</TableCell>
        <TableCell>{adult}</TableCell>
        <TableCell>{child}</TableCell>
        <TableCell>{infant}</TableCell>
        <TableCell>{teen}</TableCell>
        <TableCell>{resa_remark}</TableCell>
        <TableCell>{veh_cat}</TableCell>
        <TableCell>{veh_no}</TableCell>
        <TableCell>{comments}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleexport} sx={{ color: 'success.main' }}>
          <Iconify icon="eva:download-outline" sx={{ mr: 2 }} />
          Export
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  id: PropTypes.any,
  driver_no: PropTypes.any,
  order_for: PropTypes.any,
  agency: PropTypes.any,
  client: PropTypes.any,
  from: PropTypes.any,
  to: PropTypes.any,
  pickup_time: PropTypes.any,
  fligth_no: PropTypes.any,
  arb_dep: PropTypes.any,
  service_date: PropTypes.any,
  adult: PropTypes.any,
  child: PropTypes.any,
  infant: PropTypes.any,
  teen: PropTypes.any,
  resa_remark: PropTypes.any,
  veh_cat: PropTypes.any,
  veh_no: PropTypes.any,
  comments: PropTypes.any,
  editAction: PropTypes.func,
  deleteAction: PropTypes.func,
  exportAction: PropTypes.func,
};
