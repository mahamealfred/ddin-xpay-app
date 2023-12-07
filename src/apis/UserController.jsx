/**
 * *@gniyonge
 * DDIN Core backend APIs Integration Controller

 */

import React, { useContext } from "react";
import axios from "axios";
import { Buffer } from "buffer";

//Local Test APIs:

const base_localhost_login_test =
  "http://localhost:8345/users/api/v1/agent/auth";

const base_localhost_account_transaction_test =
  "http://localhost:8345/pindo/api/v1/agent/account/transactions?";
const base_localhost_account_transaction_byid_test =
  "http://localhost:8345/pindo/api/v1/agent/account/transactions/";

const base_localhost_account_npo_registrations =
  "http://localhost:8345/pindo/api/npo/registrations";

const base_localhost_account_status_test =
  "http://localhost:8345/pindo/api/v1/agent/account?";

const base_localhost_pindo_pay_test =
  "http://localhost:8345/pindo/api/v1/paybulksms";

const base_localhost_pindo_pay_test_v2 =
  "http://localhost:8345/pindo/api/v2/paybulksms";

const base_local_fdi_pay_test_v3 =
  "http://localhost:8345/pindo/api/v1/fdi/paybulksms";

const base_local_fdi_pay_test_v4 =
  "http://localhost:8345/pindo/api/v2/fdi/paybulksms";

const base_localhost_register_npoclient_test =
  "http://localhost:8345/pindo/api/v2/npo/clients";

const base_localhost_npo_addresses_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/npo/postal-codes/addresses";

const base_localhost_efashe_validtx_test =
  "http://localhost:8345/pindo/api/v1/efashe/pay-airtime";

const base_localhost_efashe_executeTx =
  "http://localhost:8345/pindo/api/v1/efashe/execute-airtime";
const base_localhost_change_password =
  "https://test.ddin.rw/usermanager/api/v1/users/password?";
const base_localhost_efashe_validRraTx =
  "http://localhost:8345/rra/api/v1/efashe/pay-rra";
const base_localhost_efashe_validElectricityTx =
  "http://localhost:8345/pindo/api/v1/efashe/pay-electricity";
const base_localhost_efashe_executeElectricityTx =
  "http://localhost:8345/pindo/api/v1/efashe/execute-electricity";

const base_localhost_efashe_executeRraTx =
  "http://localhost:8345/rra/api/v1/efashe/execute-rra";

const base_localhost_efashe_validStartimesTx =
  "http://localhost:8345/pindo/api/v1/efashe/pay-startimes";
const base_localhost_efashe_executeStartimesTx =
  "http://localhost:8345/pindo/api/v1/efashe/execute-startimes";

const base_localhost_efashe_TxLookup =
  "http://localhost:8345/pindo/api/v1/efashe/transactions/status?txId=";

//Remote  Test APIs:base_remote_pindo_pay_prod

const base_remote_login_test =
  "https://test.ddin.rw/ddincoreapis/users/api/v1/agent/auth";

const base_remote_account_transaction_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v1/agent/account/transactions?";

const base_remote_account_transaction_byid_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v1/agent/account/transactions/";

const base_remote_account_npo_registrations_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/npo/registrations";
const base_remote_npo_addresses_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/npo/postal-codes/addresses";
const base_remote_account_status_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v1/agent/account?";

const base_remote_pindo_pay_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v1/paybulksms";

const base_remote_pindo_pay_test_v2 =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v2/paybulksms";

const base_remote_fdi_pay_test_v3 =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v1/fdi/paybulksms";

const base_remote_fdi_pay_test_v4 =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v2/fdi/paybulksms";

const base_remote_register_npoclient_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v2/npo/clients";

const base_remote_efashe_validtx_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v1/efashe/pay-airtime";

const base_remote_efashe_executeTx_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v1/efashe/execute-airtime";
const base_remote_change_password_test =
  "https://test.ddin.rw/usermanager/api/v1/users/password?";
const base_remote_efashe_validRraTx_test =
  "https://test.ddin.rw/ddincoreapis/rra/api/v1/efashe/pay-rra";
