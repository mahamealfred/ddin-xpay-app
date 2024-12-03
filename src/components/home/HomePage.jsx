

import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Paper, Box, Typography, ButtonBase, Modal, Button } from "@material-ui/core";
import { useIdleTimer } from 'react-idle-timer';
import {Fade, styled} from "@mui/material";
import { Backdrop } from "@mui/material";
import { Context } from "../Wrapper";
import $ from "jquery";
import LoginPage from "../user/LoginPage";
import FooterPage from "../footer/FooterPage";
import HeaderPage from "../header/HeaderPage";
import { viewAgentFloatAccountStatus } from "../../apis/UserController";
import LogoutDialog from "./LogoutDialog";

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const styles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function HomePage() {
  const navigate = useNavigate();
  const context = useContext(Context);
  const { resetAuth } = useContext(Context); 
  const [formattedBalance, setFormattedBalance] = useState("Rwf 0.00");
  const [agentNameId, setAgentNameId] = useState("Agent Float A/C");
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);
    const [formattedBalanceComAccount, setFormattedBalanceComAccount] =
    useState("Rwf 0.00");
  useEffect(() => {
    queryAccountStatus();
    queryCommAccountStatus();
  });
  const [openPageReflesh, setOpenPageReflesh] = useState(false)
const handleClosePageReflesh = () => setOpenPageReflesh(false);
  const queryCommAccountStatus = async () => {
    try {
      //Agent floac Ac Id Prod=7
      //Agent Float Account A/C Test=7

      //Agent Commission A/C Id Test=25
      //Agent Commission A/C Id Prod=8

      const response = await viewAgentFloatAccountStatus(
        context.userKey,
        context.agentInstantCommissionAccountId
      );

      if (response.responseCode === "200") {
        setFormattedBalanceComAccount(response.formattedBalance);
      } else {
        //toast.info(response.responseDescription);
      }
    } catch (err) {
      //console.log("Agenty Account Status Error:"+err);
    }
  };
  const queryAccountStatus = async () => {
    try {
      //Agent floac Ac Id Prod=7
      //Agent Float Account A/C Test=7

      //Agent Commission A/C Id Test=25
      //Agent Commission A/C Id Prod=8

      //context.agentFloatAccountId
      //context.agentInstantCommissionAccountId
      //context.agentDelayedCommissionAccountId

      const response = await viewAgentFloatAccountStatus(
        context.userKey,
        context.agentFloatAccountId
      );

      if (response.responseCode === "200") {
        setFormattedBalance(response.formattedBalance);
      } else {
        //console.log("Agenty Account Status:"+response.responseDescription);
        //toast.info(response.responseDescription);
      }
    } catch (err) {
      //toast.info("Dear customer we are unable to process your request now. Try again later."+err);
      //console.log("Agenty Account Status Error:"+err);
    }
  }

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

 
//   //Security 
  
//   //refresh token
//   var startTimer=null
//   // set idle timer
//   const [openModal,setOpenModal]=React.useState(false)
//   const handleClose=()=>{
//     setOpenModal(false)
//         }
//   const idleTimerRef=useRef(null)
//   const onIdle=()=>{
//   setOpenModal(true)

//   }
//   const handleStopTime=()=>{
//   clearInterval(startTimer)
//   }
//   useEffect(()=>{
// if(openModal===true){
//   handelClock(0,1,0)
// }

//   },)

  
//   const IdleTimer = useIdleTimer({
//     crossTab: true,
//     ref: idleTimerRef,
//      timeout:  5 * 60 * 1000,
//     // timeout:  5 * 1000,
//     onIdle: onIdle
//   })
//   const handelClock=(hr, mm, ss)=>{
//     function startInterval(){
//        startTimer=setInterval(function(){
//         if(hr==0 && mm==0 && ss==0){
//           handleStopTime();
//         }
//         else if(ss!=0){
//           ss--;
//         }
//         else if(mm !=0 && ss==0){
//           ss=59;
//           mm--;
//         }
//         else if(hr !=0 && mm ==0){
//           mm =60;
//           hr--;
//         }
//         if (hr.toString().length < 2) hr = "0" + hr;
//         if (mm.toString().length < 2) mm = "0" + mm;
//         if (ss.toString().length < 2) ss = "0" + ss;
//        // setRemainingTime(hr + " : " + mm + " : " + ss);
//        if(mm=="00" && ss=="00"){
//         // localStorage.removeItem('mobicashAuth');
//         // sessionStorage.removeItem('mobicash-auth')
         
//        return navigate('/')
//        }
//       }, 1000);
//     }
//     startInterval();
//   }
// const handleContinue=()=>{
// handleStopTime()
// setOpenModal(false)
// }

