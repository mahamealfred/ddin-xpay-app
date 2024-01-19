

import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Context } from "../Wrapper";
import "react-toastify/dist/ReactToastify.css";
import loginAgent from "../../apis/UserController";
import $ from "jquery";
//import UserLoginDialog from './UserAccessDetailsConfirmation';
import { Buffer } from "buffer";
import HeaderPage from "../header/PublicHeaderPage";
import FooterPage from "../footer/FooterPage";


export default function LoginPage() {
  const context = useContext(Context);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);
  const toastId = React.useRef(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const goToHome = () => {
    setShowConfirmDialog(false);
    navigate("/", { state: "" });
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

  const onSigninClick = async (e) => {
    e.preventDefault();

    toast.dismiss();
    const id = toast.loading("Login...");

    try {
      const accessDetails = {
        username: username,
        password: password,
      };

      const response = await loginAgent(accessDetails);

      setUserData(response);

      if (response.responseCode === "200") {
        const usernamePasswordBuffer = Buffer.from(username + ":" + password);
        const base64data = usernamePasswordBuffer.toString("base64");

        setUser(response);
        context.updateUser(response);
        context.updateLoginStatus(true);
        context.updateDistrict(response.district);
        context.updateProvince(response.province);
        context.updateAgentCategory(response.agentCategory);
        context.updateSector(response.sector);
        context.updateUserId(response.userId);
        context.updateAgentFullName(response.name);
        context.updateAgentUsername(response.username);
        context.updateUserKey(base64data);
        context.updateAgentFloatAccountId(response.floatAccountId);

        context.updateAgentInstantCommissionAccountId(
          response.instantCommissionAccountId
        );
        context.updateAgentDelayedCommissionAccountId(
          response.delayedCommissionAccountId
        );

        //context.agentFloatAccountId
        //context.agentInstantCommissionAccountId
        //context.agentDelayedCommissionAccountId
        //context.updateUserId:(userIdData)
        toast.update(id, {
          render: response.responseDescription,
          type: "success",
          isLoading: false,
          closeButton: null,
        });

        setUserDetails(response);
        goToHome();
        //setShowConfirmDialog(true);
      } else {
        toast.update(id, {
          render: response.responseDescription,
          type: "info",
          isLoading: false,
          closeButton: null,
        });
      }
    } catch (err) {
      toast.update(id, {
        render:
          "Dear customer we are unable to process your request now. please Try again later.",
        type: "info",
        isLoading: false,
        closeButton: null,
      });

      if (!err?.response) {
        //console.log('No Server Response');
      } else if (err.response?.status === 409) {
        //console.log('Username Taken');
      } else {
        //console.log('Registration Failed')
      }
    }
  };

  return (
    <div>
      <HeaderPage />

      <div class="login-wrapper d-flex align-items-center justify-content-center text-center">
        <div class="container" >
          <div class="row justify-content-center" >
            <div class="discount-coupon-card-blue p-4 p-lg-5 dir-rtl " style={{ backgroundColor: "#f8882b" }} >
              <div class="d-flex align-items-center">
                <div class="discountIcon">
                  <img
                    class="w-100"
                    src="assets/img/core-img/icon-ddn-72-w.png"
                    alt=""
                  />
                </div>
                <div class="text-content">
                  <h4 class="text-white mb-0 ">
                    <b style={{ color: "#202a4e" }}>The Best Agents Network</b>
                  </h4>
                  <p class="text-white mb-0">
                    <span class="px-1 fw-bold"></span>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-10 col-lg-8">
              <div class="register-form mt-5">
                <h4 class="text-white mb-1">LOGIN</h4>
                <form>
                  <div class="form-group text-start mb-4">
                    <span style={{ fontSize: 16 }}>Username:</span>
                    <label for="username">
                      <i
                        class="fa-solid fa-user"
                        style={{ color: "#202a4e" }}
                      ></i>
                    </label>
                    <input
                      class="form-control"
                      id="username"
                      type="text"
                      style={{
                        backgroundColor: "white",
                        color: "#202a4e",
                        fontSize: 16,
                      }}
                      required
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div class="form-group text-start mb-4">
                    <span style={{ fontSize: 16 }}>Password:</span>
                    <label for="password">
                      <i
                        class="fa-solid fa-key"
                        style={{ color: "#202a4e" }}
                      ></i>
                    </label>
                    <input
                      class="form-control"
                      id="password"
                      type="password"
                      style={{
                        backgroundColor: "white",
                        color: "#202a4e",
                        fontSize: 16,
                      }}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                  style={{ backgroundColor: "#f8882b" }}
                    class="btn  btn-lg w-100"
                    onClick={onSigninClick}
                  >
                    Log In
                  </button>
                  <ToastContainer className="toast-position" />
                  {/** <UserLoginDialog  openstatus={showConfirmDialog}  data={userDetails} closeClick={() => setShowConfirmDialog(!showConfirmDialog)} confirmClick={() => goToHome()}/>                  */}
                </form>
              </div>

              <div class="login-meta-data">
                <p class="mb-0">
                  Do you have an account?
                  <a class="mx-1" href="/register">
                    Register Now
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterPage />
    </div>
  );
}
