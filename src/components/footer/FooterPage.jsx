/**
 * *@gniyonge
 * App Footer Page

 */

import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
import { BrowserRouter as Router, Switch, Link, Route,useLocation,useNavigate } from "react-router-dom";



export default function FooterPage() {

   
return(


    <div class="footer-nav-area" id="footerNav">
    <div class="ddin-footer-nav">
      <ul class="h-100 d-flex align-items-center justify-content-between ps-0 d-flex rtl-flex-d-row-r">
        <li><Link to="/"><i class="fa-solid fa-house"></i>Home</Link></li>
        <li><Link to="#"><i class="fa-solid fa-list"></i>Services</Link></li>
        <li><Link to="#"><i class="fa-solid fa-list"></i>Accounts</Link></li>
        <li><Link to="#"><i class="fa-solid fa-user"></i>Agents</Link></li>
        <li><Link to="#"><i class="fa-solid fa-gear"></i>Settings</Link></li>
       
      </ul>
    </div>
  </div>
)

}