// const handleLogout=()=>{
//   //localStorage.removeItem('mobicashAuth');
//   // sessionStorage.removeItem('mobicash-auth')
//   resetAuth()
//   context.logout()
//  return navigate('/')
// }
// const handleLogoutPage=()=>{
//   //localStorage.removeItem('mobicashAuth');
//   // sessionStorage.removeItem('mobicash-auth')
//   resetAuth()
//   context.logout()
//  return navigate('/')
// }

  return context.loggedInStatus ? (
    <div>
      <HeaderPage />
    
      {/* <LogoutDialog
      openDialog={openModal}
       handleLogout={handleLogoutPage}
        handleContinue={handleContinue} 
        onClose={handleClose}
      /> */}



   

      <div class="page-content-wrapper">
               
        <div class="container">
        
          <br />
         
          <div class="discount-coupon-card-blue p-4 p-lg-4 dir-rtl">
         
            <div class="d-flex align-items-center">
              <div class="discountIcon">
                <img
                  class="w-100"
                  src="assets/img/core-img/icon-ddn-72-w.png"
                  alt=""
                />
              </div>
              <div class="text-content">
                <h4 class="text-white mb-1">Agent Services Portal</h4>
                <p class="text-white mb-0">
                  <span class="px-1 fw-bold">
                 
                  </span>
                </p>
              </div>
            </div>
            
          </div>
        </div>

        <div class="product-catagories-wrapper py-3">
          <div class="container">
            <div class="row g-2 rtl-flex-d-row-r">
              {context.agentCategory === null ||
              context.agentCategory === "Agent" ? (
                <>
                  <div class="text-content">
                <h4 class="text-white mb-0 ">Active Services</h4>
                <p class="text-white mb-0">
                  <span class="px-1 fw-bold"></span>
                </p>
                </div>
                <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="/rra-service">
                          <img
                            src="assets/img/bg-img/rra-bg-square.png"
                            alt=""
                          />
                          <span>RRA</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="/electricity-token">
                          <img src="assets/img/bg-img/eucllogo.PNG" alt="" />
                          <span>Electricity</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="/buy-airtime">
                          <img src="assets/img/bg-img/airtimes.jpg" alt="" />
                          <span>Airtime</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="/bulksms-service">
                          <img src="assets/img/bg-img/bulksms2.png" alt="" />
                          <span>Bulk SMS</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="/startimes-subscription">
                          <img
                            src="assets/img/bg-img/startimes-logo.jpg"
                            alt=""
                          />
                          <span>Startimes</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="/npo-service">
                          <img src="assets/img/core-img/npo.jpeg" alt="" />
                          <span>NPO </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="/bulk-airtime">
                          <img src="assets/img/bg-img/airtimes.jpg" alt="" />
                          <span>Bulk Airtime</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="text-content">
                <h4 class="text-white mb-0 mt-3">Development  Services</h4>
                <p class="text-white mb-0">
                  <span class="px-1 fw-bold"></span>
                </p>
                </div>
                <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="#">
                          <img src="assets/img/core-img/irembo.jpg" alt="" />
                          <span>Irembo</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="#">
                          <img src="assets/img/core-img/bk.png" alt="" />
                          <span>BK</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="#">
                          <img src="assets/img/bg-img/ecobank.jpg" alt="" />
                          <span>Ecobank</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                
          
                <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="#">
                          <img src="assets/img/bg-img/wasaclogo.png" alt="" />
                          <span>Wasac</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="#">
                          <img
                            src="assets/img/bg-img/bulkpayments.png"
                            alt=""
                          />
                          <span>Bulk Payment</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="#">
                          <img src="assets/img/bg-img/canalplus.jpg" alt="" />
                          <span>Canal+</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                </>

              ) : (
                <>
                 <div class="text-content">
                <h4 class="text-white mb-0 ">Active Services</h4>
                <p class="text-white mb-0">
                  <span class="px-1 fw-bold"></span>
                </p>
                </div>
                
                <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="/rra-service">
                          <img
                            src="assets/img/bg-img/rra-bg-square.png"
                            alt=""
                          />
                          <span>RRA</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="/electricity-token">
                          <img src="assets/img/bg-img/eucllogo.PNG" alt="" />
                          <span>Electricity</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="/buy-airtime">
                          <img src="assets/img/bg-img/airtimes.jpg" alt="" />
                          <span>Airtime</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="/startimes-subscription">
                          <img
                            src="assets/img/bg-img/startimes-logo.jpg"
                            alt=""
                          />
                          <span>Startimes</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="/bulksms-service">
                          <img src="assets/img/bg-img/bulksms2.png" alt="" />
                          <span>Bulk SMS</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="/bulk-airtime">
                          <img src="assets/img/bg-img/airtimes.jpg" alt="" />
                          <span>Bulk Airtime</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div class="text-content">
                <h4 class="text-white mb-0 mt-3">Development  Services</h4>
                <p class="text-white mb-0">
                  <span class="px-1 fw-bold"></span>
                </p>
                </div>
                <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="#">
                          <img src="assets/img/core-img/irembo.jpg" alt="" />
                          <span>Irembo</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="#">
                          <img src="assets/img/core-img/bk.png" alt="" />
                          <span>BK</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="#">
                          <img src="assets/img/bg-img/ecobank.jpg" alt="" />
                          <span>Ecobank</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                
          
                <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="#">
                          <img src="assets/img/bg-img/wasaclogo.png" alt="" />
                          <span>Wasac</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="#">
                          <img
                            src="assets/img/bg-img/bulkpayments.png"
                            alt=""
                          />
                          <span>Bulk Payment</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="#">
                          <img src="assets/img/bg-img/canalplus.jpg" alt="" />
                          <span>Canal+</span>
                        </Link>
                      </div>
                    </div>
                  </div>
               
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div class="internet-connection-status" id="internetStatus"></div>

      <FooterPage />
    </div>
  ) : (
    <LoginPage />
  );
}
