/**
 * *@gniyonge
 * Agent Commission Account Page View

 */

import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";

import $ from "jquery";

import { Context } from "../Wrapper";
import {
  payPindo,
  viewAgentFloatAccountStatus,
  viewAgentFloatAccountTransactions,
  viewAgentFloatAccountTransactionsYc,
  registerYellowCardUserSecondStep,
  registerYellowCardUserFirstStep,
} from "../../apis/UserController";
import { viewAgentFloatAccountStatusById } from "../../apis/ServiceController";
import HeaderPage from "../header/HeaderPage";
import LoginPage from "../user/LoginPage";
export default function AgentCommissionAccountPage() {
  const context = useContext(Context);
  const [agentAccountTransactions, setAgentAccountTransactions] = useState([]);
  const [formattedBalance, setFormattedBalance] = useState("Rwf 0.00");
  const [formattedBalanceComAccount, setFormattedBalanceComAccount] =
    useState("Rwf 0.00");

  useEffect(() => {
    queryAccountStatus();
    queryCommAccountStatus();
  });

  const viewFloatAccountInfo = () => {
    queryAgentAccountTransactions();
  };

  const queryAgentAccountTransactions = async () => {
    //console.log("Viewing Agent Account transactions");

    try {
      //Agent floac Ac Id Prod=7
      //Agent Float Account A/C Test=7

      //Agent Commission A/C Id Test=25
      //Agent Commission A/C Id Prod=8

      //context.agentFloatAccountId
      //context.agentInstantCommissionAccountId
      //context.agentDelayedCommissionAccountId

      const response = await viewAgentFloatAccountTransactions(
        context.userKey,
        context.agentInstantCommissionAccountId
      );

      if (response.responseCode === "200") {
        setAgentAccountTransactions(response.data);
      } else {
        //toast.info(response.responseDescription);
      }
    } catch (err) {
      //console.log("Agent Account Status Error:"+err);
    }
  };

  const queryAccountStatus = async () => {
    try {
      //Agent floac Ac Id Prod=7
      //Agent Float Account A/C Test=7

      //Agent Commission A/C Id Test=25
      //Agent Commission A/C Id Prod=8

      // const response = await viewAgentFloatAccountStatus(
        const response = await viewAgentFloatAccountStatusById(
        context.userKey,
        context.agentInstantCommissionAccountId
      );

      if (response.responseCode === 200) {
        setFormattedBalance(response.formattedBalance);
      } else {
        //toast.info(response.responseDescription);
      }
    } catch (err) {
      //console.log("Agent Account Status Error:"+err);
    }
  };

  const queryCommAccountStatus = async () => {
    try {
      //Agent floac Ac Id Prod=7
      //Agent Float Account A/C Test=7

      //Agent Commission A/C Id Test=25
      //Agent Commission A/C Id Prod=8

      // const response = await viewAgentFloatAccountStatus(
        const response = await viewAgentFloatAccountStatusById(
        context.userKey,
        context.agentInstantCommissionAccountId
      );

      if (response.responseCode === 200) {
        setFormattedBalanceComAccount(response.formattedBalance);
      } else {
        //toast.info(response.responseDescription);
      }
    } catch (err) {
      //console.log("Agenty Account Status Error:"+err);
    }
  };

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
      <HeaderPage/>

      <div class="page-content-wrapper">
        <div class="container">
          <br />
          <div class="section-heading d-flex align-items-center justify-content-between dir-rtl">
            <h6>
              <Link class="btn p-0 text-white" to="/">
                <i class="ms-1 fa-solid fa-arrow-left-long text-white"></i> Back
              </Link>
            </h6>
            {/*<a class="btn p-0" href="#">More<i class="ms-1 fa-solid fa-arrow-right-long"></i></a>*/}
          </div>
          <div class="discount-coupon-card-blue p-4 p-lg-5 dir-rtl">
            <div class="d-flex align-items-center">
              <div class="discountIcon">
                <img
                  class="w-100"
                  src="assets/img/core-img/icon-ddn-72-w.png"
                  alt=""
                />
              </div>
              <div class="text-content">
                <h4 class="text-white mb-1">Agent Commission A/C</h4>
                <p class="text-white mb-0">
                  Available Balance:{" "}
                  <b style={{ fontSize: 20 }}>{formattedBalanceComAccount}</b>
                  <span class="px-1 fw-bold"></span>
                  <b style={{ fontSize: 20 }}></b>
                </p>
              </div>
            </div>
          </div>
        </div>
                       {/* Form */}
                       <div class="container">
            <br />
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 5,
                borderWidth: 1,
                borderStyle: "solid",
              }}
            >
              <div class="row justify-content-center">
                <div class="col-10 col-lg-8">
                  <div class="register-form mt-2">
                    <div class="form-group text-start mb-4">
                      <span
                        class="mb-2"
                        style={{ fontSize: 24, color: "black" }}
                      >
                        <b>Self-Serve Commissions</b>
                      </span>
                      <span
                        class="mb-2"
                        style={{ fontSize: 16, color: "black" }}
                      >
                        Dear Valued Agent,
