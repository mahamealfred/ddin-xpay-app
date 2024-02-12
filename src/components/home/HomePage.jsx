/**
 * *@gniyonge
 * App Home Page

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
import { Paper, Box, Typography, ButtonBase } from "@material-ui/core";
import { Context } from "../Wrapper";
import $ from "jquery";
import LoginPage from "../user/LoginPage";
import FooterPage from "../footer/FooterPage";
import HeaderPage from "../header/HeaderPage";
import { viewAgentFloatAccountStatus } from "../../apis/UserController";

export default function HomePage() {
  const navigate = useNavigate();
  const context = useContext(Context);
  const [formattedBalance, setFormattedBalance] = useState("Rwf 0.00");
  const [agentNameId, setAgentNameId] = useState("Agent Float A/C");
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);
  useEffect(() => {
    queryAccountStatus();
  });

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

  return context.loggedInStatus ? (
    <div>
      <HeaderPage />

      <div class="page-content-wrapper">
      <ul class="sidenav-nav ">
                  <li class="ddin-dropdown-menu">
              <a href="#">
                <i class="fa-solid fa-key"></i>Agent Accounts
              </a>
              <ul>
                <li>
                <p class="available-balance text-white">
                Available Balance:{" "}
                <span class="counter">
                  <b>{formattedBalance}</b>
                </span><br/>
                Commission A/C:{" "}
                <span class="counter">
                  <b>{formattedBalance}</b>
                </span>
              </p>
                  {/* <Link to="/agent-float-account">Float A/C</Link> */}
                </li>
                <li>
                <li class="ddin-dropdown-menu">
                <a href="#">
                <i class="fa-solid fa-list"></i>DDIN Bank Float Accounts
              </a>
              <ul>
                <li>
                <p class="available-balance text-white">
                BPR A/C:{"  "}
                <span class="counter">
                  <b>4491555281</b>
                </span><br/>
                BK A/C:{"  "}
                <span class="counter">
                  <b>100157331153</b>
                </span><br/>
                Equity Bank A/C:{"  "}
                <span class="counter">
                  <b>4002201078015</b>
                </span>
              </p>
                  </li>
                 </ul>

                  </li>
                
                
                  {/* <Link to="/agent-float-account">Float A/C</Link> */}
                </li>
                <li>
                {/* <p class="available-balance ">
                Commission A/C:{" "}
                <span class="counter">
                  <b>{formattedBalance}</b>
                </span>
              </p> */}
                {/* <span class="px-1 ">
                Commission A/C : 500000
                 </span> */}
                  {/* <Link to="/agent-commission-account">Commission A/C</Link> */}
                </li>
              </ul>
            </li>
                  </ul>
                    
        <div class="container">
      
          <br />
{/*           
          <div class="section-heading d-flex align-items-center justify-content-between dir-rtl">
            <h6>
              <a class="btn p-0" href="sign-in">
                <i class="ms-1 fa-solid fa-arrow-left-long"></i> Sign out
              </a>
            </h6>
            <a class="btn p-0" href="#">More<i class="ms-1 fa-solid fa-arrow-right-long"></i></a>
          </div> */}
         
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
                <h4 class="text-white mb-1">Available Services</h4>
                <p class="text-white mb-0">
                  <span class="px-1 fw-bold"></span>
                </p>
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

                  {/* <div class="col-3">
              <div class="card catagory-card active">
                <div class="card-body px-2">
                <Link to="/pindo-service">
                <img src="assets/img/bg-img/bulksms2.png" alt=""/>
                <span>Bulk SMS Line 2</span>    
                </Link>        
                              
                  
                 </div>
              </div>
          </div>*/}
                 

                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="/npo-service">
                          <img src="assets/img/core-img/npo.jpeg" alt="" />
                          <span>NPO Services</span>
                        </Link>
                      </div>
                    </div>
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
                        <Link to="/electricity-token">
                          <img src="assets/img/bg-img/eucllogo.PNG" alt="" />
                          <span>Electricity</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div class="text-content">
                <h4 class="text-white mb-1">Upcoming  Services</h4>
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
                          <span>Bank Of Kigali</span>
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
                          <img src="assets/img/bg-img/accessb.png" alt="" />
                          <span>Access Bank</span>
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
                  {/* <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="#">
                          <img src="assets/img/bg-img/icon_logo.png" alt="" />
                          <span>Mobicash</span>
                        </Link>
                      </div>
                    </div>
                  </div> */}

                </>

              ) : (
                <>
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

                  {/* <div class="col-3">
              <div class="card catagory-card active">
                <div class="card-body px-2">
                <Link to="/pindo-service">
                <img src="assets/img/bg-img/bulksms2.png" alt=""/>
                <span>Bulk SMS Line 2</span>    
                </Link>        
                              
                  
                 </div>
              </div>
          </div>*/}
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
                          <span>Bank Of Kigali</span>
                        </Link>
                      </div>
                    </div>
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
                        <Link to="#">
                          <img src="assets/img/bg-img/icon_logo.png" alt="" />
                          <span>Mobicash</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div class="col-3">
                    <div class="card catagory-card">
                      <div class="card-body px-2">
                        <Link to="#">
                          <img src="assets/img/bg-img/equity.png" alt="" />
                          <span>Equity Bank</span>
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
                        <Link to="/electricity-token">
                          <img src="assets/img/bg-img/eucllogo.PNG" alt="" />
                          <span>Electricity</span>
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