const base_remote_efashe_validElectricityTx_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v1/efashe/pay-electricity";
const base_remote_efashe_executeElectricityTx_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v1/efashe/execute-electricity";
const base_remote_efashe_executeRraTx_test =
  "https://test.ddin.rw/ddincoreapis/rra/api/v1/efashe/execute-rra";

const base_remote_efashe_validStartimesTx_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v1/efashe/pay-startimes";
const base_remote_efashe_executeStartimesTx_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v1/efashe/execute-startimes";

const base_remote_efashe_TxLookup_test =
  "https://test.ddin.rw/ddincoreapis/pindo/api/v1/efashe/transactions/status?txId=";

// Remote  Prod APIs:
const base_remote_login_prod =
  "https://core.ddin.rw/ddincoreapisprod/users/api/v1/agent/auth";

const base_remote_change_password_prod =
  "https://test.ddin.rw/usermanager/api/v1/users/password?";

const base_remote_account_transaction_prod =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v1/agent/account/transactions?";

const base_remote_account_transaction_byid_prod =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v1/agent/account/transactions/";
const base_remote_npo_addresses_prod =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/npo/postal-codes/addresses";
const base_remote_account_npo_registrations_prod =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/npo/registrations";

const base_remote_account_status_prod =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v1/agent/account?";

const base_remote_pindo_pay_prod =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v1/paybulksms";

const base_remote_pindo_pay_prod_v2 =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v2/paybulksms";

const base_remote_register_npoclient_prod =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v2/npo/clients";

const base_remote_fdi_pay_prod_v3 =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v1/fdi/paybulksms";
const base_remote_fdi_pay_prod_v4 =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v2/fdi/paybulksms";

const base_remote_efashe_validtx_prod =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v1/efashe/pay-airtime";
const base_remote_efashe_executeTx_prod =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v1/efashe/execute-airtime";

const base_remote_efashe_validRraTx_prod =
  "https://core.ddin.rw/ddincoreapisprod/rra/api/v1/efashe/pay-rra";
const base_remote_efashe_validElectricityTx_prod =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v1/efashe/pay-electricity";
const base_remote_efashe_executeElectricityTx_prod =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v1/efashe/execute-electricity";
const base_remote_efashe_executeRraTx_prod =
  "https://core.ddin.rw/ddincoreapisprod/rra/api/v1/efashe/execute-rra";

const base_remote_efashe_validStartimesTx_prod =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v1/efashe/pay-startimes";
const base_remote_efashe_executeStartimesTx_prod =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v1/efashe/execute-startimes";

const base_remote_efashe_TxLookup_prod =
  "https://core.ddin.rw/ddincoreapisprod/pindo/api/v1/efashe/transactions/status?txId=";

//================================End of API Listing======

const loginAgent = async (requestPayload) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    userId: "",
    username: "",
    email: "",
    image: "",
    country: "",
    nationalId: "",
    birthday: "",
    gender: "",
    city: "",
    province: "",
    district: "",
    sector: "",
    phone: "",
    passKey: "",
    agentCategory: "",
    name: "",
    floatAccountId: "",
    instantCommissionAccountId: "",
    delayedCommissionAccountId: "",
  };

  const usernamePasswordBuffer = Buffer.from(
    requestPayload.username + ":" + requestPayload.password
  );
  const base64data = usernamePasswordBuffer.toString("base64");

  //base_remote_login_test
  //base_remote_login_prod
  //base_localhost_login_test

  await axios
    .get(base_remote_login_test, {
      headers: {
        Authorization: `Basic ${base64data}`,
      },
      withCredentials: true,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;

        serverResponse.userId = response.data?.data?.id;
        serverResponse.username = response.data?.data?.username;
        serverResponse.email = response.data?.data?.email;
        serverResponse.image = response.data?.data?.image;
        serverResponse.country = response.data?.data?.country;
        serverResponse.nationalId = response.data?.data?.nationalId;
        serverResponse.birthday = response.data?.data?.birthday;
        serverResponse.gender = response.data?.data?.gender;
        serverResponse.city = response.data?.data?.city;
        serverResponse.province = response.data?.data?.province;
        serverResponse.district = response.data?.data?.district;
        serverResponse.sector = response.data?.data?.sector;
        serverResponse.phone = response.data?.data?.phone;
        serverResponse.name = response.data?.data?.name;
        serverResponse.agentCategory = response.data?.data?.agentCategory;
        serverResponse.floatAccountId =
          response.data?.data?.agentFloatAccountId;
        serverResponse.instantCommissionAccountId =
          response.data?.data?.agentInstantCommissionAccountId;
        serverResponse.delayedCommissionAccountId =
          response.data?.data?.agentDelayedCommissionAccountId;
      } else {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "AGENT ACCESS PROCESSING ERROR -" + err;
      serverResponse.communicationStatus =
        "AGENT ACCESS PROCESSING FAILURE -" + err;
      serverResponse.responseCode = "601";

      if (!err.response) {
        //  console.log('No Server Response');
      } else if (err.response.status === 400) {
        //console.log('Missing Username or Password');
      } else if (err.response.status === 401) {
        // console.log('Unauthorized');
      } else {
        //console.log('Login Failed');
      }
      //errRef.current.focus();
    });

  return serverResponse;
};

