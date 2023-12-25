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
  ButtonBase,
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
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
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
  viewProvinces,
  viewDistricts,
  viewSectors,
  registerNewAgent,
} from "../../apis/UserController";
import dateFormat, { masks } from "dateformat";
import LoginPage from "./LoginPage";
import FooterPage from "../footer/FooterPage";
import OpenHeaderPage from "../header/OpenHeaderPage";
import "react-phone-number-input/style.css";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { format, parseISO } from "date-fns";
function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const steps = [
  {
    label: "General Information",
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: "Contact & Address",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Email Validation",
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
  {
    label: "Accept & Confirm",
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

export default function RegisterServicePage() {
  const [openAddress, setOpenAddress] = useState(false);
  const [openProvince, setOpenProvince] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openSector, setOpenSector] = useState(false);
  const [openClientTypes, setOpenClientTypes] = useState(false);
  const [selectedClientType, setSelectedClientType] = useState({
    status: false,
    name: "Organization",
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
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
  const [provincesData, setProvincesData] = useState(null);
  const [districtsData, setDistrictsData] = useState(null);
  const [sectorsData, setSectorsData] = useState(null);
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

  const [provinceId, setProvinceId] = useState(null);
  const [provinceName, setProvinceName] = useState("");

  const [districtId, setDistrictId] = useState(null);
  const [districtName, setDistrictName] = useState("");

  const [sectorId, setSectorId] = useState(null);
  const [sectorName, setSectorName] = useState("");

  const [postalCodeName, setPostalCodeName] = useState("");
  const [isPersonal, setIsPersonal] = useState(null);

  const [receiptId, setReceiptId] = useState("");
  const [receiptNote, setReceiptNote] = useState("");
  const [serviceFeeAmt, setServiceFeeAmt] = useState("");
  const [totalPayment, setTotalPayment] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [tinNumber, setTinNumber] = useState("");
  const [gender, setGender] = useState("");
  const [agentCategory, setAgentCategory] = useState("");
  const [maritialStatus, setMaritialStatus] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [formattedDob, setFormattedDob] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    tinNumber: "",
    dateOfBirth: new Date(),
    gender: "",
    identityTypes: "",
    agentCategory: "",
    maritalStatus: "",
    identityType: "",
    identityNumber: "",
    country: "",
    city: "",
    phoneNumber: "",
    email: "",
    province: "",
    district: "",
    sector: "",
    emailValidationCode: "",
    username: "",
  });

  const [errors, setErrors] = useState({});
  /*{
"nationalId":"093231123031",
"tinNumber":"324257090",
"country":"Rwanda",
"province":"Kigali City",
"sector":"Kicukiro",
"district":"Gasabo",
"gender":"Male",
"mariotialStatus":"Single",
"birthday":"13/12/2023",
"userlevel":"agent",
"agentCategory":"Agent",
"password":"",
"email":"niyongeregirbert@gmail.com",
"username":"test1098",
"groupid":5,
"name":"Gilbert Niyongere"
}*/

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate each field
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
      isValid = false;
    }

    if (!formData.tinNumber.trim()) {
      newErrors.tinNumber = "TIN Number is required";
      isValid = false;
    }

    if (!formData.gender.trim()) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    if (!formData.agentCategory.trim()) {
      newErrors.agentCategory = "Agent Category is required";
      isValid = false;
    }

    if (!formData.maritalStatus.trim()) {
      newErrors.maritalStatus = "Marital Status is required";
      isValid = false;
    }

    if (!formData.identityType.trim()) {
      newErrors.identityType = "Identity Type is required";
      isValid = false;
    }

    if (!formData.identityNumber.trim()) {
      newErrors.identityNumber = "Identity Number is required";
      isValid = false;
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
      isValid = false;
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }

    if (!value.trim()) {
      //!formData.phoneNumber.trim()
      newErrors.phoneNumber = "Phone Number is required";
      isValid = false;
    } else {
      setFormData({
        ...formData,
        phoneNumber: value,
      });
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (!formData.province.trim()) {
      newErrors.province = "Province is required";
      isValid = false;
    }

    if (!formData.district.trim()) {
      newErrors.district = "District is required";
      isValid = false;
    }

    if (!formData.sector.trim()) {
      newErrors.sector = "Sector is required";
      isValid = false;
    }

    if (!formData.emailValidationCode.trim()) {
      newErrors.emailValidationCode = "Email Validation Code is required";
      isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const clientTypesCode = [
    { status: false, name: "Organization" },
    { status: true, name: "Personal" },
  ];

  const [amount, setAmount] = useState(15000);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const formatDate = (date) => {
    //setDateOfBirth(date);
    // console.log("Converted Date:" + format(date, "dd/MM/yyyy"));
    return format(date, "dd/MM/yyyy");
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  useEffect(() => {
    if (npoAddressData === null) {
      //queryNpoAddresses();
    }
  }, []);

  useEffect(() => {
    if (provincesData === null) {
      queryProvinces();
    }
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (provinceId) {
      // Fetch districts based on selectedProvince and setDistricts
      console.log("Go and Get The District for Province Id:" + provinceId);
      queryDistricts(provinceId);
      // Simulate a delay of 500 milliseconds before making the API call
    }
  }, [provinceId]);

  // Fetch sectors when district changes
  useEffect(() => {
    if (districtId) {
      // Fetch sectors based on selectedDistrict and setSectors
      console.log("Go and Get The Sectors for District Id:" + districtId);
      querySectors(districtId);
    }
  }, [districtId]);

  //Data

  const handleChange = (e) => {
    setPostalCodeId(e.target.value);
  };

  const handleClientTypeChange = (e) => {
    setIsPersonal(e.target.value);
  };

  // Function to convert date string to "yyyy-MM-dd" format
  const toInputFormat = (date) => {
    //setFormattedDob(format(date, "yyyy-MM-dd"));
    return format(date, "yyyy-MM-dd");
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

  //view provinces:

  const queryProvinces = async () => {
    try {
      const response = await viewProvinces(context.userKey);

      if (response.responseCode === "200") {
        setProvincesData(response.data);
      } else {
        //toast.info(response.responseDescription);
      }
    } catch (err) {
      //console.log("View Address Status Error:"+err);
    }
  };

  //view districts:

  const queryDistricts = async (selectedProvinceId) => {
    try {
      const response = await viewDistricts(context.userKey, selectedProvinceId);

      if (response.responseCode === "200") {
        //console.log("YES Caslling District " + response.data.length);
        setDistrictsData(response.data);
      } else {
        //console.log("NO Caslling District ");
        //toast.info(response.responseDescription);
      }
    } catch (err) {
      //console.log("View Address Status Error:"+err);
    }
  };

  //view sectors:

  const querySectors = async (selectedDistrictId) => {
    try {
      const response = await viewSectors(context.userKey, selectedDistrictId);

      if (response.responseCode === "200") {
        // console.log("YES Caslling Sectors " + response.data.length);
        setSectorsData(response.data);
      } else {
        //console.log("NO Caslling District ");
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Form is valid, proceed with submission
      // You can access the form data using 'formData'
      console.log("Form submitted:", formData);
      createNewAgentAccount();
      //Call Register User Function
    } else {
      // Form is not valid, display error messages
      toast.error(
        "Provided data contain errors. Please Click <<Go Back Button>> to check specific error and provide valid data."
      );
      console.log("Form contains errors. Please correct them.");
    }
  };

  const createNewAgentAccount = async () => {
    const id = toast.loading("Processing Agent Registration...");

    try {
      //Test Agent: Transfer Id=95 , Member Id= 24
      //Prod Agent: Transfer Id=95, Member Id=11

      const userRequestBody = {
        nationalId: formData.nationalIdNumber,
        phoneUserId: formData.phoneNumber,
        tinNumber: formData.tinNumber,
        country: formData.country,
        province: formData.province,
        sector: formData.sector,
        district: formData.district,
        gender: formData.gender,
        mariotialStatus: formData.maritalStatus,
        birthday: toInputFormat(formData.dateOfBirth),
        userlevel: "agent",
        agentCategory: formData.agentCategory,
        password: "",
        email: formData.email,
        username: formData.username,
        groupid: 5,
        name: formData.firstName + " " + formData.lastName,
      };

      const response = await registerNewAgent(userRequestBody, context.userKey);

      if (response.responseCode === "200") {
        //setShowConfirmResponseDialog(false);
        playAudio();

        //toast.dismiss();

        toast.update(id, {
          render:
            "You've successfully registered On DDIN Platform. Your Agent Id is:" +
            response.responseStatus +
            " - A passcode has been sent to your registered email for login access details!",
          type: "success",
          isLoading: false,
          closeButton: null,
        });

        //toast.dismiss();
      } else {
        toast.update(id, {
          render: response.responseDescription,
          type: "info",
          isLoading: false,
          closeButton: null,
        });
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
        toMemberId: "11",
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

  return (
    <div>
      <OpenHeaderPage />

      <div class="page-content-wrapper">
        <div class="container">
          <br />
          <div class="section-heading d-flex align-items-center justify-content-between dir-rtl">
            <h6>
              <Link class="btn p-0" to="/">
                <i class="ms-1 fa-solid fa-arrow-left-long"></i> Login
              </Link>
            </h6>
          </div>
          <div class="discount-coupon-card-blue p-4 p-lg-5 dir-rtl">
            <div class="d-flex align-items-center">
              <div class="discountIcon">
                <img
                  class="w-100"
                  src="assets/img/bg-img/user_ico.png"
                  alt=""
                />
              </div>
              <div class="text-content">
                {/*
                  NPO Testing Phase@
                   */}
                <h5 class="text-white mb-1">
                  Open <b>Agent A/C </b>On The Go
                </h5>
                <p class="text-white mb-0">
                  The<span class="px-1 fw-bold"></span>
                  {""}
                  <b>Network Of The Best</b>
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
                        <b>Register Here</b>
                      </span>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <Box sx={{ maxWidth: 400 }}>
                        <Stepper activeStep={activeStep} orientation="vertical">
                          {steps.map((step, index) => (
                            <Step key={step.label}>
                              <StepLabel
                                optional={
                                  index === 4 ? (
                                    <Typography variant="caption">
                                      Last step
                                    </Typography>
                                  ) : null
                                }
                              >
                                {step.label}
                              </StepLabel>
                              <StepContent>
                                <Typography>
                                  {index === 0 ? (
                                    <>
                                      {" "}
                                      <div class="form-group text-start mb-4">
                                        <span
                                          style={{
                                            color: "black",
                                            fontSize: 16,
                                          }}
                                        >
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
                                          onChange={(e) =>
                                            setFormData({
                                              ...formData,
                                              firstName: e.target.value,
                                            })
                                          }
                                          value={formData.firstName}
                                          required
                                        />
                                        {errors.firstName && (
                                          <span style={{ color: "red" }}>
                                            {errors.firstName}
                                          </span>
                                        )}
                                      </div>
                                      <div class="form-group text-start mb-4">
                                        <span
                                          style={{
                                            color: "black",
                                            fontSize: 16,
                                          }}
                                        >
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
                                          onChange={(e) =>
                                            setFormData({
                                              ...formData,
                                              lastName: e.target.value,
                                            })
                                          }
                                          value={formData.lastName}
                                          required
                                        />
                                        {errors.lastName && (
                                          <span style={{ color: "red" }}>
                                            {errors.lastName}
                                          </span>
                                        )}
                                      </div>
                                      <div class="form-group text-start mb-4">
                                        <span
                                          style={{
                                            color: "black",
                                            fontSize: 16,
                                          }}
                                        >
                                          <b>TIN Number:</b>
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
                                          onChange={(e) =>
                                            setFormData({
                                              ...formData,
                                              tinNumber: e.target.value,
                                            })
                                          }
                                          value={formData.tinNumber}
                                        />
                                        {errors.tinNumber && (
                                          <span style={{ color: "red" }}>
                                            {errors.tinNumber}
                                          </span>
                                        )}
                                      </div>
                                      <div class="form-group text-start mb-4">
                                        <span
                                          style={{
                                            color: "black",
                                            fontSize: 16,
                                          }}
                                        >
                                          <b>Date Of Birth:</b>
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
                                          type="date"
                                          onChange={(e) =>
                                            setFormData({
                                              ...formData,
                                              dateOfBirth: parseISO(
                                                e.target.value
                                              ),
                                            })
                                          }
                                          value={toInputFormat(
                                            formData.dateOfBirth
                                          )}
                                        />
                                        {errors.dateOfBirth && (
                                          <span style={{ color: "red" }}>
                                            {errors.dateOfBirth}
                                          </span>
                                        )}
                                      </div>
                                      <div class="form-group text-start mb-4">
                                        <FormControl
                                          required
                                          variant="outlined"
                                        >
                                          <InputLabel
                                            shrink
                                            style={{
                                              color: "black",
                                              fontSize: 18,
                                            }}
                                          >
                                            <b>Gender:</b>
                                            <b style={{ color: "red" }}>*</b>
                                          </InputLabel>
                                          <Select
                                            autofocus
                                            value={formData.gender}
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                gender: e.target.value,
                                              })
                                            }
                                          >
                                            <MenuItem value="Male">
                                              Male
                                            </MenuItem>
                                            <MenuItem value="Female">
                                              Female
                                            </MenuItem>
                                          </Select>
                                          <FormHelperText
                                            style={{
                                              color: "blue",
                                              fontSize: 12,
                                            }}
                                          >
                                            Select Gender
                                          </FormHelperText>
                                        </FormControl>
                                        {errors.gender && (
                                          <span style={{ color: "red" }}>
                                            {errors.gender}
                                          </span>
                                        )}
                                      </div>
                                      <div class="form-group text-start mb-4">
                                        <FormControl
                                          required
                                          variant="outlined"
                                        >
                                          <InputLabel
                                            shrink
                                            style={{
                                              color: "black",
                                              fontSize: 18,
                                            }}
                                          >
                                            <b>Agent Category:</b>
                                            <b style={{ color: "red" }}>*</b>
                                          </InputLabel>
                                          <Select
                                            autofocus
                                            value={formData.agentCategory}
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                agentCategory: e.target.value,
                                              })
                                            }
                                          >
                                            <MenuItem value="Agent">
                                              Agent
                                            </MenuItem>
                                            <MenuItem value="Corporate">
                                              Corporate
                                            </MenuItem>
                                          </Select>
                                          <FormHelperText
                                            style={{
                                              color: "blue",
                                              fontSize: 12,
                                            }}
                                          >
                                            Select Your Agent Category
                                          </FormHelperText>
                                        </FormControl>
                                        {errors.agentCategory && (
                                          <span style={{ color: "red" }}>
                                            {errors.agentCategory}
                                          </span>
                                        )}
                                      </div>
                                      <div class="form-group text-start mb-4">
                                        <FormControl
                                          required
                                          variant="outlined"
                                        >
                                          <InputLabel
                                            shrink
                                            style={{
                                              color: "black",
                                              fontSize: 18,
                                            }}
                                          >
                                            <b>Maritial Status:</b>
                                            <b style={{ color: "red" }}>*</b>
                                          </InputLabel>
                                          <Select
                                            autofocus
                                            value={formData.maritalStatus}
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                maritalStatus: e.target.value,
                                              })
                                            }
                                          >
                                            <MenuItem value="Single">
                                              Single
                                            </MenuItem>
                                            <MenuItem value="Married">
                                              Married
                                            </MenuItem>

                                            <MenuItem value="Divorce">
                                              Divorce
                                            </MenuItem>
                                          </Select>
                                          <FormHelperText
                                            style={{
                                              color: "blue",
                                              fontSize: 12,
                                            }}
                                          >
                                            Select Your Maritial Status
                                          </FormHelperText>
                                        </FormControl>

                                        {errors.maritalStatus && (
                                          <span style={{ color: "red" }}>
                                            {errors.maritalStatus}
                                          </span>
                                        )}
                                      </div>
                                      <div class="form-group text-start mb-4">
                                        <FormControl
                                          required
                                          variant="outlined"
                                        >
                                          <InputLabel
                                            shrink
                                            style={{
                                              color: "black",
                                              fontSize: 18,
                                            }}
                                          >
                                            <b>Identity Type:</b>
                                            <b style={{ color: "red" }}>*</b>
                                          </InputLabel>
                                          <Select
                                            autofocus
                                            value={formData.identityType}
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                identityType: e.target.value,
                                              })
                                            }
                                          >
                                            <MenuItem value="1">
                                              National Id
                                            </MenuItem>
                                            <MenuItem value="2">
                                              Passport
                                            </MenuItem>
                                          </Select>
                                          <FormHelperText
                                            style={{
                                              color: "blue",
                                              fontSize: 12,
                                            }}
                                          >
                                            Select Identity Type
                                          </FormHelperText>
                                        </FormControl>
                                        {errors.identityType && (
                                          <span style={{ color: "red" }}>
                                            {errors.identityType}
                                          </span>
                                        )}
                                      </div>
                                      <div class="form-group text-start mb-4">
                                        <span
                                          style={{
                                            color: "black",
                                            fontSize: 16,
                                          }}
                                        >
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
                                          onChange={(e) =>
                                            setFormData({
                                              ...formData,
                                              identityNumber: e.target.value,
                                            })
                                          }
                                          value={formData.identityNumber}
                                          required
                                        />
                                        {errors.identityNumber && (
                                          <span style={{ color: "red" }}>
                                            {errors.identityNumber}
                                          </span>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      {index === 1 ? (
                                        <>
                                          <div class="form-group text-start mb-4">
                                            <FormControl
                                              required
                                              variant="outlined"
                                            >
                                              <InputLabel
                                                shrink
                                                style={{
                                                  color: "black",
                                                  fontSize: 18,
                                                }}
                                              >
                                                <b>Country:</b>
                                                <b style={{ color: "red" }}>
                                                  *
                                                </b>
                                              </InputLabel>
                                              <Select
                                                autofocus
                                                value={formData.country}
                                                onChange={(e) =>
                                                  setFormData({
                                                    ...formData,
                                                    country: e.target.value,
                                                  })
                                                }
                                              >
                                                <MenuItem value="Rwanda">
                                                  Rwanda
                                                </MenuItem>
                                              </Select>
                                              <FormHelperText
                                                style={{
                                                  color: "blue",
                                                  fontSize: 12,
                                                }}
                                              >
                                                Select Your Country
                                              </FormHelperText>
                                            </FormControl>
                                            {errors.country && (
                                              <span style={{ color: "red" }}>
                                                {errors.country}
                                              </span>
                                            )}
                                          </div>
                                          <div class="form-group text-start mb-4">
                                            <span
                                              style={{
                                                color: "black",
                                                fontSize: 16,
                                              }}
                                            >
                                              <b>City:</b>
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
                                                setFormData({
                                                  ...formData,
                                                  city: e.target.value,
                                                })
                                              }
                                              value={formData.city}
                                              required
                                            />

                                            {errors.city && (
                                              <span style={{ color: "red" }}>
                                                {errors.city}
                                              </span>
                                            )}
                                          </div>
                                          <div class="form-group text-start mb-4">
                                            <span
                                              style={{
                                                color: "black",
                                                fontSize: 16,
                                              }}
                                            >
                                              <b>Phone Number:</b>
                                              <b style={{ color: "red" }}>*</b>
                                            </span>

                                            <div>
                                              <PhoneInput
                                                international
                                                countryCallingCodeEditable={
                                                  false
                                                }
                                                defaultCountry="RW"
                                                value={value}
                                                onChange={setValue}
                                              />
                                            </div>
                                            {errors.phoneNumber && (
                                              <span style={{ color: "red" }}>
                                                {errors.phoneNumber}
                                              </span>
                                            )}
                                          </div>
                                          <div class="form-group text-start mb-4">
                                            <span
                                              style={{
                                                color: "black",
                                                fontSize: 16,
                                              }}
                                            >
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
                                              onChange={(e) =>
                                                setFormData({
                                                  ...formData,
                                                  email: e.target.value,
                                                })
                                              }
                                              value={formData.email}
                                              placeholder="example@gmail.com"
                                              required
                                            />
                                            {errors.email && (
                                              <span style={{ color: "red" }}>
                                                {errors.email}
                                              </span>
                                            )}
                                          </div>
                                          <div class="form-group text-start mb-4">
                                            <Autocomplete
                                              id="disable-close-on-select"
                                              sx={{ width: 300 }}
                                              open={openProvince}
                                              onOpen={() => {
                                                setOpenProvince(true);
                                              }}
                                              onClose={() => {
                                                setOpenProvince(false);
                                              }}
                                              getOptionLabel={(option) =>
                                                option.province_name
                                              }
                                              options={provincesData}
                                              value={
                                                provinceId
                                                  ? provincesData.find(
                                                      (option) =>
                                                        option.id === provinceId
                                                    ) || null
                                                  : null
                                              }
                                              onChange={(event, newValue) => {
                                                //console.log("Postal Code:" + newValue?.postal_code);
                                                setProvinceId(
                                                  newValue?.id || null
                                                );
                                                setFormData({
                                                  ...formData,
                                                  province:
                                                    newValue?.province_name ||
                                                    null,
                                                });
                                                setProvinceName(
                                                  newValue?.province_name ||
                                                    null
                                                );
                                                //postal_code_id
                                              }}
                                              renderInput={(params) => (
                                                <TextField
                                                  style={{
                                                    color: "red",
                                                    fontSize: 25,
                                                  }}
                                                  variant="standard"
                                                  {...params}
                                                  label="Select Province"
                                                  InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                      <React.Fragment>
                                                        {/* Add loading indicator if needed */}
                                                        {
                                                          params.InputProps
                                                            .endAdornment
                                                        }
                                                      </React.Fragment>
                                                    ),
                                                  }}
                                                />
                                              )}
                                            />
                                            {errors.province && (
                                              <span style={{ color: "red" }}>
                                                {errors.province}
                                              </span>
                                            )}
                                          </div>
                                          <div class="form-group text-start mb-4">
                                            {districtsData &&
                                              districtsData.length > 0 && (
                                                <Autocomplete
                                                  id="disable-close-on-select"
                                                  sx={{ width: 300 }}
                                                  open={openDistrict}
                                                  onOpen={() => {
                                                    setOpenDistrict(true);
                                                  }}
                                                  onClose={() => {
                                                    setOpenDistrict(false);
                                                  }}
                                                  getOptionLabel={(option) =>
                                                    option.district_name
                                                  }
                                                  options={districtsData}
                                                  value={
                                                    districtId
                                                      ? districtsData.find(
                                                          (option) =>
                                                            option.id ===
                                                            districtId
                                                        ) || null
                                                      : null
                                                  }
                                                  onChange={(
                                                    event,
                                                    newValue
                                                  ) => {
                                                    //console.log("Postal Code:" + newValue?.postal_code);
                                                    setDistrictId(
                                                      newValue?.id || null
                                                    );
                                                    setFormData({
                                                      ...formData,
                                                      district:
                                                        newValue?.district_name ||
                                                        null,
                                                    });
                                                    setDistrictName(
                                                      newValue?.district_name ||
                                                        null
                                                    );
                                                    //postal_code_id
                                                  }}
                                                  renderInput={(params) => (
                                                    <TextField
                                                      style={{
                                                        color: "red",
                                                        fontSize: 25,
                                                      }}
                                                      variant="standard"
                                                      {...params}
                                                      label="Select District"
                                                      InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                          <React.Fragment>
                                                            {/* Add loading indicator if needed */}
                                                            {
                                                              params.InputProps
                                                                .endAdornment
                                                            }
                                                          </React.Fragment>
                                                        ),
                                                      }}
                                                    />
                                                  )}
                                                />
                                              )}

                                            {errors.district && (
                                              <span style={{ color: "red" }}>
                                                {errors.district}
                                              </span>
                                            )}
                                          </div>
                                          <div class="form-group text-start mb-4">
                                            {sectorsData &&
                                              sectorsData.length > 0 && (
                                                <Autocomplete
                                                  id="disable-close-on-select"
                                                  sx={{ width: 300 }}
                                                  open={openSector}
                                                  onOpen={() => {
                                                    setOpenSector(true);
                                                  }}
                                                  onClose={() => {
                                                    setOpenSector(false);
                                                  }}
                                                  getOptionLabel={(option) =>
                                                    option.sector_name
                                                  }
                                                  options={sectorsData}
                                                  value={
                                                    sectorId
                                                      ? sectorsData.find(
                                                          (option) =>
                                                            option.id ===
                                                            sectorId
                                                        ) || null
                                                      : null
                                                  }
                                                  onChange={(
                                                    event,
                                                    newValue
                                                  ) => {
                                                    //console.log("Postal Code:" + newValue?.postal_code);
                                                    setSectorId(
                                                      newValue?.id || null
                                                    );
                                                    setFormData({
                                                      ...formData,
                                                      sector:
                                                        newValue?.sector_name ||
                                                        null,
                                                    });
                                                    setSectorName(
                                                      newValue?.sector_name ||
                                                        null
                                                    );
                                                    //postal_code_id
                                                  }}
                                                  renderInput={(params) => (
                                                    <TextField
                                                      style={{
                                                        color: "red",
                                                        fontSize: 25,
                                                      }}
                                                      variant="standard"
                                                      {...params}
                                                      label="Select Sector"
                                                      InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                          <React.Fragment>
                                                            {/* Add loading indicator if needed */}
                                                            {
                                                              params.InputProps
                                                                .endAdornment
                                                            }
                                                          </React.Fragment>
                                                        ),
                                                      }}
                                                    />
                                                  )}
                                                />
                                              )}

                                            {errors.sector && (
                                              <span style={{ color: "red" }}>
                                                {errors.sector}
                                              </span>
                                            )}
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          {index === 2 ? (
                                            <>
                                              {" "}
                                              <div class="form-group text-start mb-4">
                                                <span
                                                  style={{
                                                    color: "black",
                                                    fontSize: 16,
                                                  }}
                                                >
                                                  <b>Email Validation Code:</b>
                                                  <b style={{ color: "red" }}>
                                                    *
                                                  </b>
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
                                                  onChange={(e) =>
                                                    setFormData({
                                                      ...formData,
                                                      emailValidationCode:
                                                        e.target.value,
                                                    })
                                                  }
                                                  value={
                                                    formData.emailValidationCode
                                                  }
                                                  required
                                                />

                                                {errors.emailValidationCode && (
                                                  <span
                                                    style={{ color: "red" }}
                                                  >
                                                    {errors.emailValidationCode}
                                                  </span>
                                                )}
                                              </div>
                                              <div class="form-group text-start mb-4">
                                                <span
                                                  style={{
                                                    color: "black",
                                                    fontSize: 16,
                                                  }}
                                                >
                                                  <b>Username:</b>
                                                  <b style={{ color: "red" }}>
                                                    *
                                                  </b>
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
                                                  onChange={(e) =>
                                                    setFormData({
                                                      ...formData,
                                                      username: e.target.value,
                                                    })
                                                  }
                                                  value={formData.username}
                                                  required
                                                />
                                                {errors.username && (
                                                  <span
                                                    style={{ color: "red" }}
                                                  >
                                                    {errors.username}
                                                  </span>
                                                )}
                                              </div>
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                  <div>
                                    {index === steps.length - 1 ? (
                                      <>
                                        <Button
                                          type="submit"
                                          variant="contained"
                                          sx={{ mt: 1, mr: 1 }}
                                        >
                                          Register
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <Button
                                          variant="contained"
                                          onClick={handleNext}
                                          sx={{ mt: 1, mr: 1 }}
                                        >
                                          Continue
                                        </Button>
                                      </>
                                    )}

                                    <Button
                                      disabled={index === 0}
                                      onClick={handleBack}
                                      sx={{ mt: 1, mr: 1 }}
                                    >
                                      Back
                                    </Button>
                                  </div>
                                </Box>
                              </StepContent>
                            </Step>
                          ))}
                        </Stepper>
                        {activeStep === steps.length && (
                          <Paper square elevation={0} sx={{ p: 3 }}>
                            <Typography>
                              <span style={{ color: "green" }}>
                                You've successfully registered.Your DDIN Agent
                                ID is <b>50</b>. A passcode has been sent to
                                your email. Please Check your registered email
                                to proceed with access details.
                              </span>
                            </Typography>
                            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                              Login
                            </Button>
                          </Paper>
                        )}
                      </Box>

                      {/*<button class="btn btn-warning btn-lg w-100">
                        Register
                        </button>*/}
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

        <div class="weekly-best-seller-area py-3"></div>
      </div>

      <div class="internet-connection-status" id="internetStatus"></div>

      <FooterPage />
    </div>
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
