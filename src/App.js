import { BrowserRouter as Router, Routes, Link, Route, useNavigate } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import LoginPage from "./components/user/LoginPage";
import PindoServicePage from "./components/bulksms/PindoServicePage";
import NpoServicePage from "./components/npo/NpoServicePage";
//import YellowCardServicePage from './components/Yel0lowCardServicePage';
import ReceiptManager from "./components/receipt/ReceiptManager";
import AirtimeReceiptManager from "./components/receipt/AirtimeReceiptManager";
import ElectricityReceiptManager from "./components/receipt/ElectricityReceiptManager";
import RraReceiptManager from "./components/receipt/RraReceiptManager";
import RegisterServicePage from "./components/user/RegisterServicePage";
import FdiReceiptManager from "./components/receipt/FdiReceiptManager";
import NpoReceiptManager from "./components/receipt/NpoReceiptManager";
import StartimesReceiptManager from "./components/receipt/StartimesReceiptManager";
import AgentFloatAccountPage from "./components/accounts/AgentFloatAccountPage";
import AgentCommissionAccountPage from "./components/accounts/AgentCommissionAccountPage";
import AirtimeServicePage from "./components/airtime/AirtimeServicePage";
import StartimesServicePage from "./components/startimes/StartimesServicePage";
import BulkAirtimePage from "./components/bulkairtime/BulkAirtimeServicePage";
import ElectricityServicePage from "./components/electricity/ElectricityServicePage";

import ChangePasswordPage from "./components/settings/ChangePasswordPage";
import RraServicePage from "./components/rra/RraServicePage";

import AirtimeReceipt from "./components/receiptpage/AirtimeReceipt";
import BulkAirtimeReceiptManager from "./components/receipt/BulkAirtimeReceiptManager";
import { useIdleTimer } from "react-idle-timer";
import { useContext } from "react";
import { Context } from "./components/Wrapper";
import ProtectedRoute from "./ProtectedRoute";
function App() {

  const context = useContext(Context);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterServicePage />} />

          {/* Protected Routes */}
          <Route
           path="/dashboard"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
          <Route path="/bulksms-service" element={<ProtectedRoute><PindoServicePage /></ProtectedRoute>}></Route>
          <Route path="/npo-service" element={ <ProtectedRoute><NpoServicePage /></ProtectedRoute>}></Route>
          <Route path="/rra-service" element={ <ProtectedRoute><RraServicePage /></ProtectedRoute>}></Route>
          <Route path="/buy-airtime" element={<ProtectedRoute><AirtimeServicePage /></ProtectedRoute>}></Route>
          <Route path="/bulk-airtime" element={<ProtectedRoute><BulkAirtimePage /></ProtectedRoute>}></Route>
        
          
          <Route
            path="/ddin-bulksms-receipt"
            element={<ProtectedRoute><FdiReceiptManager /></ProtectedRoute>}
          ></Route>
          <Route path="/ddin-receipt" element={<ProtectedRoute><ReceiptManager /></ProtectedRoute>}></Route>
          <Route
            path="/ddin-electricity-receipt"
            element={<ProtectedRoute><ElectricityReceiptManager /></ProtectedRoute>}
          ></Route>
          <Route
            path="/ddin-rra-receipt"
            element={<ProtectedRoute><RraReceiptManager /></ProtectedRoute>}
          ></Route>
          <Route
            path="/ddin-npo-receipt"
            element={<ProtectedRoute><NpoReceiptManager /></ProtectedRoute>}
          ></Route>
          <Route
            path="/ddin-startimes-receipt"
            element={<ProtectedRoute><StartimesReceiptManager /></ProtectedRoute>}
          ></Route>
          <Route
            path="/ddin-airtime-receipt"
            element={<ProtectedRoute><AirtimeReceiptManager /></ProtectedRoute>}
          ></Route>
 <Route
            path="/ddin-bulk-airtime-receipt"
            element={<ProtectedRoute><BulkAirtimeReceiptManager /></ProtectedRoute>}
          ></Route>
          <Route
            path="/startimes-subscription"
            element={<ProtectedRoute><StartimesServicePage /></ProtectedRoute>}
          ></Route>
          <Route
            path="/electricity-token"
            element={<ProtectedRoute><ElectricityServicePage /></ProtectedRoute>}
          ></Route>
          <Route
            path="/airtime-receipt"
            element={<ProtectedRoute><AirtimeReceipt /></ProtectedRoute>}
          ></Route>
          <Route
            path="/agent-float-account"
            element={
              <ProtectedRoute>
                <AgentFloatAccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent-commission-account"
            element={
              <ProtectedRoute>
                <AgentCommissionAccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
