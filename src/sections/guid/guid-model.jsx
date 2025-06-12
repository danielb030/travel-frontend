import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Chip,
  Stack,
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const initData = {
  guid_id: '',
  name: '',
  language: [],
  license: [],
  _id: '',
};

export default function GuidModal({ open, onClose, onSave, initialData, maxNumber }) {
  const [formData, setFormData] = useState(initData);
  const [newLanguage, setNewLanguage] = useState('');
  const [newLicense, setNewLicense] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
    } else {
      setFormData({ ...initData, guid_id: maxNumber + 1 });
    }
  }, [initialData, maxNumber]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddLanguage = () => {
    if (newLanguage && !formData.language.includes(newLanguage)) {
      setFormData({ ...formData, language: [...formData.language, newLanguage] });
      setNewLanguage('');
    }
  };

  const handleDeleteLanguage = (lang) => {
    setFormData({ ...formData, language: formData.language.filter((l) => l !== lang) });
  };

  const handleAddLicense = () => {
    if (newLicense && !formData.license.includes(newLicense)) {
      setFormData({ ...formData, license: [...formData.license, newLicense] });
      setNewLicense('');
    }
  };

  const handleDeleteLicense = (lic) => {
    setFormData({ ...formData, license: formData.license.filter((l) => l !== lic) });
  };

  const handleSave = () => {
    const savedData = { ...formData }; // Ensure immutability by copying formData
    onSave(savedData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        {initialData ? 'Edit Guid' : 'New Guid'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Guid No"
                name="guid_id"
                value={formData.guid_id}
                onChange={handleChange}
                type="number"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Guid Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Box>
            <TextField
              label="Add Language"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              variant="outlined"
              size="small"
              inputProps={{ style: { textTransform: 'uppercase' } }}
            />
            <Button onClick={handleAddLanguage} variant="contained" sx={{ ml: 1 }}>
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.language.map((lang) => (
              <Chip key={lang} label={lang} onDelete={() => handleDeleteLanguage(lang)} />
            ))}
          </Box>

          <Box>
            <TextField
              label="Add License"
              value={newLicense}
              onChange={(e) => setNewLicense(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Button onClick={handleAddLicense} variant="contained" sx={{ ml: 1 }}>
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.license.map((lic) => (
              <Chip key={lic} label={lic} onDelete={() => handleDeleteLicense(lic)} />
            ))}
          </Box>
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

GuidModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  initialData: PropTypes.object,
  maxNumber: PropTypes.any,
};
