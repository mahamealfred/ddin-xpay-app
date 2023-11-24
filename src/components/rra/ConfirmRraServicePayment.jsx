/**
 * *@gniyonge
 * Confirm Electricity Service Payment

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

export default function ConfirmElectricityServicePayment(props) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
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
          <b>{"RRA Tax Payment Confirmation:"}</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "black", fontSize: 12 }}
          >
            <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
              <p style={{ color: "black", fontSize: 12 }}>
                <span>
                  -Taxpayer:<b>{props.customerAccountNumber}</b>
                </span>
                <br />
                <span>
                  -Provider Name:<b>{props.pdtName}</b>
                </span>
                <br />
                <span>
                  -Request Id:<b>{props.trxId}</b>
                </span>
                <br />
                <span>
                  -TIN:<b>{props.tin}</b>
                </span>
                <br />
                <span>
                  -Doc Id:<b>{props.payRef}</b>
                </span>
                <br />
                <span>
                  -Tax Center:<b>{props.taxCenter}</b>
                </span>
                <br />
                <span>
                  -Declaration Date:<b>{props.decDate}</b>
                </span>
                <br />
                <span>
                  -Full Payment:<b>{props.fullPay}</b>
                </span>
                <br />
                <span>
                  -Tax Type:<b>{props.taxType}</b>
                </span>
              </p>
              <p>
                <span style={{ color: "black", fontSize: 12 }}>
                  <b>
                    You're going to pay Rwf {numberWithCommas(props.vendMax)} to
                    RRA for {numberWithCommas(props.taxType)}.The service fee is
                    Rwf {props.serviceFee}.The total payment amount is{" "}
                  </b>
                  <b>
                    Rwf{" "}
                    {numberWithCommas(
                      parseInt(props.vendMax) + parseInt(props.serviceFee)
                    )}
                  </b>{" "}
                  only.
                </span>
                <span style={{ color: "green", fontSize: 12 }}>
                  {" "}
                  Please confirm The <b>{props.taxType} Tax Payment:</b>
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
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