//viewNPO Addresses:
const viewNpoAddresses = async (userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    responseDate: "",
    data: "",
  };
  //base_localhost_npo_addresses_test
  //base_remote_npo_addresses_test
  //base_remote_npo_addresses_prod
  await axios
    .get(base_remote_npo_addresses_test, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: true,
    })
    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.responseDate = response.data.responseDate;
        serverResponse.data = response.data.data;
      } else {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.responseDate = response.data.responseDate;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "AGENT TRANSACTION ACCESS PROCESSING ERROR -" + err;
      serverResponse.communicationStatus =
        "AGENT TRANSACTION ACCESS PROCESSING ERROR -" + err;
      serverResponse.responseCode = "601";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
      //errRef.current.focus();
    });

  return serverResponse;
};

//======look up TX Status======
const viewAgentFloatAccountStatus = async (userKey, accountId) => {
  //base_remote_account_status_test
  //base_remote_account_status_prod
  const URL_WITH_PARAMS =
    base_remote_account_status_test + "accountId=" + accountId;
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    responseDate: "",
    balance: "",
    formattedBalance: "",
    availableBalance: "",
    formattedAvailableBalance: "",
    reservedAmount: "",
    formattedReservedAmount: "",
    creditLimit: "",
    formattedCreditLimit: "",
  };
  //
  await axios
    .get(URL_WITH_PARAMS, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: true,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.responseDate = response.data.responseDate;

        serverResponse.balance = response.data.data.balance;
        serverResponse.formattedBalance = response.data.data.formattedBalance;
        serverResponse.availableBalance = response.data.data.availableBalance;
        serverResponse.formattedAvailableBalance =
          response.data.data.formattedAvailableBalance;
        serverResponse.reservedAmount = response.data.data.reservedAmount;
        serverResponse.formattedReservedAmount =
          response.data.data.formattedReservedAmount;
        serverResponse.creditLimit = response.data.data.creditLimit;
        serverResponse.formattedCreditLimit =
          response.data.data.formattedCreditLimit;
      } else {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.responseDate = response.data.responseDate;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "AGENT TRANSACTION ACCESS PROCESSING ERROR -" + err;
      serverResponse.communicationStatus =
        "AGENT TRANSACTION ACCESS PROCESSING ERROR -" + err;
      serverResponse.responseCode = "601";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
      //errRef.current.focus();
    });

  return serverResponse;
};
//======look up Efashe  TX Status======
const viewEfasheTxStatus = async (userKey, accountId, serviceCode) => {
  //base_remote_efashe_TxLookup_test
  //base_remote_efashe_TxLookup_prod
  //base_localhost_efashe_TxLookup

  const URL_WITH_PARAMS =
    base_remote_efashe_TxLookup_test +
    "" +
    accountId +
    "&serviceCode=" +
    serviceCode;

  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    responseDate: "",
    data: {},
  };
  //
  await axios
    .get(URL_WITH_PARAMS, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: true,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.responseDate = response.data.responseDate;
        serverResponse.data = response.data.data;
      } else {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.responseDate = response.data.responseDate;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "AGENT TRANSACTION ACCESS PROCESSING ERROR -" + err;
      serverResponse.communicationStatus =
        "AGENT TRANSACTION ACCESS PROCESSING ERROR -" + err;
      serverResponse.responseCode = "601";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
      //errRef.current.focus();
    });

  return serverResponse;
};