We are thrilled to announce that our new self-serve commission service, will soon be available!
                        <b></b>
                      </span>
                    </div>

                    <form >
                      <div class="form-group text-start mb-4">
                        <span style={{ color: "black", fontSize: 16 }}>
                          <b>Enter Amount:</b>
                          <b style={{ color: "red" }}>*</b>
                        </span>

                        <input
                        disabled
                          class="form-control"
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            borderColor: "black",
                            borderRadius: 10,
                            borderWidth: 1,
                            borderStyle: "solid",
                            fontSize: 14,
                          }}
                          type="text"
                          // onChange={(e) => setMeterNumber(e.target.value)}
                          // value={meterNumber}
                          required
                        />
                      </div>

                      <button disabled class="btn btn-warning btn-lg w-100">
                        Self-serve
                      </button>

                    </form>
                  </div>

                  <div class="login-meta-data">
                    <p class="mt-3 mb-0"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <div class="weekly-best-seller-area py-3">
          <div class="container">
            <div class="section-heading d-flex align-items-center justify-content-between dir-rtl">
              <h6>Agents Transactions</h6>

              <a class="btn p-0 text-white" onClick={viewFloatAccountInfo}>
                View All Transactions<i class="ms-1 fa-solid fa-arrow-right-long"></i>
              </a>
            </div>
            <div class="row g-2">
              {agentAccountTransactions.map((transaction, index) => {
                return (
                  <div class="col-12">
                    <div class="horizontal-product-card">
                      <div class="d-flex align-items-center">
                        <div class="product-thumbnail-side">
                          <a
                            class="product-thumbnail shadow-sm d-block"
                            href="#"
                          >
                            <i class="fa-solid fa-list"></i>
                            <img
                              src="assets/img/core-img/icon-ddn-72-w.png"
                              alt=""
                            />
                          </a>
                        </div>
                        <div class="product-description">
                          <a class="wishlist-btn" href="#">
                            <img src="assets/img/core-img/ticker.png" alt="" />
                          </a>
                          <a class="product-title d-block" style={{ color: "white" }} href="#">
                            {transaction.description}
                          </a>

                          <p class="sale-price" style={{ color: "white" }}>
                            <i class="fa-solid" ></i>
                            {transaction.processDate.substring(0, 20)}
                            <span></span>
                          </p>

                          <div class="product-rating">
                            <i class="fa-solid fa-star"></i>TX:{transaction.id}
                            <span class="ms-1 " style={{ color: "white" }}>
                              <b>{transaction.formattedAmount}</b>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div class="internet-connection-status" id="internetStatus"></div>
      <div class="footer-nav-area" id="footerNav">
        <div class="ddin-footer-nav">
          <ul class="h-100 d-flex align-items-center justify-content-between ps-0 d-flex rtl-flex-d-row-r">
            <li>
              <Link to="/">
                <i class="fa-solid fa-house"></i>Home
              </Link>
            </li>
            <li>
              <Link to="#">
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
              <Link to="#">
                <i class="fa-solid fa-gear"></i>Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <LoginPage />
  );
}
