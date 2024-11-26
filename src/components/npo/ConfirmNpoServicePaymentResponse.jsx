/**
 * *@gniyonge
 * Confirm NPO Service Payment

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

export default function ConfirmNpoServicePayment(props){
  
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
       <b>{"NPO Client Registration Service :"}</b> 
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" style={{color:"black",fontSize:12}}>
       
        
        Please confirm <b>ePoBox Client Registration Request:</b>.
         <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
          <p style={{color:'black', fontSize:12}}>
            <span>-Firstname:<b>{props.firstname}</b></span><br/>
            <span>-Lastname:<b>{props.lastname}</b></span><br/>
            <span>-Identity Type:<b>{props.identityType}</b></span><br/>
            <span>-Phone Number:<b>{props.phoneNumber}</b></span><br/>
            <span>-Identity Number:<b>{props.identityNumber}</b></span><br/>
            
          </p>
          <p>

            <span style={{color:'red', fontSize:12}}>Please note registration is complete after payment of the subscription fee of <b>Rwf 8,000.</b> 
A prompt should appear on your client phone once registration is complete to ease the payment process!!!.
</span>
          </p>
         
     
      
    </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
      <Button style={{color:"red",fontSize:12}} onClick={props.closeClick}>Cancel</Button>
          <Button style={{color:"green",fontSize:12}}  autoFocus  onClick={props.confirmClick}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  </div>
  );
}