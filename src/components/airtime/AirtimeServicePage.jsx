/**
 * *@gniyonge
 * Airtime Service Page

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
import PreviewPaymentReceiptDialog from "./ConfirmAirtimeServicePaymentResponse";
import PreviewAirtimeServicePayment from "./ConfirmAirtimeServicePayment";
import NotificationSound from "../../images/audio/notificationsound.wav";
import { read, utils, writeFile } from "xlsx";
import TextareaAutosize from "react-textarea-autosize";
import $ from "jquery";
import SmsCounter from "sms-counter";
import Form from "react-bootstrap/Form";
import validator from "validator";
import { Context } from "../Wrapper";
//import { validate } from 'email-validator';
import { selectClasses } from "@mui/joy/Select";
//import Option from "@mui/joy/Option";
//import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

import {
  registerNpoClient,
  executeEfasheVendingTx,
  validateEfasheVendingTx,
  viewAgentFloatAccountTransactions,
  viewAgentFloatAccountTransactionsById,
  viewNpoAddresses,
} from "../../apis/UserController";
import dateFormat, { masks } from "dateformat";
import LoginPage from "../user/LoginPage";
import FooterPage from "../footer/FooterPage";
import HeaderPage from "../header/HeaderPage";
import "react-phone-number-input/style.css";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { executeEfasheAirTimeVendingTx, validateEfasheAirTimeVendingTx, viewAgentAccountTransactions, viewAgentAccountTransactionsById } from "../../apis/ServiceController";

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function AirtimeServicePage() {
  const [openAddress, setOpenAddress] = useState(false);
  const [openClientTypes, setOpenClientTypes] = useState(false);

  const [options, setOptions] = React.useState([]);
  //const loading = open && options.length === 0;

  const classes = useStyles();
  const context = useContext(Context);
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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
  const [agentAccountTransactions, setAgentAccountTransactions] = useState([]);
  const [balance, setbalance] = useState("Rwf 0.00");
  const [formattedBalance, setFormattedBalance] = useState("Rwf 0.00");
  const [agentNameId, setAgentNameId] = useState("Agent Float A/C");
  const [textAreaCount, setTextAreaCount] = useState(0);
  const [businessTin, setBusinessTin] = useState("");
  const [identityTypeSelected, setIdentityTypeSelected] = useState("1");
 
  const [npoAddressData, setNpoAddressData] = useState(null);
  const [
    agentAccountTransactionsByIdData,
    setAgentAccountTransactionsByIdData,
  ] = useState([]);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [verticalId, setVerticalId] = useState("airtime");
  const [efasheServiceAmount, setEfasheServiceAmount] = useState("");

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
  const [localStockMgt, setLocalStockMgt] = useState("");
  const [pdtId, setPdtId] = useState("");
  const [pdtName, setPdtName] = useState("");
  const [pdtStatusId, setPdtStatusId] = useState("");
  const [selectAmount, setSelectAmount] = useState("");
  const [stock, setStock] = useState("");
  const [stockedPdts, setStockedPdts] = useState("");
  const [svcProviderName, setSvcProviderName] = useState("");

  const [trxResult, setTrxResult] = useState("");
  const [vendMax, setVendMax] = useState("");
  const [vendMin, setVendMin] = useState("");
  const [vendUnitId, setVendUnitId] = useState("");
  const [trxId, setTrxId] = useState("");
  const [value, setValue] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  const [transferId, setTransferId] = useState("");
  const [memberId, setMemberId] = useState("");

  const [receiptId, setReceiptId] = useState("");
  const [receiptNote, setReceiptNote] = useState("");
  const [serviceFeeAmt, setServiceFeeAmt] = useState("");
  const [totalPayment, setTotalPayment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const clientTypesCode = [
    { status: false, name: "Organization" },
    { status: true, name: "Personal" },
  ];

  const audioPlayer = useRef(null);

  function playAudio() {
    audioPlayer.current.play();
  }

  const viewFloatAccountInfo = () => {
    //e.preventDefault();
    queryAgentAccountTransactions();
  };

  const confirmAirtimePayment = async (e) => {
    e.preventDefault();
  
    if (validator.isMobilePhone(value)) {
      // if(value.includes("+25073") || value.includes("+25072")){
      //   toast.error("Airtel service is currently unvailable, Please use MTN.");
      // }else{
        if (isNumber(efasheServiceAmount)) {
          validateEfasheVendingTxRequest();
        } 
        else {
          toast.error("Airtime Amount  Must Be A Valid Set of Amount!");
        }
     // }
     
    } else {
      toast.error(
        "Please provide a valid email address: Ex. example@gmail.com"
      );
    }
  };
  const viewConfirmDialog = () => {
    setShowConfirmDialog(true);
  };

  const queryAgentAccountTransactions = async () => {
    try {
      // const response = await viewAgentFloatAccountTransactions(
      //   context.userKey,
      //   context.agentFloatAccountId
      // );

      const response = await viewAgentAccountTransactions(
        context.userKey
      );

      if (response.responseCode === 200) {
        setAgentAccountTransactions(response.data);
      } else {
        //toast.info(response.responseDescription);
      }
    } catch (err) {
      //console.log("Agent Account Status Error:"+err);
    }
  };

  //EFSAHE TX VALIDATOR
  const validateEfasheVendingTxRequest = async () => {
    const id = toast.loading("Previewing Airtime Request...");
    if (isLoading) return; // Prevent multiple clicks
    setIsLoading(true);
    try {
      const efasheTxValidatorRequestBody = {
        amount: efasheServiceAmount,
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
        vertialId: "airtime",
        phoneNumber: value,
      };
         //Previous apis
      // const response = await validateEfasheVendingTx(
      //   efasheTxValidatorRequestBody,
      //   context.userKey
      // );
      //new Method
      const response = await validateEfasheAirTimeVendingTx(
        efasheTxValidatorRequestBody
      );
      if (response.responseCode === 200) {
        //unpackage data
        setAvailTrxBalance(response.data?.customerAccountNumber);
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

        viewConfirmDialog();

        toast.dismiss();

        setValidFileLevel(false);
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
          "Dear customer we are unable to process your request now. Try again later.",
        type: "info",
        isLoading: false,
        closeButton: null,
      });
      setValidFileLevel(false);
    }finally{
      setIsLoading(false);
    }
  };

  //======== Service core members Id=====
  const returnMemberId = () => {
    if (context.agentCategory === null || context.agentCategory === "Agent") {
      //Test Env:
     // setMemberId("34");
      //Prod Env:
      setMemberId("18");
      return "18";
    } else {
      //Test Env
      //setMemberId("34");
      //Prod Env
      setMemberId("18");

      return "18";
    }
  };
  //============Service Core Transfers Id===================
  const returnTransferId = () => {
    if (context.agentCategory === null || context.agentCategory === "Agent") {
      //Test Env:
      //setTransferId("54");
      //Prod Env:
      setTransferId("66");

      return "66";
    } else {
      //Test Env
      //setTransferId("83");

      //Prod Env
      setTransferId("67");

      return "67";
    }
  };

  //EFSAHE TX EXECUTOR
  const executeEfasheVendingTxRequest = async () => {
    const id = toast.loading("Processing Airtime Request...");
    if (isLoading) return; // Prevent multiple clicks
    setIsLoading(true);
    try {
      //Test Agent: Transfer Id=54 , Member Id= 34
      //Test Corporate: Transfer Id=83 , Member Id=34
      //Prod Agent: Transfer Id=66, Member Id=18
      //Prod Corporate: Transfer Id=67, Member Id=18
      //returnTransferId();returnMemberId();
      const efasheTxValidatorRequestBody = {
        amount: efasheServiceAmount,
        description:"Airtime payment processed successfully with TX Id :" + trxId + ", Phone Number: " + value,
        currencySymbol: "Rwf",
        transferTypeId: returnTransferId(),
        province: context.province,
        district: context.district,
        sector: context.sector,
        toMemberId: returnMemberId(),
        senderId: "EFASHE",
        recipients: "",
        smsMessage: "",
        accountId: context.agentFloatAccountId,
        vertialId: "airtime",
        phoneNumber: value,
        transactionId: trxId,
        token: accessToken,
        refreshToken: refreshToken,
        userId: context.userId,
        agentCategory: context.agentCategory,
        clientPhone:value
      };
  
       //Previous method
      // const response = await executeEfasheVendingTx(
      //   efasheTxValidatorRequestBody,
      //   context.userKey
      // );
      
       //new method

      const response = await executeEfasheAirTimeVendingTx(
        efasheTxValidatorRequestBody,
        context.userKey
      );

      if (response.responseCode === 200) {
        playAudio();

           //Alfred
        setValue("");
        setEfasheServiceAmount("");

        setReceiptId(response.data.transactionId);
        setReceiptNote(response.responseDescription);
        setServiceFeeAmt("");
        setTotalPayment(efasheServiceAmount);

        toast.dismiss();
        setShowReceiptDialog(true);
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
          "Dear customer we are unable to process your request now. Try again later.",
        type: "info",
        isLoading: false,
        closeButton: null,
      });
      setValidFileLevel(false);
    }finally{
      setIsLoading(false)
    }
  };

  const queryAgentAccountTransactionsById = async (transId) => {
    if (transId !== "") {
      setShowReceiptDialog(false);
      const id = toast.loading("Previewing Airtime Receipt...");
      try {
        // const response = await viewAgentFloatAccountTransactionsById(
        //   context.userKey,
        //   context.agentFloatAccountId,
        //   transId
        // );
        //new method
        const response = await viewAgentAccountTransactionsById(
          context.userKey,
          transId
        );

        if (response.responseCode === 200) {
          setAgentAccountTransactionsByIdData(response.data);
        
          const firstTransaction = response.data[0];
          
          toast.dismiss();

          setShowReceiptDialog(false);

          if (firstTransaction) {
            navigate("/ddin-airtime-receipt", {
              state: {
                transactionData: firstTransaction,
                agentUsername: context.agentUsername,
              },
            });
          } else {
            //Fail To Check TX Status
            toast.dismiss();
            setShowReceiptDialog(true);
            console.log("Fail To Check TX Status- ");
          }
        } else {
          toast.dismiss();
          console.log(response.responseDescription);
          //toast.info(response.responseDescription);
        }
      } catch (err) {
        toast.dismiss();
        //toast.info(response.responseDescription);
        console.log("Agent Account TX By Id Status Error:" + err);
      }
    }
  };

  const sendPaymentRequest = async () => {
    setShowConfirmDialog(false);
    executeEfasheVendingTxRequest();
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
              <Link class="btn p-0 text-white" to="/dashboard">
                <i class="ms-1 fa-solid fa-arrow-left-long"></i> Back
              </Link>
            </h6>
          </div>
          <div class="discount-coupon-card-blue p-4 p-lg-5 dir-rtl">
            <div class="d-flex align-items-center">
              <div class="discountIcon">
                <img
                  class="w-100"
                  src="assets/img/bg-img/airtimes.jpg"
                  alt=""
                />
              </div>
              <div class="text-content">
                <h4 class="text-white mb-1">Airtime Service</h4>
                <p class="text-white mb-0">
                  Buy MTN or Airtel Airtime with
                  <span class="px-1 fw-bold"></span>
                  <b>special discounts.</b>
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
                      <span
                        class="mb-2"
                        style={{ fontSize: 24, color: "black" }}
                      >
                        <b>Buy Airtime</b>
                      </span>
                    </div>

                    <form onSubmit={confirmAirtimePayment}>
                      <div class="form-group text-start mb-4">
                        <span style={{ color: "black", fontSize: 16 }}>
                          <b>Phone Number:</b>
                          <b style={{ color: "red" }}>*</b>
                        </span>

                        <div>
                          <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="RW"
                            value={value}
                            onChange={setValue}
                          />
                        </div>
                      </div>

                      <div class="form-group text-start mb-4">
                        <span style={{ color: "black", fontSize: 16 }}>
                          <b>Airtime Amount:</b>
                          <b style={{ color: "red" }}>*</b>
                        </span>

                        <input
                          class="form-control"
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            borderColor: "black",
                            borderRadius: 10,
                            borderWidth: 1,
                            borderStyle: "solid",
                            fontSize: 14,
                          }}
                          type="text"
                          onChange={(e) =>
                            setEfasheServiceAmount(e.target.value)
                          }
                          value={efasheServiceAmount}
                          required
                        />
                      </div>

                      <button disabled={isLoading} class="btn btn-warning btn-lg w-100">Buy</button>

                      <ToastContainer className="toast-position" />
                      <PreviewAirtimeServicePayment
                        isLoading={isLoading}
                        availTrxBalance={availTrxBalance}
                        customerAccountNumber={customerAccountNumber}
                        localStockMgt={localStockMgt}
                        pdtId={pdtId}
                        pdtName={pdtName}
                        pdtStatusId={pdtStatusId}
                        selectAmount={selectAmount}
                        stock={stock}
                        stockedPdts={stockedPdts}
                        svcProviderName={svcProviderName}
                        trxId={trxId}
                        trxResult={trxResult}
                        vendMax={vendMax}
                        vendMin={vendMin}
                        vendUnitId={vendUnitId}
                        openstatus={showConfirmDialog}
                        phoneNumber={value}
                        amount={efasheServiceAmount}
                        closeClick={() =>
                          setShowConfirmDialog(!showConfirmDialog)
                        }
                        confirmClick={() => sendPaymentRequest()}
                      />

                      <PreviewPaymentReceiptDialog
                        receiptId={receiptId}
                        receiptDescription={receiptNote}
                        serviceFeeAmt={serviceFeeAmt}
                        totalPayment={totalPayment}
                        openstatus={showReceiptDialog}
                        closeClick={() =>
                          setShowReceiptDialog(!showReceiptDialog)
                        }
                        confirmClick={(transId) =>
                          queryAgentAccountTransactionsById(transId)
                        }
                      />
                      <audio ref={audioPlayer} src={NotificationSound} />
                    </form>
                  </div>

                  <div class="login-meta-data">
                    <p class="mt-3 mb-0"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="weekly-best-seller-area py-3">
          <div class="container">
            <div class="section-heading d-flex align-items-center justify-content-between dir-rtl">
              <h6>Airtime Purchases</h6>

              <Link class="btn p-0 text-white" onClick={viewFloatAccountInfo}>
                View All Transactions
                <i class="ms-1 fa-solid fa-arrow-right-long"></i>
              </Link>
            </div>
            <div class="row g-2">
              {agentAccountTransactions.map((transaction, index) => {
                if (
                  context.agentCategory === null ||
                  context.agentCategory === "Agent" && transaction.description.split(' ')[0]!=="Chargeback"
                ) {
                  if (
                    transaction.transactionType ===
                    "EFASHE Airtime Payment(Agent)"
                  ) {
                    return (
                      <div class="col-12" id={index}>
                        <div class="horizontal-product-card">
                          <div class="d-flex align-items-center">
                            <div class="product-thumbnail-side">
                              <a
                                class="product-thumbnail shadow-sm d-block"
                                href="#"
                              >
                                <i class="fa-solid fa-list"></i>
                                <img
                                  src="assets/img/core-img/icon-ddn-72-w.png"
                                  alt=""
                                />
                              </a>
                            </div>
                            <div class="product-description">
                              <a class="wishlist-btn" href="#">
                                <img
                                  src="assets/img/core-img/ticker.png"
                                  alt=""
                                />
                              </a>
                              <a class="product-title d-block"  style={{ color: "white" }} href="#">
                                {transaction.description}
                              </a>

                              <p class="sale-price"  style={{ color: "white" }}>
                                <i class="fa-solid"></i>
                                {transaction.processDate.substring(0, 20)}
                                <span></span>
                              </p>

                              <div class="product-rating">
                                <i class="fa-solid fa-star"></i>TX:
                                {transaction.id}
                                <span class="ms-1" style={{ color: "white" }}>
                                  <b>
                                    Amount Rwf:
                                    {(
                                      parseFloat(-1 *transaction.amount) / (1 - 0.058)
                                    ).toFixed()}
                                    |
                                  </b>
                                </span>
                                <Link
                                  to="/ddin-airtime-receipt"
                                  style={{ color: "#f8882b" }}
                                  state={{
                                    transactionData: transaction,
                                    agentUsername: context.agentUsername,
                                  }}
                                >
                                  Receipt 
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                } else {
                  if (
                    transaction.transactionType ===
                    "EFASHE Airtime Payment(Corporate)" && transaction.description.split(' ')[0]!=="Chargeback"
                  ) {
                    return (
                      <div class="col-12" id={index}>
                        <div class="horizontal-product-card">
                          <div class="d-flex align-items-center">
                            <div class="product-thumbnail-side">
                              <a
                                class="product-thumbnail shadow-sm d-block"
                                href="#"
                              >
                                <i class="fa-solid fa-list"></i>
                                <img
                                  src="assets/img/core-img/icon-ddn-72-w.png"
                                  alt=""
                                />
                              </a>
                            </div>
                            <div class="product-description">
                              <a class="wishlist-btn" href="#">
                                <img
                                  src="assets/img/core-img/ticker.png"
                                  alt=""
                                />
                              </a>
                              <a class="product-title d-block"  style={{ color: "white" }} href="#">
                                {transaction.description}
                              </a>

                              <p class="sale-price"  style={{ color: "white" }}>
                                <i class="fa-solid"></i>
                                {transaction.processDate.substring(0, 20)}
                                <span></span>
                              </p>

                              <div class="product-rating">
                                <i class="fa-solid fa-star"></i>TX:
                                {transaction.id}
                                <span class="ms-1" style={{ color: "white" }}>
                                  <b>
                                    Amount Rwf:
                                    {(
                                      parseFloat(-1 *transaction.amount) / (1- 0.058)
                                    ).toFixed()}
                                    |
                                  </b>
                                </span>
                                <Link
                                  to="/ddin-airtime-receipt"
                                  style={{ color: "#f8882b" }}
                                  state={{
                                    transactionData: transaction,
                                    agentUsername: context.agentUsername,
                                  }}
                                >
                                  Preview Receipt
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
              })}
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
