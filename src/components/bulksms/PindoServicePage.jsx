/**
 * *@gniyonge
 * Pindo Service Page

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
} from "@material-ui/core";
import { toast, ToastContainer } from "react-toastify";
import PreviewPaymentReceiptDialog from "./ConfirmBulkServicePaymentResponse";
import PreviewPindoServicePayment from "./ConfirmPindoServicePayment";
import ConfirmBulkSsmFileServicePayment from "./ConfirmBulkSsmFileServicePayment";
import NotificationSound from "../../images/audio/notificationsound.wav";
import { read, utils, writeFile } from "xlsx";
import TextareaAutosize from "react-textarea-autosize";
import $ from "jquery";
import SmsCounter from "sms-counter";
import Form from "react-bootstrap/Form";
import validator from "validator";
import { Context } from "../Wrapper";
import {
  payPindo,
  payPindov2,
  payFdi,
  payFdiv2,
  viewAgentFloatAccountStatus,
  viewAgentFloatAccountTransactions,
  viewAgentFloatAccountTransactionsYc,
  registerYellowCardUserSecondStep,
  registerYellowCardUserFirstStep,
  viewAgentFloatAccountTransactionsById,
} from "../../apis/UserController";
import LoginPage from "../user/LoginPage";
import FooterPage from "../footer/FooterPage";
import HeaderPage from "../header/HeaderPage";
import { payPindoBulkSMS, viewAgentAccountTransactions, viewAgentAccountTransactionsById } from "../../apis/ServiceController";

export default function PindoServicePage() {
  const classes = useStyles();
  const context = useContext(Context);
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showConfirmBulkFileDialog, setShowConfirmBulkFileDialog] =
    useState(false);
  const [smsAmount, setSmsAmount] = useState(1000);
  const [agentName, setAgentName] = useState("");
  const [message, setMessage] = useState("");
  const [clientName, setClientName] = useState("-");
  const [clientPhone, setClientPhone] = useState("-");
  const [clientEmail, setClientEmail] = useState("-");
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
  const [userPhoneNumbers, setUserPhoneNumbers] = useState([]);
  const [agentAccountTransactions, setAgentAccountTransactions] = useState([]);
  const [balance, setbalance] = useState("Rwf 0.00");
  const [formattedBalance, setFormattedBalance] = useState("Rwf 0.00");
  const [agentNameId, setAgentNameId] = useState("Agent Float A/C");
  const [textAreaCount, setTextAreaCount] = useState(0);
  const [businessTin, setBusinessTin] = useState("");
  const [transferId, setTransferId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [
    agentAccountTransactionsByIdData,
    setAgentAccountTransactionsByIdData,
  ] = useState([]);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [receiptId, setReceiptId] = useState("");
  const [receiptNote, setReceiptNote] = useState("");
  const [serviceFeeAmt, setServiceFeeAmt] = useState("");
  const [totalPayment, setTotalPayment] = useState("");

  const recalculate = (e) => {
    setTextAreaCount(e.target.value.length);
    setMessage(e.target.value);
    const mdi = SmsCounter.count(e.target.value);
    setMessageCounter(mdi.messages);
    setMessageRemainderCounter(mdi.remaining);
    setMessageLength(mdi.length);
    setMessageCharacterLimit(mdi.per_message);
    setTotalSmsCost(parseFloat(mdi.messages) * 15 * recipientNumber);
  };

  const audioPlayer = useRef(null);

  function playAudio() {
    audioPlayer.current.play();
  }

  const validatePhoneNumberLevel = (number) => {
    let isValidPhoneNumber = validator.isMobilePhone(number + "");

    return isValidPhoneNumber;
  };
  const handleClick = (event) => {
    const { target = {} } = event || {};
    target.value = "";
  };

  const viewFloatAccountInfo = () => {
    queryAgentAccountTransactions();
  };

  const validatePhoneNumbers = (data) => {
    users.map((user, index) => {
      if (user?.name && user?.number) {
        if (user.number.length) {
          if (validatePhoneNumberLevel(user.number)) {
          } else {
            return {
              code: "5",
              message:
                "Invalid Phone Number Format : " +
                user.number +
                " - For Recient Row:" +
                (index + 1) +
                " with Name:" +
                user.name,
            };
          }
        } else {
          return {
            code: "6",
            message:
              "Invalid Phone Number Length: " +
              user.number +
              " - For Recient Row:" +
              (index + 1) +
              " with Name:" +
              user.name,
          };
        }
      } else {
        return {
          code: "7",
          message:
            "Please The uploaded recipient file does not have valid column names <<name>> & <<phone numbers>>",
        };
      }
    });

    return { code: "1", message: "VALID FILE" };
  };

  const handleImport = ($event) => {
    setValidFileLevel(true);
    setValidFileLevelMessage("");

    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          //setUserPnoneNumbers(arr_obj);

          setUsers(rows);
          setRecipientNumber(rows.length);
          setSmsCost(rows.length * 15);

          let arr_obj = [];
          for (let i = 0; i < rows.length; i++) {
            let valueNumber = "" + rows[i]?.number;

            if (rows[i]?.name && rows[i]?.number) {
              if (valueNumber.length === 12) {
                if (isNumber(valueNumber)) {
                  let datas={
                    "name":`${(rows[i]?.name).toString()}`,
                    "number":`${(rows[i]?.number).toString()}`
                  }
                  //arr_obj.push((rows[i]?.number).toString());
                  arr_obj.push(datas);

                  if (valueNumber.length > 10 && valueNumber.length < 14) {
                    if (validatePhoneNumberLevel(rows[i].number)) {
                      continue;
                    } else {
                      setValidFileLevel(false);
                      setValidFileLevelMessage(
                        "Invalid Phone Number Format : " +
                          rows[i].number +
                          " - For Recient Row:" +
                          (i + 1) +
                          " with Name:" +
                          rows[i].name +
                          ". Please refer to header <<name, number>>. Example: Andrea Fisher, +250781234567"
                      );
                      setShowConfirmBulkFileDialog(true);

                      break;
                    }
                  } else {
                    setValidFileLevel(false);
                    setValidFileLevelMessage(
                      "Invalid Phone Number Length: " +
                        rows[i].number +
                        " - For Recient Row:" +
                        (i + 1) +
                        " with Name:" +
                        rows[i].name +
                        ". Please refer to header <<name, number>>. Example: Andrea Fisher, +250781234567"
                    );
                    setShowConfirmBulkFileDialog(true);
                    break;
                  }
                } else {
                  setValidFileLevel(false);
                  setValidFileLevelMessage(
                    "Invalid Phone Number Format : " +
                      rows[i].number +
                      " - For Recient Row:" +
                      (i + 1) +
                      " with Name:" +
                      rows[i].name +
                      ". Please refer to header <<name, number>>. Example: Andrea Fisher, +250781234567"
                  );
                  setShowConfirmBulkFileDialog(true);
                  break;
                }
              } else {
                setValidFileLevel(false);
                setValidFileLevelMessage(
                  "Invalid Phone Number Format : " +
                    rows[i].number +
                    " - For Recient Row:" +
                    (i + 1) +
                    " with Name:" +
                    rows[i].name +
                    ". Please refer to header <<name, number>>. Example: Andrea Fisher, +250781234567"
                );
                setShowConfirmBulkFileDialog(true);
                break;
              }
            } else {
              setValidFileLevel(false);
              setValidFileLevelMessage(
                "Please The uploaded recipient file does not have valid column names <<name>> & <<phone numbers>>"
              );
              setShowConfirmBulkFileDialog(true);

              break;
            }
          }
          setUserPhoneNumbers(arr_obj);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const confirmPindoPayment = async (e) => {
    e.preventDefault();
    viewConfirmDialog();
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

  //Executing Pindo Sms:
  const makePindoPmt = async () => {
    const id = toast.loading("Processing bulk sms request...");

    try {
      if (isNumber(smsCost + "")) {
        //Test PINDO Agent: Transfer Id=32 , Member Id= 4
        //Prod PINDO Agent: Transfer Id=31, Member Id=3

        //Test PINDO Corporate: Transfer Id=43 , Member Id= 4
        //Prod PINDO Corporate Id=38, Member Id=3

        const pindoPaymentBody = {
          amount: totalSmsCost,
          description:
            "DDIN Agent Bulk SMS Vending TX by Agent:" +
            context.agentUsername +
            ",Client Name:" +
            senderId +
            ",ClientPhone:" +
            clientPhone +
            ",ClientTin:" +
            clientTin +
            ",Business TIN:" +
            businessTin +
            ",Total Recipients:" +
            recipientNumber +
            ", Total SMS Per Recipient:" +
            messageCounter +
            ". Total Paid amount:" +
            totalSmsCost,
          currencySymbol: "Rwf",
          transferTypeId: returnPindoTransferId(),
          province: context.province,
          district: context.district,
          sector: context.sector,
          toMemberId: returnPindoMemberId(),
          senderId: senderId,
          recipients: users,
          smsMessage: message,
          accountId: context.agentFloatAccountId,
          userId: context.userId,
          agentCategory: context.agentCategory,
        };
      
        //previous method
        //const response = await payPindo(pindoPaymentBody, context.userKey); 
        //new method
        const response = await payPindoBulkSMS(pindoPaymentBody, context.userKey);
       
        if (response.responseCode === 200) {
          
          playAudio();
          
          setValidFileLevel(false);

          //Clearing some data for new request

          toast.dismiss();
          setReceiptId(response.responseStatus);
          setReceiptNote(response.responseDescription);
          setServiceFeeAmt("");
          setTotalPayment(totalSmsCost);
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
      } else {
        toast.update(id, {
          render:
            "Invalid payment amount value.Please re-enter amount value. 1",
          type: "warning",
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

  //Executing FDI Sms:
  const makeFdiPmt = async () => {
    const id = toast.loading("Processing bulk sms request...");

    try {
      if (isNumber(smsCost + "")) {
        //TEST Agent FDI: Transfer Id=51, Member Id=35
        //TEST Corporate FDI: Transfer Id=75, Member Id=35
        //PROD Agent FDI: Transfer Id=46, Member Id=17
        //PROD Corporate FDI: Transfer Id=47, Member Id=17
        const pindoPaymentBody = {
          amount: totalSmsCost,
          description:
            "DDIN Agent Bulk SMS Vending TX by Agent:" +
            context.agentUsername +
            ",Client Name:" +
            senderId +
            ",ClientPhone:" +
            clientPhone +
            ",ClientTin:" +
            clientTin +
            ",Business TIN:" +
            businessTin +
            ",Total Recipients:" +
            recipientNumber +
            ", Total SMS Per Recipient:" +
            messageCounter +
            ". Total Paid amount:" +
            totalSmsCost,
          currencySymbol: "Rwf",
          transferTypeId: returnTransferId(),
          province: context.province,
          district: context.district,
          sector: context.sector,
          toMemberId: returnMemberId(),
          senderId: senderId,
          recipients: userPhoneNumbers,
          smsMessage: message,
          accountId: context.agentFloatAccountId,
          userId: context.userId,
          agentCategory: context.agentCategory,
        };
        //console.log("liveagent:",pindoPaymentBody)
        //const response={responseCode:200}
        const response = await payFdi(pindoPaymentBody, context.userKey);
       
        if (response.responseCode === "200") {
        
          playAudio();
         
          setValidFileLevel(false);
          toast.dismiss();
          setReceiptId(response.responseStatus);
          setReceiptNote(response.responseDescription);
          setServiceFeeAmt("");
          setTotalPayment(totalSmsCost);
          setShowReceiptDialog(true);
          //Clearing some data for new request
        } else {
          console.log(
            "Logging DIN System request:" + response.responseDescription
          );
          toast.update(id, {
            render: response.responseDescription,
            type: "info",
            isLoading: false,
            closeButton: null,
          });
          setValidFileLevel(false);
        }
      } else {
        toast.update(id, {
          render:
            "Invalid payment amount value.Please re-enter amount value. 1",
          type: "warning",
          isLoading: false,
          closeButton: null,
        });
        setValidFileLevel(false);
      }
    } catch (err) {
      console.log("Logging DIN System request Error:" + err);
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

  const queryAgentAccountTransactionsById = async (transId) => {
    setShowReceiptDialog(false);
    const id = toast.loading("Previewing Bulk Sms Receipt...");
    try {
      //orevious method
      // const response = await viewAgentFloatAccountTransactionsById(
      //   context.userKey,
      //   context.agentFloatAccountId,
      //   transId
      // );
      const response = await viewAgentAccountTransactionsById(
        context.userKey,
        transId
      );

      if (response.responseCode === 200) {
        setAgentAccountTransactionsByIdData(response.data);

        const firstTransaction = response.data[0];

        if (firstTransaction) {
          navigate("/ddin-receipt", {
            state: {
              transactionData: firstTransaction,
              agentUsername: context.agentUsername,
              recipientNumber: recipientNumber,
              messageCounter: messageCounter,
              totalReceiptAmount: totalSmsCost,
              clientName: senderId,
              clientPhone: clientPhone,
              clientEmail: clientEmail,
              clientTin: clientTin,
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
  //========Pindo Transfers Identification============================
  //Test PINDO Agent: Transfer Id=32 , Member Id= 4
  //Prod PINDO Agent: Transfer Id=31, Member Id=3
  const returnPindoMemberId = () => {
    if (context.agentCategory === null || context.agentCategory === "Agent") {
      //Test Env:
      //setMemberId("4");
      //Prod Env:
       setMemberId("3");

      return "3";
    } else {
      //Test Env
      //setMemberId("4");
      //Prod Env
      setMemberId("3");

      return "3";
    }
  };
  //===================
  const returnPindoTransferId = () => {
    if (context.agentCategory === null || context.agentCategory === "Agent") {
      

      //Test Env:
      //setTransferId("32");
      //Prod Env:
      setTransferId("31");

      return "31";
    } else {
      //Test Env
      //setTransferId("43");

      //Prod Env
      setTransferId("38");

      return "38";
    }
  };
  //======== FDI Core Transfers Identification==========================
  const returnMemberId = () => {
    if (context.agentCategory === null || context.agentCategory === "Agent") {
      //Test Env:
      //setMemberId("35");
      //Prod Env:
      setMemberId("17");

      return "17";
    } else {
      //Test Env
      //setMemberId("35");
      //Prod Env
      setMemberId("17");

      return "17";
    }
  };
  //===============================
  const returnTransferId = () => {
    if (context.agentCategory === null || context.agentCategory === "Agent") {
      //console.log("Agent Category");
      //Test Env:
     // setTransferId("51");
      //Prod Env:
      setTransferId("46");

      return "46";
    } else {
      //Test Env
      //setTransferId("75");

      //Prod Env
       setTransferId("47");

      return "47";
    }
  };
  const sendPaymentRequest = async () => {
    setShowConfirmDialog(false);

    if (context.agentCategory === null || context.agentCategory === "Agent") {
      //makeFdiPmt();
      makePindoPmt();
    } else {
      //makePindoPmtWithNoCommision();
      makeFdiPmt();
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
          <div class="section-heading d-flex align-items-center justify-content-between dir-rtl" >
            <h6 >
              <Link class="btn p-0 text-white" to="/">
                <i class="ms-1 fa-solid fa-arrow-left-long text-white"></i> Back 
              </Link>
            </h6>
          </div>
          <div class="discount-coupon-card-blue p-4 p-lg-5 dir-rtl">
            <div class="d-flex align-items-center">
              <div class="discountIcon">
                <img
                  class="w-100"
                  src="assets/img/core-img/icon-ddn-72-w.png"
                  alt=""
                />
              </div>
              <div class="text-content">
                <h4 class="text-white mb-1">DDIN Bulk Sms Portal</h4>
                <p class="text-white mb-0">
                  1 SMS<span class="px-1 fw-bold"></span>at Rwf 15
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
                        <b>Send Message</b>
                      </span>
                    </div>
                    <div class="form-group text-start mb-4">
                      <span style={{ color: "black", fontSize: 16 }}>
                        <b>Add Recipients List:</b>
                      </span>

                      <div
                        style={{
                          borderRadius: 10,
                          borderWidth: 1,
                          borderStyle: "solid",
                          backgroundColor: "white",
                          color: "blue",
                          paddingTop: 10,
                          paddingLeft: 5,
                          paddingRight: 5,
                        }}
                        className="mb-3"
                      >
                        <input
                          color="primary"
                          onChange={handleImport}
                          onClick={handleClick}
                          type="file"
                          multiple={false}
                          id="icon-button-file"
                          style={{ display: "none" }}
                          required
                          accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        />
                        <label htmlFor="icon-button-file">
                          <Button
                            color="secondary"
                            variant="contained"
                            component="span"
                          >
                            CHOOSE FILE TO UPLOAD
                          </Button>
                        </label>

                        <p
                          style={{
                            backgroundColor: "white",
                            color: "blue",
                            paddingTop: 2,
                            marginTop: 5,
                          }}
                        >
                          Upload “.csv" or excel file with column header “name,
                          number". Example: Andrea Fisher, 250781234567
                        </p>
                      </div>
                      <ConfirmBulkSsmFileServicePayment
                        openstatus={showConfirmBulkFileDialog}
                        message={validFileLevelMessage}
                        closeClick={() =>
                          setShowConfirmBulkFileDialog(
                            !showConfirmBulkFileDialog
                          )
                        }
                      />
                    </div>

                    <form onSubmit={confirmPindoPayment}>
                      {validFileLevel ? (
                        <>
                          <div class="form-group text-start mb-4">
                            <span style={{ color: "black", fontSize: 16 }}>
                              <b>Enter Bulk SMS Sender Id/Name:</b>
                              <b style={{ color: "red" }}>*</b>
                            </span>
                          
                          <select
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
                           onChange={(e) => setSenderId(e.target.value)}
                           value={senderId}
                           required
                          > 
                            <option value="">Select Sender ID</option>
                            <option value="INVITATION">INVITATION</option>
                            <option value="KWIBUTSA">KWIBUTSA</option>
                            <option value="KUMENYESHA">KUMENYESHA</option>
                            <option value="EGLISE">EGLISE</option>
                            <option value="CHURCH">CHURCH</option>
                            <option value="KAMUTWA">KAMUTWA</option>
                            <option value="GUSHIMIRA">GUSHIMIRA</option>
                            <option value="AKAGALI">AKAGALI</option>
                            <option value="UBUTUMIRE">UBUTUMIRE</option>
                            <option value="UBUKWE">UBUKWE</option>
                            <option value="UMURENGE">UMURENGE</option>
                            <option value="DDIN">DDIN</option>

                          </select>
                            {/* <input
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
                              onChange={(e) => setSenderId(e.target.value)}
                              value={senderId}
                              required
                            />  */}
                          </div>
                          <div class="form-group text-start mb-4">
                            <span style={{ color: "black", fontSize: 16 }}>
                              <b>Total Recipients Number:</b>
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
                                setRecipientNumber(e.target.value)
                              }
                              value={recipientNumber}
                              readOnly
                              required
                            />
                          </div>

                          <div
                            class="form-group text-start mb-4"
                            style={{ backgroundColor: "#ffffff", padding: 5 }}
                          >
                            <span style={{ color: "blue", fontSize: 20 }}>
                              <b>Type Message:</b>
                            </span>
                            <span
                              style={{
                                color: "blue",
                                justifyContent: "left",
                                textAlign: "left",
                              }}
                            >
                              {" "}
                              <b style={{ color: "green" }}>
                                {" "}
                                {messageCharacterLimit}
                              </b>{" "}
                              Remaining Characters/{" "}
                              <b style={{ color: "green" }}>{messageCounter}</b>{" "}
                              Sms/Rwf
                              <b style={{ color: "green" }}>
                                {" "}
                                {parseInt(messageCounter) * 15}
                              </b>
                              <b></b>
                              <b> |Total Recipients:</b>
                              <b style={{ color: "#fbac04" }}>
                                {recipientNumber}
                              </b>
                            </span>

                            <textarea
                              style={{
                                width: "100%",
                                marginBottom: 0,
                                borderColor: "green",
                                padding: 5,
                              }}
                              type="text"
                              required
                              rows={8}
                              className="full_height_Width"
                              onChange={recalculate}
                              placeholder="Hi @contact.name,please use this @format for inserting your recipient name."
                            />
                            <span
                              style={{
                                justifyContent: "left",
                                textAlign: "left",
                                paddingRight: 5,
                                color: "blue",
                              }}
                            >
                              {" "}
                              <b style={{ color: "blue", fontSize: 16 }}>
                                Total Message Characters Counter:{" "}
                              </b>
                              <b style={{ color: "#fbac04" }}>
                                {textAreaCount}
                              </b>
                              <b> | Total Cost:Rwf</b>{" "}
                              <b style={{ color: "#fbac04" }}>
                                {" "}
                                {totalSmsCost}
                              </b>
                            </span>
                          </div>

                          <div class="form-group text-start mb-4">
                            <span style={{ color: "black", fontSize: 16 }}>
                              <b>Total Bulk SMSs Cost(Rwf):</b>
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
                              onChange={(e) => setSmsCost(e.target.value)}
                              value={totalSmsCost}
                              readOnly
                              required
                            />
                          </div>

                          <div class="form-group text-start mb-4">
                            <span style={{ color: "black", fontSize: 16 }}>
                              <b>Business TIN:</b>
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
                              onChange={(e) => setBusinessTin(e.target.value)}
                              value={businessTin}
                            />
                          </div>

                          <button class="btn btn-warning btn-lg w-100">
                            Send Message
                          </button>
                        </>
                      ) : (
                        <></>
                      )}

                      <ToastContainer className="toast-position" />
                      <PreviewPindoServicePayment
                        totalReceipients={recipientNumber}
                        openstatus={showConfirmDialog}
                        smsmount={smsAmount}
                        agentname={agentName}
                        receiptMessageCounter={messageCounter}
                        receiptMessageRemainderCounter={messageRemainderCounter}
                        receiptMessageLength={messageLength}
                        receiptMessageCharacterLimit={messageCharacterLimit}
                        receiptSmsCost={totalSmsCost}
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
                  {validFileLevel ? (
                    <div
                      class="form-group text-start mb-4"
                      style={{
                        backgroundColor: "white",
                        color: "blue",
                        paddingTop: 2,
                        marginTop: 5,
                      }}
                    >
                      <span></span>
                      <label>
                        <i class="fa-solid fa-envelope-circle-check"></i>
                      </label>

                      <div className="row">
                        <h4 style={{ color: "blue" }}>Recipients details:</h4>
                        <div
                          className="col-md-12"
                          style={{ overflowY: "scroll", height: 200 }}
                        >
                          <table
                            className="table"
                            style={{ backgroundColor: "white", color: "black" }}
                          >
                            <thead>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Names</th>
                                <th scope="col">Phone numbers</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.length > 0 ? (
                                users.map((user, index) => {
                                  return (
                                    <tr key={index}>
                                      <th scope="row">{index + 1}</th>
                                      <td>{user?.name}</td>
                                      <td>{user?.number}</td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan={5} className="text-center">
                                    No Data
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}

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
              <h6>Agents Transactions</h6>

              <Link class="btn p-0 text-white" onClick={viewFloatAccountInfo}>
                View All<i class="ms-1 fa-solid fa-arrow-right-long"></i>
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
                    "Pindo Bulk Sms Payment(Agent)"
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
                              <a class="product-title d-block" style={{ color: "white" }} href="#">
                                {transaction.description}
                              </a>

                              <p class="sale-price" style={{ color: "white" }}>
                                <i class="fa-solid" ></i>
                                {transaction.processDate.substring(0, 20)}
                                <span></span>
                              </p>

                              <div class="product-rating" >
                                <i class="fa-solid fa-star"></i>TX:
                                {transaction.id}
                                <span class="ms-1" style={{ color: "white" }}>
                                  <b>
                                    Amount Rwf:
                                    {parseFloat(transaction.amount) * 2.5}|
                                  </b>
                                </span>
                                <Link
                                  to="/ddin-receipt"
                                  style={{ color: "#f8882b" }}
                                  state={{
                                    transactionData: transaction,
                                    agentUsername: context.agentUsername,
                                    recipientNumber: recipientNumber,
                                    messageCounter: messageCounter,
                                    totalReceiptAmount: totalSmsCost,
                                    clientName: senderId,
                                    clientPhone: clientPhone,
                                    clientEmail: clientEmail,
                                    clientTin: clientTin,
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
                  } else if (
                    transaction.transactionType ===
                    "FDI Bulk Sms Payment(Agent)" && transaction.description.split(' ')[0]!=="Chargeback"
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
                              <a class="product-title d-block" style={{ color: "white" }} href="#">
                                {transaction.description}
                              </a>

                              <p class="sale-price" style={{ color: "white" }}>
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
                                      parseFloat(transaction.amount) +
                                      parseFloat(transaction.amount) * 3.57
                                    ).toFixed()}
                                    |
                                  </b>
                                </span>
                                <Link
                                  to="/ddin-bulksms-receipt"
                                  style={{ color: "#f8882b" }}
                                  state={{
                                    transactionData: transaction,
                                    agentUsername: context.agentUsername,
                                    recipientNumber: recipientNumber,
                                    messageCounter: messageCounter,
                                    totalReceiptAmount: totalSmsCost,
                                    clientName: senderId,
                                    clientPhone: clientPhone,
                                    clientEmail: clientEmail,
                                    clientTin: clientTin,
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
                  } else {
                    //no option
                  }
                } else {
                  if (
                    transaction.transactionType ===
                    "Pindo Bulk Sms Payment(Corporate)"
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
                              <a class="product-title d-block" style={{ color: "white" }} href="#">
                                {transaction.description}
                              </a>

                              <p class="sale-price" style={{ color: "white" }}>
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
                                    {parseFloat(transaction.amount) * 2.5}|
                                  </b>
                                </span>
                                <Link
                                  to="/ddin-receipt"
                                  style={{ color: "#f8882b" }}
                                  state={{
                                    transactionData: transaction,
                                    agentUsername: context.agentUsername,
                                    recipientNumber: recipientNumber,
                                    messageCounter: messageCounter,
                                    totalReceiptAmount: totalSmsCost,
                                    clientName: senderId,
                                    clientPhone: clientPhone,
                                    clientEmail: clientEmail,
                                    clientTin: clientTin,
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
                  } else if (
                    transaction.transactionType ===
                    "FDI Bulk Sms Payment(Corporate)"
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
                              <a class="product-title d-block" href="#">
                                {transaction.description}
                              </a>

                              <p class="sale-price">
                                <i class="fa-solid"></i>
                                {transaction.processDate.substring(0, 20)}
                                <span></span>
                              </p>

                              <div class="product-rating">
                                <i class="fa-solid fa-star"></i>TX:
                                {transaction.id}
                                <span class="ms-1" style={{ color: "red" }}>
                                  <b>
                                    Amount Rwf:
                                    {(
                                      parseFloat(transaction.amount) +
                                      parseFloat(transaction.amount) * 3.57
                                    ).toFixed()}
                                    |
                                  </b>
                                </span>
                                <Link
                                  to="/ddin-bulksms-receipt"
                                  state={{
                                    transactionData: transaction,
                                    agentUsername: context.agentUsername,
                                    recipientNumber: recipientNumber,
                                    messageCounter: messageCounter,
                                    totalReceiptAmount: totalSmsCost,
                                    clientName: senderId,
                                    clientPhone: clientPhone,
                                    clientEmail: clientEmail,
                                    clientTin: clientTin,
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
                  } else {
                    //no option
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
