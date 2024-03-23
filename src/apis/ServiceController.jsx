import React, { useContext } from "react";
import axios from "axios";
import { Buffer } from "buffer";
//Local PROD APIs:
//BULK SMS URL
const base_remote_pindo_pay_prod = "http://localhost:8000/api/v1/payment-service/pindo-bulksms/payment";

//AIRTIME URL
const base_remote_efashe_airtime_validation_prod="http://localhost:8000/api/v1/payment-service/airtime/validate-vend";
const base_remote_efashe_executeAirTimeTx_prod="http://localhost:8000/api/v1/payment-service/airtime/payment";

//ELECTRICITY URL
const base_remote_efashe_electricity_validation_prod="http://localhost:8000/api/v1/payment-service/electricity/validate-vend"
const base_remote_efashe_executeElectricityTx_prod="http://localhost:8000/api/v1/payment-service/electricity/payment";

const payPindoBulkSMS = async (requestPayLoad, userKey) => {
 
    const serverResponse = {
      responseCode: "",
      responseDescription: "",
      responseStatus: "",
      transactionId: 0,
      pindoSmsId: 0,
    };
    await axios
        .post(base_remote_pindo_pay_prod, requestPayLoad, {
        headers: {
          Authorization: `Basic ${userKey}`,
        },
        withCredentials: false,
      })
  
      .then((response) => {
        if (response.data.responseCode === 200) {           
          serverResponse.responseDescription = response.data.responseDescription;
          serverResponse.responseStatus = response.data.data.transactionId;
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


  //==============efashe airTime validation======

const validateEfasheAirTimeVendingTx = async (requestPayLoad) => {
    const serverResponse = {
      responseCode: "",
      responseDescription: "",
      responseStatus: "",
      data: "",
    };
   const data={
    customerAccountNumber: requestPayLoad.phoneNumber
   }
  
    await axios
      .post(base_remote_efashe_airtime_validation_prod, data, {
        headers: {
            'Content-Type': 'application/json'
        }
      })
  
      .then((response) => {
        
        if (response.data.responseCode === 200) {
          serverResponse.responseDescription = response.data.responseDescription;
          serverResponse.responseStatus = response.data.communicationStatus;
          serverResponse.responseCode = response.data.responseCode;
          serverResponse.data = response.data.data;
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
//==============efashe airTime Payment======
  const executeEfasheAirTimeVendingTx = async (requestPayLoad, userKey) => {
    const serverResponse = {
      responseCode: "",
      responseDescription: "",
      responseStatus: "",
      data: "",
    };
    const data={
        trxId:requestPayLoad.transactionId,
        toMemberId: requestPayLoad.toMemberId,
        amount: requestPayLoad.amount,
        transferTypeId: requestPayLoad.transferTypeId,
        phoneNumber:requestPayLoad.phoneNumber,
        accountId:requestPayLoad.accountId,
        agentCategory:requestPayLoad.agentCategory,
        district:requestPayLoad.district,
        province:requestPayLoad.province,
        sector:requestPayLoad.sector,
        currencySymbol: requestPayLoad.currencySymbol,
        description: requestPayLoad.description
    }
   
    await axios
      .post( base_remote_efashe_executeAirTimeTx_prod, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${userKey}`,
        },
        withCredentials: false,
      })
  
      .then((response) => {
        if (response.data.responseCode === 200) {
            
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

//==============efashe Electricity validation======

const validateEfasheElectricityVending= async (requestPayLoad) => {
    const serverResponse = {
      responseCode: "",
      responseDescription: "",
      responseStatus: "",
      data: "",
    };
   const data={
    customerAccountNumber: requestPayLoad.phoneNumber
   }
  
    await axios
      .post(base_remote_efashe_electricity_validation_prod, data, {
        headers: {
            'Content-Type': 'application/json'
        }
      })
  
      .then((response) => {
        
        if (response.data.responseCode === 200) {
          serverResponse.responseDescription = response.data.responseDescription;
          serverResponse.responseStatus = response.data.communicationStatus;
          serverResponse.responseCode = response.data.responseCode;
          serverResponse.data = response.data.data;
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

//==============efashe Electricity Payment======
const executeEfasheElectricityVending= async (requestPayLoad, userKey) => {
    const serverResponse = {
      responseCode: "",
      responseDescription: "",
      responseStatus: "",
      data: "",
    };
    const data={
      trxId:requestPayLoad.transactionId,
      toMemberId: requestPayLoad.toMemberId,
      amount: requestPayLoad.amount,
      transferTypeId: requestPayLoad.transferTypeId,
      phoneNumber:requestPayLoad.phoneNumber,
      accountId:requestPayLoad.accountId,
      agentCategory:requestPayLoad.agentCategory,
      district:requestPayLoad.district,
      province:requestPayLoad.province,
      sector:requestPayLoad.sector,
      currencySymbol: requestPayLoad.currencySymbol,
      description: requestPayLoad.description
  }
  
    await axios
      .post( base_remote_efashe_executeElectricityTx_prod, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${userKey}`,
        },
        withCredentials: false,
      })
  
      .then((response) => {
        console.log("res from electricity data:",response)
        if (response.data.responseCode === 200) {
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
        console.log("error from ele:",err)
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


  export {
    payPindoBulkSMS,
    validateEfasheAirTimeVendingTx,
    executeEfasheAirTimeVendingTx,
    validateEfasheElectricityVending,
    executeEfasheElectricityVending
}