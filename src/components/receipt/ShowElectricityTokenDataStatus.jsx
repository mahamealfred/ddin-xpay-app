/**
 * *@gniyonge
 * Electricity Service TX  Data Status 

 */

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Navigate, Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { toast } from "react-toastify";
import LinearProgress from "@mui/material/LinearProgress";

export default function ShowElectricityTokenDataStatus(props) {
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
        <DialogTitle
          id="alert-dialog-title"
          style={{ color: "blue", fontSize: 14 }}
        >
          <b>{"Electricity Token Status View:"}</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "black", fontSize: 12 }}
          >
            <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
              <p style={{ color: "black", fontSize: 12 }}>
                <span>
                  -Token Amount: <b>Rwf {props.txTokenData?.amount}</b>
                </span>
                <br />
                <span>
                  -Token:
                  <b style={{ color: "green" }}>
                    {props.txTokenData.spVendInfo?.voucher}
                  </b>
                </span>
                <br />
                <span>
                  -Service Provider Name:
                  <b>{props.txTokenData.spVendInfo?.spName}</b>
                </span>
                <br />
                <span>
                  -Date:<b>{props.txTokenData.spVendInfo?.tstamp}</b>
                </span>
                <br />
                <span>
                  -Units:<b>{props.txTokenData.spVendInfo?.units}</b>
                </span>

                {/*<span>-Personal Client Status:<b>{props.clientType}</b></span><br/>*/}
              </p>
              <p></p>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: "red", fontSize: 12 }}
            onClick={props.closeClick}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
