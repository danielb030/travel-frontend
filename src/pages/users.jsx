import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Add as AddIcon, Edit as EditIcon, Check as CheckIcon, Delete as DeleteIcon, LockReset as LockResetIcon } from '@mui/icons-material';
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

  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ id: '', newPass: '', confirmPass: '' });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    axios.get(`${requestAddress}/api/admin/user`)
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);
  const isValidPassword = password => password.length >= 6;
  // Change password logic (no old password)
  // Update handleChangePassword for password changes
  const handleChangePassword = async () => {
    setPasswordError('');
    if (!passwordForm.newPass || !passwordForm.confirmPass) {
      setPasswordError('All fields are required.');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirmPass) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (!isValidPassword(passwordForm.newPass)) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    try {
      await axios.post(`${requestAddress}/api/auth/changepass/${passwordForm.id}`, {
        newPass: passwordForm.newPass,
      });
      setPasswordDialog(false);
    } catch (err) {
      setPasswordError(err.response?.data?.msg || 'Change password failed');
    }
  };
  
  const handleOpenPassword = (user) => {
    setPasswordForm({ id: user._id, newPass: '', confirmPass: '' });
    setPasswordError('');
    setPasswordDialog(true);
  };

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

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.post(`${requestAddress}/api/auth/deleteuser`, 
        { id: userId }, // Send ID in the request body
      );
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.msg || 'Delete failed');
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
    
    // Add password validation for new users
    if (!editUser && !isValidPassword(form.password)) {
      setSubmitError('Password must be at least 6 characters long');
      return;
    }

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
                <IconButton onClick={() => handleOpenPassword(user)}><LockResetIcon /></IconButton>
                <IconButton color="error" onClick={() => handleDeleteUser(user._id)}><DeleteIcon /></IconButton>
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
              helperText="Password must be at least 6 characters long"
              error={form.password && !isValidPassword(form.password)}
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
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="New Password"
            type="password"
            value={passwordForm.newPass}
            onChange={e => setPasswordForm(f => ({ ...f, newPass: e.target.value }))}
            helperText="Password must be at least 6 characters long"
            error={passwordForm.newPass && !isValidPassword(passwordForm.newPass)}
            fullWidth
          />
          <TextField
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirmPass}
            onChange={e => setPasswordForm(f => ({ ...f, confirmPass: e.target.value }))}
            fullWidth
          />
          {passwordError && (
            <Box color="error.main" mt={1} fontSize={14}>
              {passwordError}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained">Change</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}