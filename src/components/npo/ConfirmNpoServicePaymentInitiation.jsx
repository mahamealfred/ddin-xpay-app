/**
 * *@gniyonge
 * Confirm NPO Service Payment

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

export default function ConfirmNpoServicePayment(props) {
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
          style={{ color: "#ff9900", fontSize: 14 }}
        >
          <b>{"NPO Client Registration Confirmation:"}</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "black", fontSize: 12 }}
          >
            <b>You've successfully registered a new NPO Client:</b>.
            <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
              <p style={{ color: "black", fontSize: 12 }}>
                <span>
                  - Generated ePoBox Client ID:<b>{props.clientId}</b>
                </span>
                <br />
                <span>
                  - Client Mobile Money Phone:<b>{props.mobile}</b>
                </span>
                <br />
              </p>
              <p>
                <span style={{ color: "red", fontSize: 12 }}>
                  Confirm Payment Initiation for Virtual Address Registration -
                  As you initiate the payment, please be aware that the
                  registration is considered fully validated upon successful
                  payment of the subscription fee. The fee is{" "}
                  <b>
                    Rwf 8,000 for personal clients and Rwf 15,000 for corporate
                    clients
                  </b>
                  . A payment prompt will appear on your client device upon
                  completion of the registratian to authorize the payment with
                  momo PIN.
                </span>
              </p>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: "red", fontSize: 12 }}
            onClick={props.closeClick}
          >
            Cancel
          </Button>
          <Button
            style={{ color: "green", fontSize: 12 }}
            autoFocus
            onClick={props.confirmClick}
          >
            Initiate Client Payment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
