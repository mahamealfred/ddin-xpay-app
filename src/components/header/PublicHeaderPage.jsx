/**
 * *@gniyonge
 * App Public Header Page

 */

import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
import { BrowserRouter as Router, Switch, Link, Route,useLocation,useNavigate } from "react-router-dom";
import {Context} from "../Wrapper";
import {viewAgentFloatAccountStatus} from '../../apis/UserController';


export default function HeaderPage() {

    const context = useContext(Context);

return(
    <div>
<div class="header-area" id="headerArea">
      <div class="container h-100 d-flex align-items-center justify-content-between d-flex rtl-flex-d-row-r">
       
        <div class="logo-wrapper"><a href="#">
          {/* <img src="assets/img/icons/fav-icon-ddn.PNG" alt="DDIN"/> */}
          <b style={{color:'#f8882b',fontSize:30}}>X</b><b style={{color:'#202a4e',fontSize:30}}>-Pay</b></a></div>
        <div class="navbar-logo-container d-flex align-items-center">
         
       
          {/* <div class="user-profile-icon ms-2"><a href="#"><img src="assets/img/core-img/icon-ddin-d-sm.PNG" alt=""/></a></div> */}
          
          {/* <div class="ddin-navbar-toggler ms-2" data-bs-toggle="offcanvas" data-bs-target="#ddinOffcanvas" aria-controls="ddinOffcanvas">
            <div><span></span><span></span><span></span></div>
          </div> */}
        </div>
      </div>
    </div>
    <div class="offcanvas offcanvas-start ddin-offcanvas-wrap" tabindex="-1" id="ddinOffcanvas" aria-labelledby="ddinOffcanvasLabel">
     
     <button class="btn-close btn-close-white" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    
     <div class="offcanvas-body">
       
       <div class="sidenav-profile">
         <div class="user-profile"><img src="assets/img/core-img/icon-ddn-72-w.png" alt=""/></div>
         <div class="user-info">
         <h5 class="user-name mb-1 text-white" style={{fontSize:14}}></h5>
           <p class="available-balance text-white">Network Of  <span class="counter"><b>The Best</b></span></p>
         </div>
       </div>
     
       <ul class="sidenav-nav ps-0">
         <li><a href="#"><i class="fa-solid fa-user"></i>Agent Network</a></li>
         <li><a href="#"><i class="fa-solid fa-bell lni-tada-effect"></i>App Updates<span class="ms-1 badge badge-warning"></span></a></li>
         <li class="ddin-dropdown-menu"><a href="#"><i class="fa-solid fa-list"></i>DDIN Services & Partners</a>
           <ul>
             <li><a href="#">Bulk Sms</a></li>
            
           </ul>
         </li>
         <li><a href="#"><i class="fa-solid fa-file-code"></i>Terms & Conditions</a></li>
         <li class="ddin-dropdown-menu"><a href="#"><i class="fa-solid fa-list"></i>Agent Accounts Info</a>
           <ul>   
        
             <li><Link to="#">Float A/C</Link></li>
             <li><Link to="#">Commission A/C</Link></li>
           </ul>
         </li>
         <li><a href="#"><i class="fa-solid fa-sliders"></i>Language Settings</a></li>
         
       
       </ul>
     </div>
   </div> 
    </div>
)

}