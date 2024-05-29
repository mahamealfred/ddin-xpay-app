import React, { useContext } from "react";
import axios from "axios";
import { Buffer } from "buffer";
//Local PROD APIs:

//LOGIN URL
const base_remote_login_prod = "https://app.ddin.rw/api/v1/authentication/login";


//BULK SMS URL
const base_remote_pindo_pay_prod = "https://app.ddin.rw/api/v1/payment-service/pindo-bulksms/payment";

//AIRTIME URL
const base_remote_efashe_airtime_validation_prod="https://app.ddin.rw/api/v1/payment-service/airtime/validate-vend";
const base_remote_efashe_executeAirTimeTx_prod="https://app.ddin.rw/api/v1/payment-service/airtime/payment";

//ELECTRICITY URL
const base_remote_efashe_electricity_validation_prod="https://app.ddin.rw/api/v1/payment-service/electricity/validate-vend"
const base_remote_efashe_executeElectricityTx_prod="https://app.ddin.rw/api/v1/payment-service/electricity/payment";

//RRA
const base_remote_efashe_rra_validation_prod="https://app.ddin.rw/api/v1/payment-service/rra/validate-vend";
const base_remote_efashe_executeRRATx_prod="https://app.ddin.rw/api/v1/payment-service/rra/payment";

//Startime

const base_remote_efashe_startime_validation_prod="https://app.ddin.rw/api/v1/payment-service/startime/validate-vend";
const base_remote_efashe_executeStartimeTx_prod="https://app.ddin.rw/api/v1/payment-service/startime/payment";
//transactions
const base_remote_account_transaction_byid_prod="https://app.ddin.rw/api/v1/transactions/tansaction-byId";
const base_remote_account_transactions_prod="https://app.ddin.rw/api/v1/transactions/logs";
const base_remote_account_transactions_status_prod="https://app.ddin.rw/api/v1/payment-service//check-efashe-transaction/status?trxId=";
//login Auth 

