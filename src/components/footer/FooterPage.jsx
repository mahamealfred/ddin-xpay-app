/**
 * *@gniyonge
 * App Footer Page

 */

import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Context } from "../Wrapper";

export default function FooterPage() {
  const context = useContext(Context);
  const [isauthenticated,setIsAuthenticated]=useState("")
  useEffect(() => {
    // Check auth state on component mount (in case of browser back/refresh)
    const authState = sessionStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authState);
  }, []);
  return (
    <div class="footer-nav-area" id="footerNav">
      <div class="ddin-footer-nav">
      
          <ul class="h-100 d-flex align-items-center justify-content-between ps-0 d-flex rtl-flex-d-row-r">
          <li>
            <Link to="/dashboard">
              <i class="fa-solid fa-house"></i>Home
            </Link>
          </li>
          <li>
            <Link to="/dashboard">
              <i class="fa-solid fa-list"></i>Services
            </Link>
          </li>
          <li>
            <Link to="#">
              <i class="fa-solid fa-list"></i>Accounts
            </Link>
          </li>
          <li>
            <Link to="#">
              <i class="fa-solid fa-user"></i>Agents
            </Link>
          </li>
          <li>
            <Link to="/change-password">
              <i class="fa-solid fa-gear"></i>Settings
            </Link>
          </li>
        </ul>
       
      </div>
    </div>
  );
}
