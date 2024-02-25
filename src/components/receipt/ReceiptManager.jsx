/**
 * *@gniyonge
 * Receipt Manager

 */

import React, { useContext, useState, useMemo, useRef, useEffect } from "react";

import { toast, ToastContainer } from "react-toastify";
import { Context } from "../Wrapper";
import $ from "jquery";
import ReactToPrint from "react-to-print";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import "hammerjs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import {
  payPindo,
  viewAgentFloatAccountStatus,
  viewAgentFloatAccountTransactions,
  viewAgentFloatAccountTransactionsYc,
  registerYellowCardUserSecondStep,
  registerYellowCardUserFirstStep,
} from "../../apis/UserController";
import "./receiptStyler.css";
import LoginPage from "../user/LoginPage";
import FooterPage from "../footer/FooterPage";
import HeaderPage from "../header/HeaderPage";

export default function DdinReceiptmanagerPage() {
  const context = useContext(Context);
  const [agentAccountTransactions, setAgentAccountTransactions] = useState([]);
  const { state } = useLocation();
  const [balance, setbalance] = useState("Rwf 0.00");
  const [formattedBalance, setFormattedBalance] = useState("Rwf 0.00");
  const pdfExportComponent = useRef(null);
  const handleExportWithComponent = (event) => {
    pdfExportComponent.current.save();
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
      <HeaderPage />

      <div class="page-content-wrapper">
        <div class="container">
          <br />
          <div class="section-heading d-flex align-items-center justify-content-between dir-rtl">
            <h6>
              <Link class="btn p-0" to="/bulksms-service">
                <i class="ms-1 fa-solid fa-arrow-left-long"></i> Back
              </Link>
            </h6>
            {/*<a class="btn p-0" href="#">More<i class="ms-1 fa-solid fa-arrow-right-long"></i></a>*/}
          </div>
          <div class="row justify-content-center">
            <div class="col-12 col-lg-12">
              <div>
                <div className="box wide hidden-on-narrow">
                  <div className="box-col">
                    <Button
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        marginRight: "2px",
                      }}
                      className="btn btn-warning btn-lg w-40"
                      onClick={handleExportWithComponent}
                    >
                      PDF Export
                    </Button>
                    <ReactToPrint
                      trigger={() => (
                        <Button
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                          }}
                          className="btn btn-warning btn-lg w-40"
                        >
                          Print Out
                        </Button>
                      )}
                      content={() => pdfExportComponent.current}
                    />
                  </div>
                  <br />
                  <div
                    className="page-container hidden-on-narrow"
                    style={{ backgroundColor: "white" }}
                  >
                    <PDFExport ref={pdfExportComponent}>
                      <div>
                        <div
                          className="pdf-header"
                          style={{ paddingRight: 10 }}
                        >
                          <span className="company-logo">
                            <img
                              src="assets/img/core-img/icon-ddn-72-w.png"
                              alt="DDIN Company"
                            />{" "}
                            Bulk SMS Receipt
                          </span>
                          <span className="invoice-number">
                            <b>Receipt #</b>
                            <b>{state?.transactionData?.id}</b>
                          </span>
                        </div>

                        <div className="pdf-header" style={{ padding: 10 }}>
                          <div>
                            <br />
                            <b>
                              {" "}
                              <span style={{ fontSize: 22 }}>
                                Agent Outlet:
                              </span>
                            </b>
                          </div>
                        </div>
                        <div style={{ padding: 10 }}>
                          <table>
                            <tbody>
                              <tr style={{ color: "black" }}>
                                <td>
                                  <b>
                                    <span> DDIN Agent:</span>
                                  </b>
                                </td>
                                <td>
                                  <span> {context.agentFullName}</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="pdf-header" style={{ padding: 10 }}>
                          <div>
                            <b>
                              <span style={{ fontSize: 22 }}>
                                Service Details:
                              </span>{" "}
                            </b>

                            <></>
                          </div>
                        </div>
                        <div style={{ padding: 10 }}>
                          <table>
                            <tbody>
                              <tr style={{ color: "black" }}>
                                <td>
                                  <b>
                                    <span>Client Name:</span>
                                  </b>
                                </td>{" "}
                                <td>
                                  <span>{state?.clientName}</span>
                                </td>
                              </tr>
                              <tr style={{ color: "black" }}>
                                <td>
                                  <b>
                                    <span>Client TIN:</span>
                                  </b>
                                </td>{" "}
                                <td>
                                  <span>{state?.clientTin}</span>
                                </td>
                              </tr>
                              <tr style={{ color: "black" }}>
                                <td>
                                  <b>
                                    <span>Client Phone Number:</span>
                                  </b>
                                </td>{" "}
                                <td>
                                  <span>{state?.clientPhone}</span>
                                </td>
                              </tr>
                              <tr style={{ color: "black" }}>
                                <td>
                                  <b>
                                    <span>Client Email:</span>
                                  </b>
                                </td>{" "}
                                <td>
                                  <span>{state?.clientEmail}</span>
                                </td>
                              </tr>
                              <tr style={{ color: "black" }}>
                                <td>
                                  <b>
                                    <span>Descrption:</span>
                                  </b>
                                </td>{" "}
                                <td>
                                  <span>
                                    {state?.transactionData?.description}
                                  </span>
                                </td>
                              </tr>
                              <tr style={{ color: "black" }}>
                                <td>
                                  <b>
                                    <span>Process Date:</span>
                                  </b>
                                </td>{" "}
                                <td>
                                  <span>
                                    {state?.transactionData?.processDate}
                                  </span>
                                </td>
                              </tr>

                              <tr style={{ color: "black" }}>
                                <td>
                                  <b>
                                    <span>Total Recipients Number:</span>
                                  </b>
                                </td>{" "}
                                <td>
                                  <span>{state?.recipientNumber}</span>
                                </td>
                              </tr>

                              <tr style={{ color: "black" }}>
                                <td>
                                  <b>
                                    <span>SMS Number Per Recipient:</span>
                                  </b>
                                </td>{" "}
                                <td>
                                  <span>{state?.messageCounter}</span>
                                </td>
                              </tr>
                              <tr style={{ color: "black" }}>
                                <td>
                                  <b>
                                    <span>SMS Unit Cost:</span>
                                  </b>
                                </td>{" "}
                                <td>
                                  <span>Rwf 15</span>
                                </td>
                              </tr>

                              <tr style={{ color: "black" }}>
                                <td>
                                  <b>
                                    <span>Total Sent SMSs:</span>
                                  </b>
                                </td>{" "}
                                <td>
                                  <span>{"0"}</span>
                                </td>
                              </tr>

                              <tr>
                                <td>
                                  <span>Service Fee:</span>
                                </td>
                                <td>
                                  <span>0 Rwf</span>
                                </td>
                              </tr>

                              <tr>
                                <td>
                                  <span>Tax Mode:</span>
                                </td>
                                <td>
                                  <span>Inclusive</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="pdf-header" style={{ padding: 10 }}>
                          <div
                            style={{
                              fontSize: 20,
                              textAlign: "right",
                              justifyItems: "right",
                            }}
                          >
                            <b>
                              {" "}
                              Total (Rwf):
                              <span>
                                {parseFloat(state?.transactionData?.amount) *
                                  2.5 *
                                  -1}
                              </span>
                            </b>

                            <></>
                          </div>
                        </div>

                        <div style={{ padding: 10 }}>
                          <div
                            style={{
                              textAlign: "center",
                              justifyContent: "center",
                              color: "blue",
                            }}
                          >
                            <span>Thank you for Trading With Us</span>
                            <br />
                            <span>
                              Powered By <b>DDIN</b>
                            </span>
                          </div>
                        </div>
                      </div>
                    </PDFExport>
                  </div>
                </div>
              </div>

              <div class="login-meta-data">
                <p class="mt-3 mb-0"></p>
              </div>
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
