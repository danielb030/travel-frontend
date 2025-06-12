import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Add as AddIcon, Edit as EditIcon, Check as CheckIcon } from '@mui/icons-material';
import {
  Box, Table, Button, Dialog, Checkbox, TableRow, TableBody, TableCell, TableHead, TextField, IconButton, DialogTitle, DialogActions, DialogContent
} from '@mui/material';

// const requestAddress = 'https://escapadezanzibar.exclusive-technology.net';
const requestAddress = 'https://escapadezanzibar.exclusive-technology.net';

const PERMISSION_FIELDS = [
  { key: 'insert', label: 'Insert New' },
  { key: 'amend', label: 'Amend' },
  { key: 'delete', label: 'Delete' },
  { key: 'addAgency', label: 'Add Agency' },
  { key: 'addHotel', label: 'Add Hotel' },
  { key: 'addExcursion', label: 'Add Excursion' },
  { key: 'addVehicle', label: 'Add Vehicle' },
  { key: 'addDriver', label: 'Add Driver' },
  { key: 'addGuide', label: 'Add Guide' },
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    permissions: PERMISSION_FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: false }), {}),
  });
  const [emailError, setEmailError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    axios.get(`${requestAddress}/api/admin/user`)
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  const handleOpen = (user = null) => {
    setEditUser(user);
    setForm(
      user
        ? {
            name: user.name,
            email: user.email,
            password: '',
            role: user.role || '',
            permissions: user.permissions
              ? user.permissions
              : PERMISSION_FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: false }), {}),
          }
        : {
            name: '',
            email: '',
            password: '',
            permissions: PERMISSION_FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: false }), {}),
          }
    );
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'email') {
      if (!isValidEmail(e.target.value)) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('');
      }
    }
  };

  const handlePermissionChange = key => {
    setForm(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: !prev.permissions[key] },
    }));
  };

  const handleSubmit = async () => {
    setSubmitError('');
    if (!isValidEmail(form.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    try {
      if (editUser) {
        await axios.post(`${requestAddress}/api/auth/changeuser`, {
          id: editUser._id,
          name: form.name,
          email: form.email,
          permissions: form.permissions,
        });
      } else {
        await axios.post(`${requestAddress}/api/auth/signup`, {
          name: form.name,
          email: form.email,
          password: form.password,
          permissions: form.permissions,
        });
      }
      axios.get(`${requestAddress}/api/admin/user`)
        .then(res => setUsers(res.data))
        .catch(() => setUsers([]));
      handleClose();
    } catch (err) {
      setSubmitError(err.response?.data?.msg || 'Unknown error');
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>User Management</h2>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add User</Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            {PERMISSION_FIELDS.map(field => (
              <TableCell key={field.key} align="center">{field.label}</TableCell>
            ))}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              {PERMISSION_FIELDS.map(field => (
                <TableCell key={field.key} align="center">
                  {user.permissions?.[field.key] && <CheckIcon color="success" />}
                </TableCell>
              ))}
              <TableCell align="right">
                <IconButton onClick={() => handleOpen(user)}><EditIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={!!emailError}
            helperText={emailError}
            fullWidth
          />
          {!editUser && (
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
            />
          )}
          <Box>
            <Box fontWeight="bold" mb={1}>Permissions</Box>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {PERMISSION_FIELDS.map(field => (
                <Box key={field.key} display="flex" alignItems="center">
                  <Checkbox
                    checked={!!form.permissions[field.key] || form.role === 'admin'}
                    onChange={() => handlePermissionChange(field.key)}
                  />
                  {field.label}
                </Box>
              ))}
            </Box>
          </Box>
          {submitError && (
            <Box color="error.main" mt={1} fontSize={14}>
              {submitError}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!!emailError}>{editUser ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}