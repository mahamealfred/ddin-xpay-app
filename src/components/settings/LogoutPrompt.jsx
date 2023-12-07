/**
 * *@gniyonge
 * Confirm NPO Service Payment

 */

import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
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
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
          <b>{"Logout Prompt Request:"}</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "black", fontSize: 12 }}
          >
            <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
              <p>
                <b> You've successfully Changed Your Password.</b>
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
            onClick={() => props.confirmClick()}
          >
            <b>Log out</b>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
