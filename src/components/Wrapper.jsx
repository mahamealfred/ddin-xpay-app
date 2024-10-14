/**
 * *@gniyonge
 * App Context Management Controller

 */

import React, {useState} from 'react';
export const Context = React.createContext();




const Wrapper = (props) => {

    const [userData, setUserData] = useState(null);
    const [loggedInStatus, setLoggedInStatus] = useState(false);

    const [district, setDistrict] = useState();
    const [province, setProvince] = useState();
    const [phone, setPhone] = useState();
    const [sector, setSector] = useState();
    const [userKey, setUserKey] = useState();
    const [userId, setUserId] = useState();
    const [userCategory, setUserCategory] = useState();
    const [agentFullName, setAgentFullName] = useState();
    const [agentUsername, setAgentUsername] = useState();
    const [transactionList,  setTransactionList] = useState();
    const [agentCategory, setAgentCategory] = useState();
	const [agentFloatAccountId, setAgentFloatAccountId] = useState();
	const [agentInstantCommissionAccountId, setAgentInstantCommissionAccountId] = useState();
    const [agentDelayedCommissionAccountId, setAgentDelayedCommissionAccountId] = useState();



    return (
        <Context.Provider value = {{
            loggedInStatus:loggedInStatus,
            district:district,
            province:province,
            sector:sector,
            userId:userId,
            phone:phone,
            agentFloatAccountId:agentFloatAccountId,
            agentInstantCommissionAccountId:agentInstantCommissionAccountId,
            agentDelayedCommissionAccountId:agentDelayedCommissionAccountId,
            agentCategory:agentCategory,
            userKey:userKey,
            agentFullName:agentFullName,
            agentUsername:agentUsername,
            userData:{userData},
            transactionData:{transactionList},
            updateAgentFloatAccountId:(accountId)=>{
                setAgentFloatAccountId(accountId);
            }, 
            updateAgentInstantCommissionAccountId:(accountId)=>{
                setAgentInstantCommissionAccountId(accountId);
            }, 
            updateAgentDelayedCommissionAccountId:(accountId)=>{
                setAgentDelayedCommissionAccountId(accountId);
            },
            updateUserId:(userIdData)=>{
                setUserId(userIdData);
            },
            updateAgentCategory:(acategory)=>{
                setAgentCategory(acategory);
            },
            updateTransaction:(tdata)=>{
                setTransactionList(tdata);
            },
            updateUser:(newUser)=>{
                setUserData(newUser);
            },
            updateLoginStatus:(data)=>{
                setLoggedInStatus(data);
            },
            updateDistrict:(data)=>{
                setDistrict(data);
            },
            updateProvince:(data)=>{
                setProvince(data);
            },
            updateSector:(data)=>{
                setSector(data);
            },
            updateUserKey:(data)=>{
                setUserKey(data);
            },
            updateAgentFullName:(data)=>{
                setAgentFullName(data);
            },
            updateAgentUsername:(data)=>{
                setAgentUsername(data);
            },
            updatePhone:(data)=>{
                setPhone(data);
            }
            
        }}>
            {
                
                /*<IntlProvider messages={messages} locale={locale}>*/}
                {props.children}
            {/*</IntlProvider>*/}
        </Context.Provider>

    );
}


export default Wrapper;