const viewNpoRegistrations = async (userKey, accountId) => {
  //base_localhost_account_npo_registrations
  //base_remote_account_npo_registrations_test
  //base_remote_account_npo_registrations_prod
  const URL_WITH_PARAMS = base_remote_account_npo_registrations_test;

  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data: [],
    metadata: [],
  };

  await axios
    .get(URL_WITH_PARAMS, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: true,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.data = response.data.data;
        serverResponse.metadata = response.data.metadata;
      } else {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "AGENT TRANSACTION ACCESS PROCESSING ERROR -" + err;
      serverResponse.communicationStatus =
        "AGENT TRANSACTION ACCESS PROCESSING FAILURE -" + err;
      serverResponse.responseCode = "601";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};

const viewAgentFloatAccountTransactionsById = async (
  userKey,
  accountId,
  transId
) => {
  //base_remote_account_transaction_byid_test
  //base_remote_account_transaction_byid_prod
  //base_localhost_account_transaction_byid_test
  const URL_WITH_PARAMS =
    base_remote_account_transaction_byid_test +
    "" +
    transId +
    "?" +
    "accountId=" +
    accountId;
  //
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data: [],
  };

  await axios
    .get(URL_WITH_PARAMS, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: true,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.data = response.data.data;
      } else {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "AGENT TRANSACTION ACCESS PROCESSING ERROR -" + err;
      serverResponse.communicationStatus =
        "AGENT TRANSACTION ACCESS PROCESSING FAILURE -" + err;
      serverResponse.responseCode = "601";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};
const viewAgentFloatAccountTransactions = async (userKey, accountId) => {
  //base_remote_account_transaction_test
  //base_remote_account_transaction_prod
  //base_localhost_account_transaction_test
  const URL_WITH_PARAMS =
    base_remote_account_transaction_test + "accountId=" + accountId;
  //
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data: [],
  };

  await axios
    .get(URL_WITH_PARAMS, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: true,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.data = response.data.data;
      } else {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "AGENT TRANSACTION ACCESS PROCESSING ERROR -" + err;
      serverResponse.communicationStatus =
        "AGENT TRANSACTION ACCESS PROCESSING FAILURE -" + err;
      serverResponse.responseCode = "601";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};

const payPindo = async (requestPayLoad, userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    responseStatus: "",
    transactionId: "",
    pindoSmsId: "",
  };
  // base_remote_pindo_pay_test
  //base_remote_pindo_pay_prod
  //base_localhost_pindo_pay_test
  await axios
    .post(base_remote_pindo_pay_test, requestPayLoad, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: false,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.transactionId = response.data.data.transactionId;
        serverResponse.pindoSmsId = response.data.data.pindoSmsId;
      } else {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseStatus =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseCode = "501";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};
