/**
 * *@gniyonge
 * Confirm Bulk SMS File Service Payment

 */

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Navigate, Link,useNavigate} from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {toast } from 'react-toastify';
import LinearProgress from '@mui/material/LinearProgress';

export default function ConfirmPindoServicePayment(props){
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  return (
    <div>
   
    <Dialog
      open={props.openstatus}
      onClose={props.closeClick}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" style={{color:"#ff9900",fontSize:14}}>
       <b>{"Airtime Recipients File Validation"}</b> 
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" style={{color:"black",fontSize:12}}>
          <b>{props.message}</b>.
         <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
          <p> ...</p>
          
         
     
      
    </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
      <Button style={{color:"red",fontSize:12}}onClick={props.closeClick}>Cancel</Button>
         
      </DialogActions>
    </Dialog>
  </div>
  );
}