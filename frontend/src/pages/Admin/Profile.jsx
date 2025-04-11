import React, { useState, useEffect } from 'react';
import { 
  Card, Avatar, Button, Typography, Divider, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, IconButton, Box, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

const ProfileContainer = styled('div')({
  padding: '24px',
  maxWidth: '1200px',
  margin: '0 auto',
});

const ProfileHeader = styled('div')({
  background: 'linear-gradient(135deg, #00BCD4 0%, #80DEEA 100%)',
  borderRadius: '12px',
  padding: '32px',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  marginBottom: '24px',
  position: 'relative',
});

const InfoCard = styled(Card)({
  padding: '24px',
  marginBottom: '24px',
  '& .MuiTypography-root': {
    marginBottom: '8px',
  },
});

const LargeAvatar = styled(Avatar)({
  width: 120,
  height: 120,
  marginBottom: '16px',
  border: '4px solid white',
});

const AvatarContainer = styled('div')({
  position: 'relative',
  '&:hover .MuiIconButton-root': {
    opacity: 1,
  },
});

const AvatarEditButton = styled(IconButton)({
  position: 'absolute',
  bottom: 20,
  right: -10,
  backgroundColor: 'white',
  padding: '8px',
  opacity: 0,
  transition: 'opacity 0.3s',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
  padding: '12px',
  borderRadius: '8px',
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

const InfoLabel = styled(Typography)({
  fontWeight: 'bold',
  width: '150px',
  color: '#666',
});

const InfoValue = styled(Typography)({
  flex: 1,
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: '16px',
  },
  '& .MuiDialogTitle-root': {
    background: 'linear-gradient(135deg, #00BCD4 0%, #80DEEA 100%)',
    color: 'white',
    borderRadius: '8px 8px 0 0',
    padding: '16px 24px',
    position: 'relative',
    marginBottom: '20px',
  },
  '& .MuiDialogContent-root': {
    padding: '24px',
  },
  '& .MuiDialogActions-root': {
    padding: '16px 24px',
    borderTop: '1px solid #eee',
  },
}));

const CloseButton = styled(IconButton)({
  position: 'absolute',
  right: 8,
  top: 8,
  color: 'white',
});

const DialogIconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  '& .MuiSvgIcon-root': {
    fontSize: '28px',
  },
});

const Profile = () => {
  const [admin, setAdmin] = useState({
    firstName: 'Admin',
    lastName: 'User',
    username: 'admin',
    email: 'admin@example.com',
    phone: '0123456789',
    nationality: 'Vietnam',
    city: 'Ho Chi Minh City',
    profilePicture: null,
    role: 'admin'
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [editData, setEditData] = useState({...admin});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const handleEditOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);
  const handlePasswordOpen = () => setOpenPassword(true);
  const handlePasswordClose = () => setOpenPassword(false);

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Handle avatar upload
      console.log('Avatar file:', file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // TODO: API call to update profile
      setAdmin(editData);
      setAlert({ show: true, message: 'Profile updated successfully!', type: 'success' });
      handleEditClose();
    } catch (error) {
      setAlert({ show: true, message: 'Failed to update profile', type: 'error' });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({ show: true, message: 'Passwords do not match!', type: 'error' });
      return;
    }
    try {
      // TODO: API call to change password
      setAlert({ show: true, message: 'Password changed successfully!', type: 'success' });
      handlePasswordClose();
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setAlert({ show: true, message: 'Failed to change password', type: 'error' });
    }
  };

  return (
    <ProfileContainer>
      {alert.show && (
        <Alert 
          severity={alert.type} 
          sx={{ mb: 2 }}
          onClose={() => setAlert({ ...alert, show: false })}
        >
          {alert.message}
        </Alert>
      )}

      <ProfileHeader>
        <AvatarContainer>
          <LargeAvatar 
            src={admin.profilePicture} 
            alt={admin.username}
          />
          <AvatarEditButton color="primary" component="label">
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleAvatarChange}
            />
            <PhotoCamera />
          </AvatarEditButton>
        </AvatarContainer>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {admin.firstName} {admin.lastName}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
        </Typography>
        <Button 
          variant="contained" 
          color="inherit"
          startIcon={<EditIcon />}
          onClick={handleEditOpen}
          sx={{ 
            color: '#00BCD4', 
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            }
          }}
        >
          Update personal info
        </Button>
      </ProfileHeader>

      <InfoCard>
        <Typography variant="h6" color="primary" gutterBottom>
          Personal Information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <InfoItem>
          <InfoLabel>Username</InfoLabel>
          <InfoValue>{admin.username}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Email</InfoLabel>
          <InfoValue>{admin.email}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Phone</InfoLabel>
          <InfoValue>{admin.phone}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Nationality</InfoLabel>
          <InfoValue>{admin.nationality}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>City</InfoLabel>
          <InfoValue>{admin.city}</InfoValue>
        </InfoItem>
      </InfoCard>

      <InfoCard>
        <Typography variant="h6" color="primary" gutterBottom>
          Account Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={<EditIcon />}
          onClick={handlePasswordOpen}
          sx={{ mr: 2 }}
        >
          Change Password
        </Button>
      </InfoCard>

      {/* Edit Profile Dialog */}
      <StyledDialog open={openEdit} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <DialogIconWrapper>
            <PersonIcon />
            <Typography variant="h6" component="span">
              Update Profile
            </Typography>
          </DialogIconWrapper>
          <CloseButton onClick={handleEditClose}>
            <CloseIcon />
          </CloseButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={editData.firstName}
                onChange={handleEditChange}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={editData.lastName}
                onChange={handleEditChange}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={editData.phone}
                onChange={handleEditChange}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nationality"
                name="nationality"
                value={editData.nationality}
                onChange={handleEditChange}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={editData.city}
                onChange={handleEditChange}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleEditClose}
            variant="outlined"
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateProfile} 
            variant="contained" 
            color="primary"
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              px: 3,
              background: 'linear-gradient(135deg, #00BCD4 0%, #80DEEA 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00ACC1 0%, #4DD0E1 100%)',
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Change Password Dialog */}
      <StyledDialog open={openPassword} onClose={handlePasswordClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <DialogIconWrapper>
            <LockIcon />
            <Typography variant="h6" component="span">
              Change Password
            </Typography>
          </DialogIconWrapper>
          <CloseButton onClick={handlePasswordClose}>
            <CloseIcon />
          </CloseButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handlePasswordClose}
            variant="outlined"
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained" 
            color="primary"
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              px: 3,
              background: 'linear-gradient(135deg, #00BCD4 0%, #80DEEA 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00ACC1 0%, #4DD0E1 100%)',
              }
            }}
          >
            Change Password
          </Button>
        </DialogActions>
      </StyledDialog>
    </ProfileContainer>
  );
};

export default Profile;