//===================================================
const changePassword = async (username, oldPassword, newPassword, userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    responseStatus: "",
    transactionId: "",
    pindoSmsId: "",
  };
  // base_remote_pindo_pay_test
  //base_remote_pindo_pay_prod
  //base_localhost_pindo_pay_test
  const URL_WITH_PARAMS =
    base_remote_change_password_test +
    "username=" +
    username +
    "&oldPassword=" +
    oldPassword +
    "&newPassword=" +
    newPassword;

  console.log("yes");
  await axios
    .put(
      URL_WITH_PARAMS,
      {},
      {
        headers: {
          Authorization: `Basic ${userKey}`,
        },
        withCredentials: false,
      }
    )

    .then((response) => {
      if (response.data === "SUCCESS") {
        serverResponse.responseDescription = response.data;
        serverResponse.responseStatus = response.data;
        serverResponse.responseCode = "200";
      } else {
        serverResponse.responseDescription = response.data;
        serverResponse.responseStatus = response.data;
        serverResponse.responseCode = "400";
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseStatus =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseCode = "501";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};
//=================================================

const payFdi = async (requestPayLoad, userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    responseStatus: "",
    transactionId: "",
    pindoSmsId: "",
    data: "",
  };

  //base_local_fdi_pay_test_v3
  //base_remote_fdi_pay_test_v3
  //base_remote_fdi_pay_prod_v3

  await axios
    .post(base_remote_fdi_pay_test_v3, requestPayLoad, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: false,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.transactionId = response.data.data.transactionId;
        serverResponse.pindoSmsId = response.data.data.pindoSmsId;
      } else {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseStatus =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseCode = "501";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};

//==============efashe tx validation======

const validateEfasheVendingTx = async (requestPayLoad, userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    responseStatus: "",
    data: "",
  };
  //base_localhost_efashe_validtx_test
  //base_remote_efashe_validtx_test
  //base_remote_efashe_validtx_prod

  await axios
    .post(base_remote_efashe_validtx_test, requestPayLoad, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: false,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.data = response.data.data;
        //serverResponse.pindoSmsId=response.data.data.pindoSmsId;
      } else {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseStatus =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseCode = "501";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};

//========Electricity TX Validator==
const validateEfasheRraVendingTx = async (requestPayLoad, userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    responseStatus: "",
    data: "",
  };
  //base_localhost_efashe_validRraTx
  //base_remote_efashe_validRraTx_test
  //base_remote_efashe_validRraTx_prod
  await axios
    .post(base_remote_efashe_validRraTx_test, requestPayLoad, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: false,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.data = response.data.data;
        //serverResponse.pindoSmsId=response.data.data.pindoSmsId;
      } else {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseStatus =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseCode = "501";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};
//========Electricity TX Validator==
const validateEfasheElectricityVendingTx = async (requestPayLoad, userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    responseStatus: "",
    data: "",
  };
  //base_localhost_efashe_validElectricityTx
  //base_remote_efashe_validElectricityTx_test
  //base_remote_efashe_validElectricityTx_prod
  await axios
    .post(base_remote_efashe_validElectricityTx_test, requestPayLoad, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: false,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.data = response.data.data;
        //serverResponse.pindoSmsId=response.data.data.pindoSmsId;
      } else {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseStatus =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseCode = "501";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};

//=======Startimes Tx Validator===================================
const validateEfasheStartimesVendingTx = async (requestPayLoad, userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    responseStatus: "",
    data: "",
  };
  //base_localhost_efashe_validStartimesTx
  //base_remote_efashe_validStartimesTx_test
  //base_remote_efashe_validStartimesTx_prod
  await axios
    .post(base_remote_efashe_validStartimesTx_test, requestPayLoad, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: false,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.data = response.data.data;
        //serverResponse.pindoSmsId=response.data.data.pindoSmsId;
      } else {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseStatus =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseCode = "501";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};
//==============efashe tx Execution======

const executeEfasheVendingTx = async (requestPayLoad, userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    responseStatus: "",
    data: "",
  };
  //base_localhost_efashe_executeTx
  //base_remote_efashe_executeTx_test
  //base_remote_efashe_executeTx_prod
  await axios
    .post(base_remote_efashe_executeTx_test, requestPayLoad, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: false,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.data = response.data.data;
        //serverResponse.pindoSmsId=response.data.data.pindoSmsId;
      } else {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseStatus =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseCode = "501";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};

//==============efashe Electricity tx Execution======

const executeEfasheRraVendingTx = async (requestPayLoad, userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    responseStatus: "",
    data: "",
  };

  //base_localhost_efashe_executeRraTx
  //base_remote_efashe_executeRraTx_test
  //base_remote_efashe_executeRraTx_prod
  await axios
    .post(base_remote_efashe_executeRraTx_test, requestPayLoad, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: false,
    })

    .then((response) => {
      //console.log("Executer E-Fashe Code:" + response.data.responseCode);
      //console.log("Executer E-Fashe Description:" + response.data.responseDescription);
      //console.log("Executer E-Fashe Status:" + response.data.communicationStatus);

      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.data = response.data.data;
        //serverResponse.pindoSmsId=response.data.data.pindoSmsId;
      } else {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseStatus =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseCode = "501";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};

//==============efashe Electricity tx Execution======

const executeEfasheElectricityVendingTx = async (requestPayLoad, userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    responseStatus: "",
    data: "",
  };
  //base_localhost_efashe_executeElectricityTx
  //base_remote_efashe_executeElectricityTx_test
  //base_remote_efashe_executeElectricityTx_prod
  await axios
    .post(base_remote_efashe_executeElectricityTx_test, requestPayLoad, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: false,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.data = response.data.data;
        //serverResponse.pindoSmsId=response.data.data.pindoSmsId;
      } else {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseStatus =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseCode = "501";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};

//==============efashe Startimes tx Execution======

const executeEfasheStartimesVendingTx = async (requestPayLoad, userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    responseStatus: "",
    data: "",
  };
  //base_localhost_efashe_executeStartimesTx
  //base_remote_efashe_executeStartimesTx_test
  //base_remote_efashe_executeStartimesTx_prod
  await axios
    .post(base_remote_efashe_executeStartimesTx_test, requestPayLoad, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: false,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.data = response.data.data;
        //serverResponse.pindoSmsId=response.data.data.pindoSmsId;
      } else {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseStatus =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseCode = "501";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};
//========pay bulks ms  using pindo sms gateway- by corporate agents====
const payPindov2 = async (requestPayLoad, userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    responseStatus: "",
    transactionId: "",
    pindoSmsId: "",
  };

  //base_remote_pindo_pay_test_v2
  //base_localhost_pindo_pay_test_v2
  //base_remote_pindo_pay_prod_v2
  await axios
    .post(base_remote_pindo_pay_test_v2, requestPayLoad, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: false,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.transactionId = response.data.data.transactionId;
        serverResponse.pindoSmsId = response.data.data.pindoSmsId;
      } else {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseStatus =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseCode = "501";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};

const payFdiv2 = async (requestPayLoad, userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    responseStatus: "",
    transactionId: "",
    pindoSmsId: "",
  };

  //base_local_fdi_pay_test_v4
  //base_remote_fdi_pay_test_v4
  //base_remote_fdi_pay_prod_v4
  await axios
    .post(base_remote_fdi_pay_test_v4, requestPayLoad, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: false,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.transactionId = response.data.data.transactionId;
        serverResponse.pindoSmsId = response.data.data.pindoSmsId;
      } else {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseStatus =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseCode = "501";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};
const registerNpoClient = async (requestPayLoad, userKey) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    responseStatus: "",
    transactionId: "",
    pindoSmsId: "",
  };

  //base_remote_register_npoclient_test
  //base_localhost_register_npoclient_test
  //base_remote_register_npoclient_prod
  await axios
    .post(base_remote_register_npoclient_test, requestPayLoad, {
      headers: {
        Authorization: `Basic ${userKey}`,
      },
      withCredentials: false,
    })

    .then((response) => {
      if (response.data.responseCode === "200") {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.transactionId = response.data.data.transactionId;
        //serverResponse.pindoSmsId=response.data.data.pindoSmsId;
      } else {
        serverResponse.responseDescription = response.data.responseDescription;
        serverResponse.responseStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
      serverResponse.responseDescription =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseStatus =
        "Dear customer we are unable to process your request now. Try again later." +
        err;
      serverResponse.responseCode = "501";

      if (!err.response) {
      } else if (err.response.status === 400) {
      } else if (err.response.status === 401) {
      } else {
      }
    });

  return serverResponse;
};

export default loginAgent;
export {
  payPindo,
  payFdi,
  payFdiv2,
  validateEfasheRraVendingTx,
  executeEfasheVendingTx,
  validateEfasheVendingTx,
  validateEfasheElectricityVendingTx,
  executeEfasheElectricityVendingTx,
  validateEfasheStartimesVendingTx,
  executeEfasheStartimesVendingTx,
  viewEfasheTxStatus,
  viewNpoAddresses,
  payPindov2,
  registerNpoClient,
  viewAgentFloatAccountStatus,
  viewAgentFloatAccountTransactions,
  viewNpoRegistrations,
  executeEfasheRraVendingTx,
  viewAgentFloatAccountTransactionsById,
  changePassword,
};
