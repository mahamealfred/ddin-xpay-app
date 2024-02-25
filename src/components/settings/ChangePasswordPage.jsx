/**
 * *@gniyonge
 * Electricity Service Page

 */

import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { CFormTextarea, CForm } from "@coreui/react";
import {
  Paper,
  Box,
  Typography,
  ButtonBase,
  Button,
  Fab,
  Fragment,
  Avatar,
  makeStyles,
  Card,
  Select,
  ListItemIcon,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import { toast, ToastContainer } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import Textarea from "@mui/joy/Textarea";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import LogoutPrompt from "./LogoutPrompt";
import ChangePasswordDialog from "./ChangePasswordDialog";
import NotificationSound from "../../images/audio/notificationsound.wav";
import { read, utils, writeFile } from "xlsx";
import TextareaAutosize from "react-textarea-autosize";
import $ from "jquery";
import SmsCounter from "sms-counter";
import Form from "react-bootstrap/Form";
import validator from "validator";
import { Context } from "../Wrapper";

import { selectClasses } from "@mui/joy/Select";

import {
  registerNpoClient,
  viewEfasheTxStatus,
  validateEfasheRraVendingTx,
  executeEfasheRraVendingTx,
  viewAgentFloatAccountTransactions,
  viewAgentFloatAccountTransactionsById,
  viewNpoAddresses,
  changePassword,
} from "../../apis/UserController";
import dateFormat, { masks } from "dateformat";
import LoginPage from "../user/LoginPage";
import FooterPage from "../footer/FooterPage";
import HeaderPage from "../header/HeaderPage";
import "react-phone-number-input/style.css";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function ElectricityServicePage() {
  const [openAddress, setOpenAddress] = useState(false);
  const [openClientTypes, setOpenClientTypes] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);

  const [options, setOptions] = React.useState([]);
  //const loading = open && options.length === 0;

  const classes = useStyles();
  const context = useContext(Context);
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showConfirmResponseDialog, setShowConfirmResponseDialog] =
    useState(false);
  const [showConfirmBulkFileDialog, setShowConfirmBulkFileDialog] =
    useState(false);
  const [smsAmount, setSmsAmount] = useState(1000);
  const [agentName, setAgentName] = useState("");
  const [message, setMessage] = useState("");
  const [clientName, setClientName] = useState("-");
  const [clientPhone, setClientPhone] = useState("-");
  const [clientEmail, setClientEmail] = useState("");
  const [clientTin, setClientTin] = useState("-");
  const [messageCounter, setMessageCounter] = useState(0);
  const [messageRemainderCounter, setMessageRemainderCounter] = useState(0);
  const [messageLength, setMessageLength] = useState(0);
  const [messageCharacterLimit, setMessageCharacterLimit] = useState(0);
  const [totalSmsCost, setTotalSmsCost] = useState(0);
  const [senderId, setSenderId] = useState("");
  const [smsCost, setSmsCost] = useState("");
  const [recipientNumber, setRecipientNumber] = useState(0);
  const [password, setPassword] = useState("");
  const [validFileLevel, setValidFileLevel] = useState(false);
  const [validFileLevelMessage, setValidFileLevelMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [fdiTxData, setFdiTxData] = useState([]);
  const [
    agentAccountTransactionsByIdData,
    setAgentAccountTransactionsByIdData,
  ] = useState([]);
  const [agentAccountTransactions, setAgentAccountTransactions] = useState([]);
  const [balance, setbalance] = useState("Rwf 0.00");
  const [formattedBalance, setFormattedBalance] = useState("Rwf 0.00");
  const [agentNameId, setAgentNameId] = useState("Agent Float A/C");
  const [textAreaCount, setTextAreaCount] = useState(0);
  const [businessTin, setBusinessTin] = useState("");
  const [identityTypeSelected, setIdentityTypeSelected] = useState("1");
  const [value, setValue] = useState("");
  const [npoAddressData, setNpoAddressData] = useState(null);

  //Receipt Data:
  const [receiptAmount, setReceiptAmount] = useState("");
  const [receiptDescription, setReceiptDescription] = useState("");
  const [receipFirstName, setReceiptFirstName] = useState("");
  const [receiptLastName, setReceiptLastName] = useState("");
  const [receiptMobile, setReceiptMobile] = useState("");
  const [receiptNationalIdNumber, setReceiptNationalIdNumber] = useState("");

  const [receiptPassportNumber, setReceiptPassportNumber] = useState("");
  const [receiptReferralCode, setReceiptReferralCode] = useState("");
  const [receiptNpoClientId, setReceiptNpoClientId] = useState("");
  const [receiptAgentId, setReceiptAgentId] = useState("");

  const [receiptMpostSystemMetadata, setReceiptMpostSystemMetadata] =
    useState("");
  const [receiptProvince, setReceiptProvince] = useState("");
  const [receiptDistrict, setReceiptDistrict] = useState("");
  const [receiptSector, setReceiptSector] = useState("");
  const [receiptTxDate, setReceiptTxDate] = useState("");

  const [postalCodeId, setPostalCodeId] = useState("");
  const [isPersonal, setIsPersonal] = useState(null);

  const [availTrxBalance, setAvailTrxBalance] = useState("");
  const [customerAccountNumber, setCustomerAccountNumber] = useState("");

  const [pdtId, setPdtId] = useState("");
  const [pdtName, setPdtName] = useState("");
  const [pdtStatusId, setPdtStatusId] = useState("");
  const [selectAmount, setSelectAmount] = useState("");
  const [stock, setStock] = useState("");
  const [stockedPdts, setStockedPdts] = useState("");
  const [svcProviderName, setSvcProviderName] = useState("");
  const [trxId, setTrxId] = useState("");
  const [trxResult, setTrxResult] = useState("");
  const [vendMax, setVendMax] = useState("");
  const [vendMin, setVendMin] = useState("");
  const [vendUnitId, setVendUnitId] = useState("");
  const [verticalId, setVerticalId] = useState("");

  const [meterNumber, setMeterNumber] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");

  const [localStockMgt, setLocalStockMgt] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  const [tin, setTin] = useState("");
  const [validateId, setValidateId] = useState("");
  const [payRef, setPayRef] = useState("");
  const [taxCenter, setTaxCenter] = useState("");
  const [decDate, setDecDate] = useState("");
  const [fullPay, setFullPay] = useState("");
  const [taxType, setTaxType] = useState("");

  const [transferId, setTransferId] = useState("");
  const [memberId, setMemberId] = useState("");

  const [receiptId, setReceiptId] = useState("");
  const [receiptNote, setReceiptNote] = useState("");
  const [serviceFeeAmt, setServiceFeeAmt] = useState("");
  const [totalPayment, setTotalPayment] = useState("");

  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
  const audioPlayer = useRef(null);

  function playAudio() {
    audioPlayer.current.play();
  }

  const viewFloatAccountInfo = () => {
    //e.preventDefault();
    queryAgentAccountTransactions();
  };

  const confirmElectricityPayment = async (e) => {
    e.preventDefault();

    if (isNumber(meterNumber)) {
      validateElectricityTx();
    } else {
      toast.error("The Tax Document Id Must Be A Valid a Set of Number(0-9)");
    }
  };
  const viewConfirmDialog = () => {
    setShowConfirmDialog(true);
  };
  const viewReceiptDialog = () => {
    setShowReceiptDialog(true);
  };
  function findServiceFee(amount) {
    if (amount >= 1 && amount <= 1000) {
      return 160;
    } else if (amount >= 1001 && amount <= 10000) {
      return 300;
    } else if (amount >= 10001 && amount <= 40000) {
      return 500;
    } else if (amount >= 40001 && amount <= 75000) {
      return 1000;
    } else if (amount >= 75001 && amount <= 150000) {
      return 1500;
    } else if (amount >= 150001 && amount <= 500000) {
      return 2000;
    } else if (amount >= 500001) {
      return 3000;
    } else {
      return 0;
    }
  }

  const handleReceiptPreviewClick = (transId) => {
    // Extract the necessary data

    const firstTransaction = agentAccountTransactionsByIdData[0];

    if (firstTransaction) {
      navigate("/ddin-rra-receipt", {
        state: {
          transactionData: firstTransaction,
          agentUsername: context.agentUsername,
        },
      });
    } else {
      //Fail To Check TX Status
    }
  };

  const queryAgentAccountTransactions = async () => {
    try {
      const response = await viewAgentFloatAccountTransactions(
        context.userKey,
        context.agentFloatAccountId
      );

      if (response.responseCode === "200") {
        setAgentAccountTransactions(response.data);
      } else {
        //toast.info(response.responseDescription);
      }
    } catch (err) {
      // console.log("Agent Account Status Error:"+err);
    }
  };

  const queryAgentAccountTransactionsById = async (transId) => {
    setShowReceiptDialog(false);
    const id = toast.loading("Previewing RRA Payment Receipt...");
    try {
      const response = await viewAgentFloatAccountTransactionsById(
        context.userKey,
        context.agentFloatAccountId,
        transId
      );

      if (response.responseCode === "200") {
        setAgentAccountTransactionsByIdData(response.data);

        const firstTransaction = response.data[0];

        if (firstTransaction) {
          navigate("/ddin-rra-receipt", {
            state: {
              transactionData: firstTransaction,
              agentUsername: context.agentUsername,
            },
          });
        } else {
          //Fail To Check TX Status
          setShowReceiptDialog(true);
          console.log("Fail To Check TX Status- ");
        }
      } else {
        setShowReceiptDialog(true);
        toast.info(response.responseDescription);
      }
    } catch (err) {
      setShowReceiptDialog(true);
      console.log("Agent Account TX By Id Status Error:" + err);
    }
  };

  //view Service Provider TX  Status:
  const queryFditxStatus = async (txId) => {
    try {
      const response = await viewEfasheTxStatus(context.userKey, txId);

      if (response.responseCode === "200") {
        setFdiTxData(response.data);
      } else {
        //toast.info(response.responseDescription);
      }
    } catch (err) {
      //console.log("Agent Account Status Error:"+err);
    }
  };

  const signout = () => {
    setShowLogoutPrompt(false);
    context.updateLoginStatus(false);
  };
  //=============Validate Electricity======
  const validateElectricityTx = async () => {
    const id = toast.loading("Previewing Tax Document Data...");

    try {
      const efasheTxValidatorRequestBody = {
        amount: "",
        description: "",
        currencySymbol: "",
        transferTypeId: "",
        province: context.province,
        district: context.district,
        sector: context.sector,
        toMemberId: "",
        senderId: "EFASHE",
        recipients: "",
        smsMessage: "",
        accountId: context.agentFloatAccountId,
        vertialId: "tax",
        phoneNumber: meterNumber,
      };

      const response = await validateEfasheRraVendingTx(
        efasheTxValidatorRequestBody,
        context.userKey
      );

      if (response.responseCode === "200") {
        setCustomerAccountNumber(response.data?.customerAccountNumber);
        setLocalStockMgt(response.data?.localStockMgt);
        setPdtId(response.data?.pdtId);
        setPdtName(response.data?.pdtName);
        setPdtStatusId(response.data?.pdtStatusId);
        setSelectAmount(response.data?.selectAmount);
        setStock(response.data?.stock);
        setStockedPdts(response.data?.stockedPdts);
        setSvcProviderName(response.data?.svcProviderName);
        setTrxId(response.data?.trxId);
        setTrxResult(response.data?.trxResult);
        setVendMax(response.data?.vendMax);
        setVendMin(response.data?.vendMin);
        setVendUnitId(response.data?.vendUnitId);
        setAccessToken(response.data?.accessToken);
        setRefreshToken(response.data?.refreshToken);

        setTin(response.data?.tin);
        setValidateId(response.data?.validate_id);
        setPayRef(response.data?.pay_ref);
        setTaxCenter(response.data?.tax_center);
        setDecDate(response.data?.dec_date);
        setFullPay(response.data?.is_full_pay);
        setTaxType(response.data?.tax_type);

        toast.dismiss();
        viewConfirmDialog();
      } else {
        toast.update(id, {
          render: response.responseDescription,
          type: "info",
          isLoading: false,
          closeButton: null,
        });
        setValidFileLevel(false);
      }
    } catch (err) {
      toast.update(id, {
        render:
          "Dear customer we are unable to process your request now. Try again later." +
          err,
        type: "info",
        isLoading: false,
        closeButton: null,
      });
      setValidFileLevel(false);
    }
  };
  //======== Core Member Ids===
  const returnMemberId = () => {
    if (context.agentCategory === null || context.agentCategory === "Agent") {
      //Test Env:
      //setMemberId("34");
      //Prod Env:
      setMemberId("18");

      return "18";
    } else {
      //Test Env
      //setMemberId("34");
      //Prod Env
      setMemberId("34");

      return "34";
    }
  };
  //==================Core TX Transfers Id=============
  const returnTransferId = () => {
    if (context.agentCategory === null || context.agentCategory === "Agent") {
      //Test Env:
      //setTransferId("85");
      //Prod Env:
      setTransferId("82");

      return "82";
    } else {
      //Test Env
      //setTransferId("86");

      //Prod Env
      setTransferId("83");

      return "83";
    }
  };

  //=============Execute Electricity TX======

  const executeElectricityTx = async () => {
    const id = toast.loading("Processing Tax Payment...");

    try {
      //Test Agent- EFASHE -ID=52, MemberId=34
      //Test Corporate- EFASHE -ID=81, MemberId=34
      //Prod Agent: Transfer Id=70 , Member Id= 18
      //Prod Corporate: Transfer Id=71, Member Id=18
      //returnTransferId();returnMemberId();
      const efasheTxValidatorRequestBody = {
        amount: vendMax,
        description: "",
        currencySymbol: "",
        transferTypeId: returnTransferId(),
        province: context.province,
        district: context.district,
        sector: context.sector,
        toMemberId: returnMemberId(),
        senderId: "EFASHE",
        recipients: "",
        smsMessage: "",
        accountId: context.agentFloatAccountId,
        vertialId: "tax",
        phoneNumber: meterNumber,
        transactionId: trxId,
        token: accessToken,
        refreshToken: refreshToken,
        userId: context.userId,
        agentCategory: context.agentCategory,
        taxIdentificationNumber: tin,
        validationId: validateId,
        taxDocumentId: payRef,
        taxCenter: taxCenter,
        declarationDate: decDate,
        fullPaymentStatus: fullPay,
        taxType: taxType,
        taxpayer: customerAccountNumber,
      };

      const response = await executeEfasheRraVendingTx(
        efasheTxValidatorRequestBody,
        context.userKey
      );

      //console.log("Response:" + response);
      if (response.responseCode === "200") {
        playAudio();
        //response.data.spVendInfo.voucher +",Receipt No:" +
        //response.data.spVendInfo.receiptNo +", for Total Tax With Service fee -Rwf" +
        //response.data.spVendInfo.unitsWorth,
        /* toast.update(id, {
          render: response.responseDescription,

          type: "success",
          isLoading: false,
          closeButton: null,
        });*/
        setTokenAmount("");
        setMeterNumber("");
        //preview receipt

        //Load TX Data:

        toast.dismiss();
        setReceiptId(response.responseStatus);
        setReceiptNote(response.responseDescription);
        setServiceFeeAmt("");
        setTotalPayment(vendMax);
        setShowReceiptDialog(true);

        //queryAgentAccountTransactionsById(response.responseStatus);
      } else {
        toast.update(id, {
          render: response.responseDescription,
          type: "info",
          isLoading: false,
          closeButton: null,
        });
        setValidFileLevel(false);
        setTokenAmount("");
        setMeterNumber("");
      }
    } catch (err) {
      toast.update(id, {
        render:
          "Dear customer we are unable to process your request now. Try again later." +
          err,
        type: "info",
        isLoading: false,
        closeButton: null,
      });
      setValidFileLevel(false);
    }
  };
  //=====================
  const openPasswordDialog = () => {
    console.log("Goofd");
    setShowChangePasswordDialog(true);
  };
  //=========================
  const sendPaymentRequest = async () => {
    setShowConfirmDialog(false);
    executeElectricityTx();
    // createNewNpoClientProfile();
  };

  const previewReceipt = async () => {
    setShowConfirmResponseDialog(false);
    //const stateReceipt={receiptAmount:receiptAmount,receiptDescription:receiptDescription,receiptFirstName:receiptFirstName,receiptLastName:receiptLastName,receiptMobile:receiptMobile,receiptNationalIdNumber:receiptNationalIdNumber,receiptPassportNumber:receiptPassportNumber,receiptReferralCode:receiptReferralCode,receiptNpoClientId:receiptNpoClientId,receiptAgentId:receiptAgentId,receiptTxDate:new Date()};
    //Send Receipt
  };
  const modifyPassword = async (oldPassword, newPassword) => {
    const id = toast.loading("Processing password request ...");
    try {
      //Agent floac Ac Id Prod=7
      //Agent Float Account A/C Test=7

      //Agent Commission A/C Id Test=25
      //Agent Commission A/C Id Prod=8

      //context.agentFloatAccountId
      //context.agentInstantCommissionAccountId
      //context.agentDelayedCommissionAccountId
      //username, oldPassword, newPassword
      const response = await changePassword(
        context.agentUsername,
        oldPassword,
        newPassword,
        context.userKey
      );

      if (response.responseCode === "200") {
        setShowChangePasswordDialog(false);
        toast.update(id, {
          render:
            response.responseDescription +
            ": You've successfully Changed Your Password",

          type: "success",
          isLoading: false,
          closeButton: null,
        });
        toast.dismiss();
        setShowLogoutPrompt(true);
      } else {
        toast.update(id, {
          render: response.responseDescription,
          type: "error",
          isLoading: false,
          closeButton: null,
        });
        //console.log("Agenty Account Status:"+response.responseDescription);
        //toast.info(response.responseDescription);
      }
    } catch (err) {
      toast.update(id, {
        render: err,
        type: "error",
        isLoading: false,
        closeButton: null,
      });
      //toast.info("Dear customer we are unable to process your request now. Try again later."+err);
      //console.log("Agenty Account Status Error:"+err);
    }
  };
  useEffect(() => {
    const ddinWindow = $(window);

    // :: Preloader
    ddinWindow.on("load", function () {
      $("#preloader").fadeOut("1000", function () {
        $(this).remove();
      });
    });

    // :: Dropdown Menu
    $(".sidenav-nav")
      .find("li.ddin-dropdown-menu")
      .append(
        "<div class='dropdown-trigger-btn'><i class='fa-solid fa-angle-down'></i></div>"
      );
    $(".dropdown-trigger-btn").on("click", function () {
      $(this).siblings("ul").stop(true, true).slideToggle(700);
      $(this).toggleClass("active");
    });

    // :: Hero Slides
    if ($.fn.owlCarousel) {
      const welcomeSlider = $(".hero-slides");
      welcomeSlider.owlCarousel({
        items: 1,
        loop: true,
        autoplay: false,
        dots: true,
        center: true,
        margin: 0,
        animateIn: "fadeIn",
        animateOut: "fadeOut",
      });

      welcomeSlider.on("translate.owl.carousel", function () {
        const layer = $("[data-animation]");
        layer.each(function () {
          const anim_name = $(this).data("animation");
          $(this)
            .removeClass("animated " + anim_name)
            .css("opacity", "0");
        });
      });

      $("[data-delay]").each(function () {
        const anim_del = $(this).data("delay");
        $(this).css("animation-delay", anim_del);
      });

      $("[data-duration]").each(function () {
        const anim_dur = $(this).data("duration");
        $(this).css("animation-duration", anim_dur);
      });

      welcomeSlider.on("translated.owl.carousel", function () {
        const layer = welcomeSlider
          .find(".owl-item.active")
          .find("[data-animation]");
        layer.each(function () {
          const anim_name = $(this).data("animation");
          $(this)
            .addClass("animated " + anim_name)
            .css("opacity", "1");
        });
      });
    }

    // :: Flash Sale Slides
    if ($.fn.owlCarousel) {
      const flashSlide = $(".flash-sale-slide");
      flashSlide.owlCarousel({
        items: 3,
        margin: 8,
        loop: true,
        autoplay: true,
        smartSpeed: 800,
        dots: false,
        nav: false,
        responsive: {
          992: {
            items: 4,
          },
        },
      });
    }

    // :: Collection Slides
    if ($.fn.owlCarousel) {
      const collectionSlide = $(".collection-slide");
      collectionSlide.owlCarousel({
        items: 3,
        margin: 8,
        loop: true,
        autoplay: true,
        smartSpeed: 800,
        dots: false,
        nav: false,
        responsive: {
          992: {
            items: 4,
          },
        },
      });
    }

    // :: Products Slides
    if ($.fn.owlCarousel) {
      const productslides = $(".product-slides");
      productslides.owlCarousel({
        items: 1,
        margin: 0,
        loop: false,
        autoplay: true,
        autoplayTimeout: 5000,
        dots: false,
        nav: true,
        navText: [
          '<i class="fa-solid fa-angle-left"></i>',
          '<i class="fa-solid fa-angle-right"></i>',
        ],
      });
    }

    // :: Catagory Slides
    if ($.fn.owlCarousel) {
      const catagoryslides = $(".catagory-slides");
      catagoryslides.owlCarousel({
        items: 2.5,
        margin: 4,
        loop: true,
        autoplay: true,
        autoplayTimeout: 3000,
        dots: false,
        nav: false,
        responsive: {
          992: {
            items: 4,
          },
          768: {
            items: 3,
          },
        },
      });
    }

    // :: Related Products Slides
    if ($.fn.owlCarousel) {
      const relProductSlide = $(".related-product-slide");
      relProductSlide.owlCarousel({
        items: 2,
        margin: 8,
        loop: true,
        autoplay: true,
        smartSpeed: 800,
        dots: false,
        nav: false,
        responsive: {
          1200: {
            items: 4,
          },
          768: {
            items: 3,
          },
        },
      });
    }

    // :: Counter Up
    if ($.fn.counterUp) {
      $(".counter").counterUp({
        delay: 150,
        time: 3000,
      });
    }

    // :: Nice Select
    if ($.fn.niceSelect) {
      $(
        "#selectProductCatagory, #topicSelect, #countryCodeSelect"
      ).niceSelect();
    }

    // :: Prevent Default 'a' Click
    $('a[href="#"]').on("click", function ($) {
      $.preventDefault();
    });

    // :: Password Strength
    if ($.fn.passwordStrength) {
      $("#registerPassword").passwordStrength({
        minimumChars: 8,
      });
    }

    // :: Magnific Popup
    if ($.fn.magnificPopup) {
      $("#singleProductVideoBtn, #videoButton").magnificPopup({
        type: "iframe",
      });
    }

    // :: Review Image Magnific Popup
    if ($.fn.magnificPopup) {
      $(".review-image").magnificPopup({
        type: "image",
      });
    }

    // :: Cart Quantity Button Handler
    $(".quantity-button-handler").on("click", function () {
      const value = $(this).parent().find("input.cart-quantity-input").val();
      if ($(this).text() == "+") {
        var newVal = parseFloat(value) + 1;
      } else {
        if (value > 1) {
          var newVal = parseFloat(value) - 1;
        } else {
          newVal = 1;
        }
      }
      $(this).parent().find("input").val(newVal);
    });
  });

  function isNumber(str) {
    if (str.trim() === "") {
      return false;
    }

    return !isNaN(str);
  }

  return context.loggedInStatus ? (
    <div>
      <HeaderPage />

      <div class="page-content-wrapper">
        <div class="container">
          <br />
          <div class="section-heading d-flex align-items-center justify-content-between dir-rtl">
            <h6>
              <Link class="btn p-0 text-white" to="/">
                <i class="ms-1 fa-solid fa-arrow-left-long"></i> Back
              </Link>
            </h6>
          </div>
          <div class="discount-coupon-card-blue p-4 p-lg-5 dir-rtl">
            <div class="d-flex align-items-center">
              <div class="discountIcon">
                <img
                  class="w-100"
                  src="assets/img/bg-img/settings.jpeg"
                  alt=""
                />
              </div>
              <div class="text-content">
                <h4 class="text-white mb-1">Settings </h4>
                <p class="text-white mb-0">
                  Change Password Option
                  <span class="px-1 fw-bold"></span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="container">
            <br />
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 5,
                borderWidth: 1,
                borderStyle: "solid",
              }}
            >
              <div class="row justify-content-center">
                <div class="col-10 col-lg-8">
                  <div class="register-form mt-2">
                    <div class="form-group text-start mb-4">
                      <span class="mb-2">
                        <span
                          style={{ fontSize: 24, color: "black" }}
                          onClick={openPasswordDialog}
                        >
                          <Link>
                            <u>Change Password</u>
                          </Link>
                        </span>
                      </span>
                    </div>

                    <ToastContainer className="toast-position" />

                    <ChangePasswordDialog
                      openstatus={showChangePasswordDialog}
                      closeClick={() =>
                        setShowChangePasswordDialog(!showChangePasswordDialog)
                      }
                      confirmClick={(oldPass, newPass) =>
                        modifyPassword(oldPass, newPass)
                      }
                    />

                    <LogoutPrompt
                      openstatus={showLogoutPrompt}
                      closeClick={() => setShowLogoutPrompt(!showLogoutPrompt)}
                      confirmClick={() => signout()}
                    />
                    <audio ref={audioPlayer} src={NotificationSound} />
                  </div>

                  <div class="login-meta-data">
                    <p class="mt-3 mb-0"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="internet-connection-status" id="internetStatus"></div>

      <FooterPage />
    </div>
  ) : (
    <LoginPage />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 10,
    borderColor: "#ff9900",
    padding: 2,
    marginTop: 5,
    marginLeft: 5,
    marginRightt: 5,
  },
}));