const agentLoginAuth = async (requestPayload) => {
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
  await axios
    .get(base_remote_login_prod, {
      headers: {
        Authorization: `Basic ${base64data}`,
      },
      withCredentials: true,
    })

    .then((response) => {
      if (response.data.responseCode === 200) {
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
     
    if (err.response.status == 400) {
      
      serverResponse.responseDescription = err.response.data.responseDescription;
      serverResponse.responseStatus = err.response.data.communicationStatus;
      serverResponse.responseCode = err.response.data.responseCode;
    }
    else if(err.response.status == 401){
      serverResponse.responseDescription = err.response.data.responseDescription;
      serverResponse.responseStatus = err.response.data.communicationStatus;
      serverResponse.responseCode = err.response.data.responseCode;
    }
    else{
      serverResponse.responseDescription = err.response.data.error;
      serverResponse.responseStatus = err.response.data.communicationStatus;
      serverResponse.responseCode = err.response.data.responseCode;
    } 
  
    });

  return serverResponse;
};



//Pindo Bulk sms payament
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
       
        if (err.response.status == 400) {
          serverResponse.responseDescription = err.response.data.responseDescription;
          serverResponse.responseStatus = err.response.data.communicationStatus;
          serverResponse.responseCode = err.response.data.responseCode;
        }
        else if(err.response.status == 401){
          serverResponse.responseDescription = err.response.data.responseDescription;
          serverResponse.responseStatus = err.response.data.communicationStatus;
          serverResponse.responseCode = err.response.data.responseCode;
        }
        else{
          serverResponse.responseDescription = err.response.data.error;
          serverResponse.responseStatus = err.response.data.communicationStatus;
          serverResponse.responseCode = err.response.data.responseCode;
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
          "Dear customer we are unable to process your request now. Try again later.";
        serverResponse.responseStatus =
          "Dear customer we are unable to process your request now. Try again later.";
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
        if (err.response.status == 400) {
          serverResponse.responseDescription = err.response.data.responseDescription;
          serverResponse.responseStatus = err.response.data.communicationStatus;
          serverResponse.responseCode = err.response.data.responseCode;
        }
        else if(err.response.status == 401){
          serverResponse.responseDescription = err.response.data.responseDescription;
          serverResponse.responseStatus = err.response.data.communicationStatus;
          serverResponse.responseCode = err.response.data.responseCode;
        }
        else{
          serverResponse.responseDescription = err.response.data.error;
          serverResponse.responseStatus = err.response.data.communicationStatus;
          serverResponse.responseCode = err.response.data.responseCode;
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
        if (err.response.status == 400) {
          serverResponse.responseDescription = err.response.data.responseDescription;
          serverResponse.responseStatus = err.response.data.communicationStatus;
          serverResponse.responseCode = err.response.data.responseCode;
        }
        else if(err.response.status == 401){
          serverResponse.responseDescription = err.response.data.responseDescription;
          serverResponse.responseStatus = err.response.data.communicationStatus;
          serverResponse.responseCode = err.response.data.responseCode;
        }
        else{
          serverResponse.responseDescription = err.response.data.error;
          serverResponse.responseStatus = err.response.data.communicationStatus;
          serverResponse.responseCode = err.response.data.responseCode;
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
        if (err.response.status == 400) {
          serverResponse.responseDescription = err.response.data.responseDescription;
          serverResponse.responseStatus = err.response.data.communicationStatus;
          serverResponse.responseCode = err.response.data.responseCode;
        }
        else if(err.response.status == 401){
          serverResponse.responseDescription = err.response.data.responseDescription;
          serverResponse.responseStatus = err.response.data.communicationStatus;
          serverResponse.responseCode = err.response.data.responseCode;
        }
        else{
          serverResponse.responseDescription = err.response.data.error;
          serverResponse.responseStatus = err.response.data.communicationStatus;
          serverResponse.responseCode = err.response.data.responseCode;
        } 
      });
  
    return serverResponse;
  };


  //==============efashe RRA validation======

const validateEfasheRRAVending= async (requestPayLoad) => {
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
    .post(base_remote_efashe_rra_validation_prod, data, {
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
   
      if (err.response.status == 400) {
        serverResponse.responseDescription = err.response.data.responseDescription;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      }
      else if(err.response.status == 401){
        serverResponse.responseDescription = err.response.data.responseDescription;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      }
      else{
        serverResponse.responseDescription = err.response.data.error;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      } 
    });

  return serverResponse;
};


//==============efashe RRA Payment======
const executeEfasheRRAVending= async (requestPayLoad, userKey) => {
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
    .post( base_remote_efashe_executeRRATx_prod, data, {
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
      if (err.response.status == 400) {
        serverResponse.responseDescription = err.response.data.responseDescription;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      }
      else if(err.response.status == 401){
        serverResponse.responseDescription = err.response.data.responseDescription;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      }
      else{
        serverResponse.responseDescription = err.response.data.error;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      } 
    });

  return serverResponse;
};

//Startime

const validateEfasheStartimeVending= async (requestPayLoad) => {
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
    .post(base_remote_efashe_startime_validation_prod, data, {
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
   
      if (err.response.status == 400) {
        serverResponse.responseDescription = err.response.data.responseDescription;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      }
      else if(err.response.status == 401){
        serverResponse.responseDescription = err.response.data.responseDescription;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      }
      else{
        serverResponse.responseDescription = err.response.data.error;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      } 
    });

  return serverResponse;
};


//==============efashe RRA Payment======
const executeEfasheStartimeVending= async (requestPayLoad, userKey) => {
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
    .post( base_remote_efashe_executeStartimeTx_prod, data, {
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
      if (err.response.status == 400) {
        serverResponse.responseDescription = err.response.data.responseDescription;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      }
      else if(err.response.status == 401){
        serverResponse.responseDescription = err.response.data.responseDescription;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      }
      else{
        serverResponse.responseDescription = err.response.data.error;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      } 
    });

  return serverResponse;
};


const viewAgentAccountTransactionsById = async (
  userKey,
  transId
) => {

  const URL_WITH_PARAMS =
  base_remote_account_transaction_byid_prod+"/"+transId 
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
      if (response.data.responseCode === 200) {
        serverResponse.responseDescription = response.data.responseDescription;
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
      if (err.response.status == 400) {
        serverResponse.responseDescription = err.response.data.responseDescription;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      }
      else if(err.response.status == 401){
        serverResponse.responseDescription = err.response.data.responseDescription;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      }
      else{
        serverResponse.responseDescription = err.response.data.error;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      } 
    });

  return serverResponse;
};
const viewAgentAccountTransactions = async (
  userKey
) => {

  const URL_WITH_PARAMS =base_remote_account_transactions_prod 
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
      if (response.data.responseCode === 200) {
        serverResponse.responseDescription = response.data.responseDescription;
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
      if (err.response.status == 400) {
        serverResponse.responseDescription = err.response.data.responseDescription;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      }
      else if(err.response.status == 401){
        serverResponse.responseDescription = err.response.data.responseDescription;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      }
      else{
        serverResponse.responseDescription = err.response.data.error;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      } 
    });

  return serverResponse;
};

const viewTransactionStatusById = async (
  trxId
) => {

  const URL_WITH_PARAMS =base_remote_account_transactions_status_prod+trxId
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data: [],
  };

  await axios
    .get(URL_WITH_PARAMS, {
      headers: {
        // Authorization: `Basic ${userKey}`,
      },
      withCredentials: true,
    })

    .then((response) => {
      if (response.data.responseCode === 200) {
        serverResponse.responseDescription = response.data.responseDescription;
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
      if (err.response.status == 400) {
        serverResponse.responseDescription = err.response.data.responseDescription;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      }
      else if(err.response.status == 401){
        serverResponse.responseDescription = err.response.data.responseDescription;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      }
      else{
        serverResponse.responseDescription = err.response.data.error;
        serverResponse.responseStatus = err.response.data.communicationStatus;
        serverResponse.responseCode = err.response.data.responseCode;
      } 
    });

  return serverResponse;
};

  export {
    payPindoBulkSMS,
    validateEfasheAirTimeVendingTx,
    executeEfasheAirTimeVendingTx,
    validateEfasheElectricityVending,
    executeEfasheElectricityVending,
    agentLoginAuth,
    validateEfasheRRAVending,
    executeEfasheRRAVending,
    viewAgentAccountTransactionsById,
    viewAgentAccountTransactions,
    validateEfasheStartimeVending,
    executeEfasheStartimeVending,
    viewTransactionStatusById
}