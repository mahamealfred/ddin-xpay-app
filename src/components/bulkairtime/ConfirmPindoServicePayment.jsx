/**
 * *@gniyonge
 * Confirm Pindo Service Payment

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
       <b>{"DDIN Bulk Airtime Service :"}</b> 
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" style={{color:"black",fontSize:12}}>
       
          
        Please confirm the <b> bulk airtime sending transaction request:</b>.
         <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
          <p style={{color:'black', fontSize:12}}>
            <span>- Total Recepients Number:<b> {props.totalReceipients}</b></span><br/>
            <span>- Amount Per Phone Number:<b> {props.amount} Rwf </b></span><br/>
            <span>- Total Amount:<b> {props.totalReceipients*props.amount} Rwf </b></span><br/>
            
           
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