/**
 * *@gniyonge
 * NPO Service Page

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
import PreviewPaymentReceiptDialog from "./ConfirmServicePaymentResponse";
import PreviewNpoServicePayment from "./ConfirmNpoServicePayment";
import PreviewNpoServicePaymentResponse from "./ConfirmNpoServicePaymentResponse";
import PreviewNpoServicePaymentInitiation from "./ConfirmNpoServicePaymentInitiation";
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
  viewNpoRegistrations,
  viewNpoAddresses,
  viewAgentFloatAccountTransactionsById,
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

export default function NpoServicePage() {
  const [openAddress, setOpenAddress] = useState(false);
  const [openClientTypes, setOpenClientTypes] = useState(false);
  const [selectedClientType, setSelectedClientType] = useState({
    status: false,
    name: "Organization",
  });

  const [options, setOptions] = React.useState([]);
  //const loading = open && options.length === 0;

  const classes = useStyles();
  const context = useContext(Context);
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showConfirmResponseDialog, setShowConfirmResponseDialog] =
    useState(false);
  const [showConfirmPaymentDialog, setShowConfirmPaymentDialog] =
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
  const [agentAccountMetaTransactions, setAgentAccountMetaTransactions] =
    useState([]);
  const [
    agentAccountTransactionsByIdData,
    setAgentAccountTransactionsByIdData,
  ] = useState([]);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [balance, setbalance] = useState("Rwf 0.00");
  const [formattedBalance, setFormattedBalance] = useState("Rwf 0.00");
  const [agentNameId, setAgentNameId] = useState("Agent Float A/C");
  const [textAreaCount, setTextAreaCount] = useState(0);
  const [businessTin, setBusinessTin] = useState("");
  const [identityTypeSelected, setIdentityTypeSelected] = useState("1");
  const [value, setValue] = useState("");
  const [npoAddressData, setNpoAddressData] = useState(null);

  //NPO client registration
  const [firstname, setFirstname] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [identityType, setIdentityType] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");

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

  const [clientCategory, setClientCategory] = useState("Organization");
  const [postalCodeId, setPostalCodeId] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [postalCodeName, setPostalCodeName] = useState("");
  const [isPersonal, setIsPersonal] = useState(null);

  const [receiptId, setReceiptId] = useState("");
  const [receiptNote, setReceiptNote] = useState("");
  const [serviceFeeAmt, setServiceFeeAmt] = useState("");
  const [totalPayment, setTotalPayment] = useState("");

  const clientTypesCode = [
    { status: false, name: "Organization" },
    { status: true, name: "Personal" },
  ];

  const [amount, setAmount] = useState(15000);
  useEffect(() => {
    if (npoAddressData === null) {
      queryNpoAddresses();
    }
  }, []);

  //Data

  const handleChange = (e) => {
    setPostalCodeId(e.target.value);
  };

  const handleClientTypeChange = (e) => {
    setIsPersonal(e.target.value);
  };
  const findPostalCodeName = (postalCodeId) => {
    const foundPostalCode = npoAddressData.find(
      (item) => item.postal_code === postalCodeId
    );

    if (foundPostalCode) {
      return foundPostalCode.name;
    }

    // Return a default value or handle the case when postal code is not found
    return "";
  };
  const selectionChangeHandlerIdentityType = (event) => {
    setIdentityTypeSelected(event.target.value);
  };
  const audioPlayer = useRef(null);

  function playAudio() {
    audioPlayer.current.play();
  }

  const validatePhoneNumberLevel = (number) => {
    const isValidPhoneNumber = validator.isMobilePhone(number);
    return isValidPhoneNumber;
  };

  const viewFloatAccountInfo = (e) => {
    e.preventDefault();
    queryAgentAccountTransactions();
  };

  const confirmPindoPayment = async (e) => {
    e.preventDefault();

    if (validator.isEmail(clientEmail)) {
      if (identityNumber.length >= 3) {
        if (value.length === 13 || value.length === 12) {
          if (identityTypeSelected === "1") {
            if (isNumber(identityNumber)) {
              setIdentityType("NATIONAL ID");
              if (postalCodeId === "") {
                toast.error(
                  "Please Select Postal Office Location" + postalCodeId
                );
              } else {
                if (isPersonal != null) {
                  console.log("Client Type:" + isPersonal);
                  viewConfirmDialog();
                } else {
                  toast.error("Please Select Client Type");
                }
              }
            } else {
              toast.error("Identity Number Must Be A Valid Set of Number");
            }
          } else if (identityTypeSelected === "2") {
            setIdentityType("PASSPORT");
            setPassportNumber(identityNumber);
            viewConfirmDialog();
          }
        } else {
          toast.error("Phone Number is Not Valid");
        }
      } else {
        toast.error("Identity Number Size is Invalid");
      }
    } else {
      toast.error(
        "Please provide a valid email address: Ex. example@gmail.com"
      );
    }
  };
  const viewConfirmDialog = () => {
    setShowConfirmDialog(true);
  };
  const viewConfirmPaymentDialog = () => {
    setShowConfirmResponseDialog(true);
  };
  const queryAgentAccountTransactions = async () => {
    try {
      //Test A/C No:33
      //Prod A/C No:22

      const response = await viewNpoRegistrations(context.userKey, "33");

      if (response.responseCode === "200") {
        setAgentAccountTransactions(response.data);
        setAgentAccountMetaTransactions(response.metadata);
      } else {
        //toast.info(response.responseDescription);
      }
    } catch (err) {
      //console.log("Agent Account Status Error:"+err);
    }
  };

  //view addresses:

  const queryNpoAddresses = async () => {
    try {
      const response = await viewNpoAddresses(context.userKey);

      if (response.responseCode === "200") {
        setNpoAddressData(response.data);
      } else {
        //toast.info(response.responseDescription);
      }
    } catch (err) {
      //console.log("View Address Status Error:"+err);
    }
  };
  const queryAgentAccountTransactionsById = async (transId) => {
    setShowReceiptDialog(false);
    const id = toast.loading("Previewing NPO Receipt...");

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
          navigate("/ddin-npo-receipt", {
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
  const createNewNpoClientProfile = async () => {
    const id = toast.loading("Processing NPO Client Registration...");

    try {
      //Test Agent: Transfer Id=95 , Member Id= 24
      //Prod Agent: Transfer Id=95, Member Id=11

      const newNpoClientRequestBody = {
        amount: amount,
        description:
          "NPO Client Registration Through DDIN Agent ID:" +
          context.agentUsername +
          ",Client Data:Firstname:" +
          firstname +
          ",Lastname:" +
          lastname +
          ",Client Mobile:" +
          value +
          ",Identity Type:" +
          identityType +
          ",Identity Number:" +
          identityNumber +
          ",Postal Office:" +
          postalCodeName +
          ",Middle name:" +
          middleName +
          ",Client Type:" +
          clientCategory +
          ",Client Email:" +
          clientEmail +
          ",Client NPO Address:" +
          value,
        currencySymbol: "Rwf",
        transferTypeId: "95",
        toMemberId: "24",
        firstName: firstname,
        lastName: lastname,
        mobile: value.substring(1, 13),
        nationalIdNumber: identityNumber,
        passportNumber: passportNumber,
        referralCode: "DDIN250",
        npoClientId: "",
        accountId: context.agentFloatAccountId,
        agentId: context.agentUsername,
        mpostSystemMetadata: "",
        province: context.province,
        district: context.district,
        sector: context.sector,
        postalCodeId: postalCodeId,
        postalCode: postalCode,
        middleName: middleName,
        isPersonal: isPersonal,
        clientEmail: clientEmail,
        userId: context.userId,
        agentCategory: context.agentCategory,
      };

      const response = await registerNpoClient(
        newNpoClientRequestBody,
        context.userKey
      );

      if (response.responseCode === "200") {
        setShowConfirmResponseDialog(false);
        playAudio();

        setReceiptAmount("2000");
        setReceiptDescription(
          "NPO Client Registration Through DDIN Agent ID:" +
            context.agentUsername +
            ",Client Data:Firstname:" +
            firstname +
            ",Lastname:" +
            lastname +
            ",Client Mobile:" +
            value +
            ",Identity Type:" +
            identityType +
            ",Identity Number:" +
            identityNumber
        );
        setReceiptFirstName(firstname);
        setReceiptLastName(lastname);
        setReceiptMobile(value);
        setReceiptNationalIdNumber(identityNumber);
        setReceiptPassportNumber(passportNumber);
        setReceiptReferralCode("DDIN250");
        setReceiptNpoClientId(response.transactionId);
        setReceiptAgentId(context.agentUsername);
        setReceiptMpostSystemMetadata("");
        setReceiptProvince("");
        setReceiptDistrict("");
        setReceiptSector("");
        setReceiptTxDate(new Date());
        //toast.dismiss();

        /*toast.update(id, {
          render:
            "NPO client registration processing completed successfully with transaction No:" +
            response.transactionId +
            "-SMS Status:" +
            response.responseStatus,
          type: "success",
          isLoading: false,
          closeButton: null,
        });*/
        setValidFileLevel(false);
        setFirstname("");
        setLastname("");
        setMiddleName("");
        setClientEmail("");
        setIdentityNumber("");
        setPostalCodeId("");
        setIsPersonal(null);
        setValue("");

        toast.dismiss();
        setReceiptId(response.responseStatus);
        setReceiptNote(
          "NPO client registration processing completed successfully with transaction No:" +
            response.transactionId +
            "-SMS Status:" +
            response.responseDescription
        );
        setServiceFeeAmt("");
        setTotalPayment(amount);
        setShowReceiptDialog(true);
      } else {
        //Testing The Payment Initiation:
        // toast.dismiss();
        // setShowConfirmPaymentDialog(true);
        toast.update(id, {
          render:
            response.responseDescription + "-SMS:" + response.responseStatus,
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

  const sendPaymentRequest = async () => {
    setShowConfirmDialog(false);

    createNewNpoClientProfile();
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
                <img class="w-100" src="assets/img/core-img/npo.jpeg" alt="" />
              </div>
              <div class="text-content">
                {/*
                  NPO Testing Phase@
                   */}
                <h4 class="text-white mb-1">NPO Client Registration</h4>
                <p class="text-white mb-0">
                  Please note registration is complete after payment of the
                  subscription fee of<span class="px-1 fw-bold"></span>{" "}
                  <b>Rwf 8,000 </b>for personal A/C or <b>Rwf 15,000</b> for
                  Organization.
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
                        <b>Register A New NPO Client</b>
                      </span>
                    </div>

                    <form onSubmit={confirmPindoPayment}>
                      <div class="form-group text-start mb-4">
                        <span style={{ color: "black", fontSize: 16 }}>
                          <b>First Name:</b>
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
                          autoFocus={true}
                          onChange={(e) => setFirstname(e.target.value)}
                          value={firstname}
                          required
                        />
                      </div>
                      <div class="form-group text-start mb-4">
                        <span style={{ color: "black", fontSize: 16 }}>
                          <b>Middle Name:</b>
                          <b style={{ color: "red" }}></b>
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
                          onChange={(e) => setMiddleName(e.target.value)}
                          value={middleName}
                        />
                      </div>
                      <div class="form-group text-start mb-4">
                        <span style={{ color: "black", fontSize: 16 }}>
                          <b>Last Name:</b>
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
                          onChange={(e) => setLastname(e.target.value)}
                          value={lastname}
                          required
                        />
                      </div>

                      <div class="form-group text-start mb-4">
                        <span style={{ color: "black", fontSize: 16 }}>
                          <b>E-mail:</b>
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
                          onChange={(e) => setClientEmail(e.target.value)}
                          value={clientEmail}
                          placeholder="example@gmail.com"
                          required
                        />
                      </div>

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
                        <FormControl required variant="outlined">
                          <InputLabel
                            shrink
                            style={{ color: "black", fontSize: 18 }}
                          >
                            <b>Select Your Identity Type:</b>
                            <b style={{ color: "red" }}>*</b>
                          </InputLabel>
                          <Select
                            autofocus
                            value={identityTypeSelected}
                            onChange={selectionChangeHandlerIdentityType}
                          >
                            <MenuItem value="1">National ID</MenuItem>
                            <MenuItem value="2">Passport</MenuItem>
                          </Select>
                          <FormHelperText
                            style={{ color: "blue", fontSize: 12 }}
                          >
                            NPO Client Identity Types
                          </FormHelperText>
                        </FormControl>
                      </div>

                      <div class="form-group text-start mb-4">
                        <span style={{ color: "black", fontSize: 16 }}>
                          <b>Identity Number:</b>
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
                          onChange={(e) => setIdentityNumber(e.target.value)}
                          value={identityNumber}
                          required
                        />
                      </div>
                      <div class="form-group text-start mb-4">
                        <Autocomplete
                          id="disable-close-on-select"
                          sx={{ width: 300 }}
                          open={openAddress}
                          onOpen={() => {
                            setOpenAddress(true);
                          }}
                          onClose={() => {
                            setOpenAddress(false);
                          }}
                          getOptionLabel={(option) => option.name}
                          options={npoAddressData}
                          value={
                            postalCodeId
                              ? npoAddressData.find(
                                  (option) =>
                                    option.postal_code_id === postalCodeId
                                ) || null
                              : null
                          }
                          onChange={(event, newValue) => {
                            //console.log("Postal Code:" + newValue?.postal_code);
                            setPostalCodeId(newValue?.postal_code_id || null);
                            setPostalCode(newValue?.postal_code || null);
                            setPostalCodeName(newValue?.name || null);
                            //postal_code_id
                          }}
                          renderInput={(params) => (
                            <TextField
                              style={{ color: "red", fontSize: 25 }}
                              variant="standard"
                              {...params}
                              label="Choose Postal Office"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {/* Add loading indicator if needed */}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                            />
                          )}
                        />
                      </div>

                      <div class="form-group text-start mb-4">
                        <Autocomplete
                          id="disable-close-on-select"
                          sx={{ width: 300 }}
                          open={openClientTypes}
                          onOpen={() => {
                            setOpenClientTypes(true);
                          }}
                          onClose={() => {
                            setOpenClientTypes(false);
                          }}
                          getOptionLabel={(option) => option.name}
                          options={clientTypesCode}
                          value={
                            clientTypesCode.find(
                              (option) =>
                                option.status === selectedClientType?.status
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            setSelectedClientType(newValue);

                            setIsPersonal(newValue?.status || false);
                            // Set amount based on the status
                            if (newValue && newValue.status) {
                              setAmount(8000); // Set amount to 8000 when status is true
                              setClientCategory("Personal");
                            } else {
                              setAmount(15000); // Set amount to 15000 when status is false
                              setClientCategory("Organization");
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              style={{ color: "red", fontSize: 25 }}
                              variant="standard"
                              {...params}
                              label="Choose Client Type"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {/*loading ? <CircularProgress color="inherit" size={20} /> : null*/}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                            />
                          )}
                        />
                      </div>

                      <button class="btn btn-warning btn-lg w-100">
                        Register
                      </button>

                      <ToastContainer className="toast-position" />
                      <PreviewNpoServicePayment
                        firstname={firstname}
                        openstatus={showConfirmDialog}
                        lastname={lastname}
                        identityType={identityType}
                        identityNumber={identityNumber}
                        phoneNumber={value}
                        clientEmail={clientEmail}
                        postalCode={postalCode}
                        clientType={clientCategory}
                        middleName={middleName}
                        amount={amount}
                        closeClick={() =>
                          setShowConfirmDialog(!showConfirmDialog)
                        }
                        confirmClick={() => sendPaymentRequest()}
                      />
                      <PreviewNpoServicePaymentResponse
                        paymentResponse={receiptDescription}
                        firstname={firstname}
                        openstatus={showConfirmResponseDialog}
                        lastname={lastname}
                        identityType={identityType}
                        identityNumber={identityNumber}
                        phoneNumber={value}
                        amount={amount}
                        closeClick={() =>
                          setShowConfirmDialog(!showConfirmResponseDialog)
                        }
                        previewReceiptClick={() => sendPaymentRequest()}
                      />
                      <PreviewNpoServicePaymentInitiation
                        paymentResponse={receiptDescription}
                        firstname={firstname}
                        openstatus={showConfirmPaymentDialog}
                        mobile={value}
                        clientId={"62521"}
                        identityNumber={identityNumber}
                        phoneNumber={"250781280012"}
                        closeClick={() =>
                          setShowConfirmPaymentDialog(!showConfirmPaymentDialog)
                        }
                        previewReceiptClick={() => console.log("")}
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
              <h6>Registered NPO Clients</h6>

              <Link class="btn p-0" onClick={viewFloatAccountInfo}>
                View All Clients
                <i class="ms-1 fa-solid fa-arrow-right-long"></i>
              </Link>
            </div>
            <div class="row g-2">
              {agentAccountMetaTransactions.map((client, index) => {
                if (client.agentId === context.agentUsername) {
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
                            <a class="product-title d-block" href="#">
                              {agentAccountTransactions[index].description}
                            </a>

                            <p class="sale-price">
                              <i class="fa-solid"></i>
                              {agentAccountTransactions[
                                index
                              ].processDate.substring(0, 20)}
                              <span></span>
                            </p>

                            <div class="product-rating">
                              <i class="fa-solid fa-star"></i>TX:
                              {agentAccountTransactions[index].id}
                              <span class="ms-1" style={{ color: "red" }}>
                                <b>
                                  Amount Rwf:
                                  {parseFloat(
                                    agentAccountTransactions[index].amount
                                  ) + 2000}
                                  |
                                </b>
                              </span>
                              <Link
                                to="/ddin-npo-receipt"
                                state={{
                                  transactionData:
                                    agentAccountTransactions[index],
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
