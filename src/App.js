import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import LoginPage from "./components/user/LoginPage";
import PindoServicePage from "./components/bulksms/PindoServicePage";
import NpoServicePage from "./components/npo/NpoServicePage";
//import YellowCardServicePage from './components/Yel0lowCardServicePage';
import ReceiptManager from "./components/receipt/ReceiptManager";
import AirtimeReceiptManager from "./components/receipt/AirtimeReceiptManager";
import ElectricityReceiptManager from "./components/receipt/ElectricityReceiptManager";
import RraReceiptManager from "./components/receipt/RraReceiptManager";
import NotifyMe from "./components/notifications/NotifyMe";
import MqttClient from "./components/notifications/MqttClient";
import FdiReceiptManager from "./components/receipt/FdiReceiptManager";
import NpoReceiptManager from "./components/receipt/NpoReceiptManager";
import StartimesReceiptManager from "./components/receipt/StartimesReceiptManager";
import AgentFloatAccountPage from "./components/accounts/AgentFloatAccountPage";
import AgentCommissionAccountPage from "./components/accounts/AgentCommissionAccountPage";
import AirtimeServicePage from "./components/airtime/AirtimeServicePage";
import StartimesServicePage from "./components/startimes/StartimesServicePage";
import ElectricityServicePage from "./components/electricity/ElectricityServicePage";

import RraServicePage from "./components/rra/RraServicePage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Open Access - Public Access Required HomePage NotifyMe MqttClient*/}
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/sign-in" element={<LoginPage />}></Route>
          <Route path="/bulksms-service" element={<PindoServicePage />}></Route>
          <Route path="/npo-service" element={<NpoServicePage />}></Route>
          <Route path="/rra-service" element={<RraServicePage />}></Route>
          <Route
            path="/agent-float-account"
            element={<AgentFloatAccountPage />}
          ></Route>
          <Route
            path="/agent-commission-account"
            element={<AgentCommissionAccountPage />}
          ></Route>
          <Route path="/buy-airtime" element={<AirtimeServicePage />}></Route>

          <Route
            path="/ddin-bulksms-receipt"
            element={<FdiReceiptManager />}
          ></Route>
          <Route path="/ddin-receipt" element={<ReceiptManager />}></Route>
          <Route
            path="/ddin-electricity-receipt"
            element={<ElectricityReceiptManager />}
          ></Route>
          <Route
            path="/ddin-rra-receipt"
            element={<RraReceiptManager />}
          ></Route>
          <Route
            path="/ddin-npo-receipt"
            element={<NpoReceiptManager />}
          ></Route>
          <Route
            path="/ddin-startimes-receipt"
            element={<StartimesReceiptManager />}
          ></Route>
          <Route
            path="/ddin-airtime-receipt"
            element={<AirtimeReceiptManager />}
          ></Route>

          <Route
            path="/startimes-subscription"
            element={<StartimesServicePage />}
          ></Route>
          <Route
            path="/electricity-token"
            element={<ElectricityServicePage />}
          ></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
