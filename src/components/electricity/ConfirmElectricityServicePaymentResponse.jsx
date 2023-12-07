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
          <b>{"Electricity Payment Notification:"}</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "black", fontSize: 12 }}
          >
            <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
              <p style={{ color: "black", fontSize: 12 }}>
                <span>
                  -Receipt Id:<b>{props.receiptId}</b>
                </span>
                <br />
                <span>
                  -Receipt Description:<b>{props.receiptDescription}</b>
                </span>
                <br />

                <span>
                  -Total Payment:<b>{props.totalPayment}</b>
                </span>
                <br />
              </p>
            </Stack>
          </DialogContentText>
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: "red", fontSize: 14 }}
            onClick={props.closeClick}
          >
            Cancel
          </Button>
          <Button
            style={{ color: "green", fontSize: 14 }}
            autoFocus
            onClick={() => props.confirmClick(props.receiptId)}
          >
            <b>Preview Receipt</b>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
