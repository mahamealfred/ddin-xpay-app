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
import PreviewPaymentReceiptDialog from "./ConfirmBulkAirtimePaymentResponse";
import PreviewPindoServicePayment from "./ConfirmPindoServicePayment";
import ConfirmBulkSsmFileServicePayment from "./ConfirmBulkAirtimeFileServicePayment";
import NotificationSound from "../../images/audio/notificationsound.wav";
import { read, utils, writeFile } from "xlsx";
import TextareaAutosize from "react-textarea-autosize";
import $ from "jquery";
import SmsCounter from "sms-counter";
import Form from "react-bootstrap/Form";
import validator from "validator";
import axios from "axios"
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
import { executeEfasheAirTimeVendingTx, executeEfasheBulkAirTimeVendingTx, payPindoBulkSMS, viewAgentAccountTransactions, viewAgentAccountTransactionsById, viewBulkAirTimeTransactionsByAgentName } from "../../apis/ServiceController";

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
  const [isLoading,setIsLoading]=useState(false)
  const [efasheServiceAmount, setEfasheServiceAmount] = useState("");
  const [trxId, setTrxId] = useState("");
  const [value, setValue] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [detailsArray, setDetailsArray] = useState([]);
  let totalAmount=0
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
            if (rows[i]?.amount && rows[i]?.number) {
              if (valueNumber.length === 12) {
                if (isNumber(valueNumber)) {
                  totalAmount+=rows[i]?.amount
                  let datas={
                    "amount":`${(rows[i]?.amount).toString()}`,
                    "number":`${(rows[i]?.number).toString()}`
                  }
                  //arr_obj.push((rows[i]?.number).toString());
                  arr_obj.push(datas);
                  setBusinessTin(totalAmount)
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
                          " with Amount:" +
                          rows[i].amount +
                          ". Please refer to header <<amount, number>>. Example: Andrea Fisher, 250781234567"
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
                        " with Amount:" +
                        rows[i].amount +
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
                      rows[i].amount +
                      ". Please refer to header <<amount, number>>. Example: Andrea Fisher, 250781234567"
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
                    rows[i].amount +
                    ". Please refer to header <<amount, number>>. Example: Andrea Fisher, 250781234567"
                );
                setShowConfirmBulkFileDialog(true);
                break;
              }
            } else {
              setValidFileLevel(false);
              setValidFileLevelMessage(
                "Please The uploaded recipient file does not have valid column names <<amount>> & <<number>>"
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



// Function to generate UUID for each phone number
const generateUUIDs = async (users, amount) => {
  const url = 'https://app.ddin.rw/api/v1/payment-service/airtime/validate-vend'; // Replace with your actual API endpoint
  
  if (isLoading) return; // Prevent multiple clicks
  setIsLoading(true);
  
  const requests = users.map(phone => {
    return axios.post(url, {
      customerAccountNumber: phone.number
    })
    .then(response => {
      const detail = {
        phoneNumber: phone.number.toString(),
        amount: phone.amount,
        trxId: response.data.data.trxId,
        description: "Airtime payment processed successfully with TX Id: " + response.data.data.trxId + ", Phone Number: " + phone.number
      };
      return detail;
    })
    .catch(error => {
      console.error(`Error for phone number ${phone.number}:`, error);
      return null; // Return null or handle error as needed
    });
  });

  // Wait for all requests to complete
  const results = await Promise.all(requests);
  const filteredResults = results.filter(result => result !== null);
  setDetailsArray(filteredResults);
  // Perform action after all requests are finished
  console.log('All requests finished');
  console.log('Details Array::', filteredResults, filteredResults.length * amount); 
  setShowConfirmDialog(true);
  setIsLoading(false);
};

// Call the function

  const confirmPindoPayment = async (e) => {
    e.preventDefault();
    viewConfirmDialog();
  };
  const viewConfirmDialog = () => {
    generateUUIDs(users, businessTin);
    
  };


  const queryAgentAccountTransactions = async () => {
    try {
    

      const response = await viewBulkAirTimeTransactionsByAgentName(context.agentUsername);

      if (response.responseCode === 200) {
        setAgentAccountTransactions(response.data);
      } else {
        //toast.info(response.responseDescription);
      }
    } catch (err) {
      //console.log("Agent Account Status Error:"+err);
    }
  };

  
  //EFSAHE TX EXECUTOR
  const executeEfasheVendingTxRequest = async (detailsArray) => {
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
        amount: detailsArray.length * businessTin,
        description:detailsArray,
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
      };
  

      const response = await executeEfasheBulkAirTimeVendingTx(
        efasheTxValidatorRequestBody,
        context.userKey
      );
      if (response.responseCode === 200) {
        playAudio();
           //Alfred
        setValue("");
        setEfasheServiceAmount("");
         setBusinessTin("")
        // setReceiptId(response.data.transactionId);
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
  // Execute BULK AIRTIME:
  const makeBulkAirtimePayment = async () => {
    executeEfasheVendingTxRequest(detailsArray);
  };

  
  const queryAgentAccountTransactionsById = async (transId) => {
    setShowReceiptDialog(false);
    const id = toast.loading("Previewing Bulk Sms Receipt...");
    try {
   
      const response = await viewBulkAirTimeTransactionsByAgentName(context.agentUsername);

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
   //======== Service core members Id=====
   const returnMemberId = () => {
    if (context.agentCategory === null || context.agentCategory === "Agent") {
      //Test Env:
      // setMemberId("34");
      //  return "34";
      //Prod Env:
      setMemberId("18");
      return "18";
    } else {
      //Test Env
      // setMemberId("34");
      // return "34";
      //Prod Env
      setMemberId("18");
      return "18";
    }
  };
  //============Service Core Transfers Id===================
  const returnTransferId = () => {
    if (context.agentCategory === null || context.agentCategory === "Agent") {
      //Test Env:
      // setTransferId("54");
      // return "54";
      //Prod Env:
      setTransferId("66");
      return "66";
    } else {
      //Test Env
      // setTransferId("83");
      // return "83";
      //Prod Env
      setTransferId("67");
      return "67";
    }
  };
  const sendPaymentRequest = async () => {
    setShowConfirmDialog(false);

    if (context.agentCategory === null || context.agentCategory === "Agent") {
      //makeFdiPmt();
      //makePindoPmt();
      makeBulkAirtimePayment();
    } else {
      //makePindoPmtWithNoCommision();
      //makeFdiPmt();
      makeBulkAirtimePayment();
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
  const sortedTransactions = agentAccountTransactions?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
console.log("odata:",sortedTransactions)
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
                <h4 class="text-white mb-1">DDIN Bulk Airtime Portal</h4>
                {/* <p class="text-white mb-0">
                  1 SMS<span class="px-1 fw-bold"></span>at Rwf 15
                </p> */}
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
                        <b>Send Airtime</b>
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
                          Upload “.xlsx" file with column header “
                          number" and "amount". Example: 250781234567 , 300
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
                             
                          
                            </span>
                          
                         
                            
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
                            

                           
                          
                          </div>

                         

                          <div class="form-group text-start mb-4">
                            <span style={{ color: "black", fontSize: 16 }}>
                              <b>Total Amount:</b>
                              <b style={{ color: "red" }}>*</b>
                            </span>

                            <input
                              class="form-control"
                              required
                              readOnly
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

                          <button disabled={isLoading} class="btn btn-warning btn-lg w-100">
                            {!isLoading?"Send  Airtime":"Processing ..."}
                          </button>
                        </>
                      ) : (
                        <></>
                      )}

                      <ToastContainer className="toast-position" />
                      <PreviewPindoServicePayment
                        totalReceipients={recipientNumber}
                        openstatus={showConfirmDialog}
                        amount={businessTin}
                        smsmount={smsAmount}
                        agentname={agentName}
                        receiptMessageCounter={messageCounter}
                        receiptMessageRemainderCounter={messageRemainderCounter}
                        receiptMessageLength={messageLength}
                        receiptMessageCharacterLimit={messageCharacterLimit}
                        receiptSmsCost={totalSmsCost}
                        detailsArray={detailsArray}
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
                                {/* <th scope="col">Names</th> */}
                                <th scope="col">Phone numbers</th>
                                <th scope="col">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users?.length > 0 ? (
                                users.map((user, index) => {
                                  return (
                                    <tr key={index}>
                                      <th scope="row">{index + 1}</th>
                                     
                                      <td>{user?.number}</td>
                                       <td>{user?.amount}</td>
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

        <div className="weekly-best-seller-area py-3">
      <div className="container">
        <div className="section-heading d-flex align-items-center justify-content-between dir-rtl">
          <h6>Agents Transactions</h6>
          <Link className="btn p-0 text-white" onClick={viewFloatAccountInfo}>
            View All Transactions<i className="ms-1 fa-solid fa-arrow-right-long"></i>
          </Link>
        </div>
        <div className="row g-2">
          {sortedTransactions?.map((transaction) => (
            <div className="col-12" key={transaction.id}>
              <div className="horizontal-product-card">
                <div className="d-flex align-items-center">
                  <div className="product-thumbnail-side">
                    <a className="product-thumbnail shadow-sm d-block" href="#">
                      <i className="fa-solid fa-list"></i>
                      <img src="assets/img/core-img/icon-ddn-72-w.png" alt="" />
                    </a>
                  </div>
                  <div className="product-description">
                    <a className="wishlist-btn" href="#">
                      <img src="assets/img/core-img/ticker.png" alt="" />
                    </a>
                    <a className="product-title d-block" style={{ color: "white" }} href="#">
                      {transaction.description.map(desc => desc.status === "failed" ? `Error: ${desc.error}` : `Transaction Id: ${desc.data?.transactionId}`).join(", ")}
                    </a>
                    <p className="sale-price" style={{ color: "white" }}>
                      <i className="fa-solid"></i>
                      {new Date(transaction.createdAt).toLocaleString()}
                      <span></span>
                    </p>
                    <div className="product-rating">
                      <i className="fa-solid fa-star"></i>TX:
                      {transaction.id}
                      <span className="ms-1" style={{ color: "white" }}>
                        <b>
                          Total Amount: {transaction.amount} Rwf
                        </b>
                        <Link
                                  to="/ddin-bulk-airtime-receipt"
                                  style={{ color: "#f8882b" }}
                                  state={{
                                    transactionData: transaction,
                                    agentUsername: context.agentUsername,
                                  }}
                                >
                                   Preview Receipt
                                </Link>
                      </span>
                      
                      
                    </div>
                    <div className="product-details" style={{ color: "white" }}>
                      <p>Success Count: {transaction.successCount} , Failure Count: {transaction.failureCount}</p>
                      
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>
          ))}
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
