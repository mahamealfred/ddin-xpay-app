import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function LogoutDialog({ openDialog, handleLogout, handleContinue, onClose }) {
  return (
    <Dialog
      open={openDialog}
     // onClose={onClose}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)', // Dark semi-transparent background
          borderRadius: '12px',
          padding: '20px',
          width: { xs: '90%', sm: '400px', md: '500px' },
          textAlign: 'center',
        },
      }}
    >
      <DialogTitle
        id="logout-dialog-title"
        sx={{
          fontWeight: 'bold',
          marginBottom: '10px',
          color: 'white', // White text
        }}
      >
        You are about to logout
      </DialogTitle>
      <DialogContent>
        <Typography
          id="logout-dialog-description"
          sx={{ marginBottom: '20px', color: 'white' }} // White text
        >
          Your session is about to finish
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'center',
          padding: '10px 0',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: { xs: '100%', sm: 'auto' },
            borderRadius: '50px',
            height: '40px',
            fontWeight: 'bold',
          }}
          onClick={handleLogout}
        >
          Signout
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{
            width: { xs: '100%', sm: 'auto' },
            borderRadius: '50px',
            height: '40px',
            fontWeight: 'bold',
            color: 'white', // White text for outlined button
            borderColor: 'white', // White border
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle hover effect
            },
          }}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LogoutDialog;
