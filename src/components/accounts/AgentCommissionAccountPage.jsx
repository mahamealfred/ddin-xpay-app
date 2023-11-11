/**
 * *@gniyonge
 * Agent Commission Account Page View

 */

import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
import { Navigate,Link,useNavigate  } from "react-router-dom";


import $ from "jquery";

import {Context} from "../Wrapper";
import {payPindo,viewAgentFloatAccountStatus,viewAgentFloatAccountTransactions,viewAgentFloatAccountTransactionsYc,registerYellowCardUserSecondStep,registerYellowCardUserFirstStep} from '../../apis/UserController';




export default function AgentCommissionAccountPage() {


  const context = useContext(Context);
  const [agentAccountTransactions, setAgentAccountTransactions] = useState([]);
const[formattedBalance,setFormattedBalance]=useState('Rwf 0.00');
const[formattedBalanceComAccount,setFormattedBalanceComAccount]=useState('Rwf 0.00');








useEffect(() => {

  queryAccountStatus();
  queryCommAccountStatus();

  
});

const viewFloatAccountInfo=()=>{
  queryAgentAccountTransactions();
}



  

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
 
    const response=await viewAgentFloatAccountTransactions(context.userKey,context.agentInstantCommissionAccountId);
   
      if(response.responseCode==="200"){
       
        setAgentAccountTransactions(response.data);

      }else{
        
        //toast.info(response.responseDescription);
      
  
      }

    } catch (err) {
     

             //console.log("Agent Account Status Error:"+err);
     
    }
    
    
  }

  const queryAccountStatus = async () => {

   
    

  

      try {
  
 //Agent floac Ac Id Prod=7
  //Agent Float Account A/C Test=7

  //Agent Commission A/C Id Test=25
  //Agent Commission A/C Id Prod=8

 
    const response=await viewAgentFloatAccountStatus(context.userKey,context.agentInstantCommissionAccountId);
   
  
      if(response.responseCode==="200"){

        setFormattedBalance(response.formattedBalance);



        
      }else{
       
        //toast.info(response.responseDescription);
      
  
      }

    } catch (err) {
     
             //console.log("Agent Account Status Error:"+err);
     
    }
    
    
  }

  
  const queryCommAccountStatus = async () => {

   
   

  

      try {
  
 //Agent floac Ac Id Prod=7
  //Agent Float Account A/C Test=7

  //Agent Commission A/C Id Test=25
  //Agent Commission A/C Id Prod=8

 
    const response=await viewAgentFloatAccountStatus(context.userKey,context.agentInstantCommissionAccountId);
   
  
      if(response.responseCode==="200"){

setFormattedBalanceComAccount(response.formattedBalance);



        
      }else{
        
        //toast.info(response.responseDescription);
      
  
      }

    } catch (err) {
     

             //console.log("Agenty Account Status Error:"+err);
     
    }
    
    
  }



  
    useEffect(() => {

        const ddinWindow = $(window);

        // :: Preloader
        ddinWindow.on('load', function () {
            $('#preloader').fadeOut('1000', function () {
                $(this).remove();
            });
        });
    
        // :: Dropdown Menu
        $(".sidenav-nav").find("li.ddin-dropdown-menu").append("<div class='dropdown-trigger-btn'><i class='fa-solid fa-angle-down'></i></div>");
        $(".dropdown-trigger-btn").on('click', function () {
            $(this).siblings('ul').stop(true, true).slideToggle(700);
            $(this).toggleClass('active');
        });
    
        // :: Hero Slides
        if ($.fn.owlCarousel) {
            const welcomeSlider = $('.hero-slides');
            welcomeSlider.owlCarousel({
                items: 1,
                loop: true,
                autoplay: false,
                dots: true,
                center: true,
                margin: 0,
                animateIn: 'fadeIn',
                animateOut: 'fadeOut'
            })
    
            welcomeSlider.on('translate.owl.carousel', function () {
                const layer = $("[data-animation]");
                layer.each(function () {
                    const anim_name = $(this).data('animation');
                    $(this).removeClass('animated ' + anim_name).css('opacity', '0');
                });
            });
    
            $("[data-delay]").each(function () {
                const anim_del = $(this).data('delay');
                $(this).css('animation-delay', anim_del);
            });
    
            $("[data-duration]").each(function () {
                const anim_dur = $(this).data('duration');
                $(this).css('animation-duration', anim_dur);
            });
    
            welcomeSlider.on('translated.owl.carousel', function () {
                const  layer = welcomeSlider.find('.owl-item.active').find("[data-animation]");
                layer.each(function () {
                    const anim_name = $(this).data('animation');
                    $(this).addClass('animated ' + anim_name).css('opacity', '1');
                });
            });
        }
    
        // :: Flash Sale Slides
        if ($.fn.owlCarousel) {
            const flashSlide = $('.flash-sale-slide');
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
                        items: 4
                    }
                },
            })
        }
    
        // :: Collection Slides
        if ($.fn.owlCarousel) {
            const collectionSlide = $('.collection-slide');
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
                        items: 4
                    }
                },
            })
        }
    
        // :: Products Slides
        if ($.fn.owlCarousel) {
            const  productslides = $('.product-slides');
            productslides.owlCarousel({
                items: 1,
                margin: 0,
                loop: false,
                autoplay: true,
                autoplayTimeout: 5000,
                dots: false,
                nav: true,
                navText: [('<i class="fa-solid fa-angle-left"></i>'), ('<i class="fa-solid fa-angle-right"></i>')]
            })
        }
    
        // :: Catagory Slides
        if ($.fn.owlCarousel) {
            const catagoryslides = $('.catagory-slides');
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
                        items: 4
                    },
                    768: {
                        items: 3
                    }
                },
            })
        }
    
        // :: Related Products Slides
        if ($.fn.owlCarousel) {
            const relProductSlide = $('.related-product-slide');
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
                    }
                },
            })
        }
    
        // :: Counter Up
        if ($.fn.counterUp) {
            $('.counter').counterUp({
                delay: 150,
                time: 3000
            });
        }
    
        // :: Nice Select 
        if ($.fn.niceSelect) {
            $('#selectProductCatagory, #topicSelect, #countryCodeSelect').niceSelect();
        }
    
        // :: Prevent Default 'a' Click
        $('a[href="#"]').on('click', function ($) {
            $.preventDefault();
        });
    
        // :: Password Strength
        if ($.fn.passwordStrength) {
            $('#registerPassword').passwordStrength({
                minimumChars: 8
            });
        }
    
        // :: Magnific Popup 
        if ($.fn.magnificPopup) {
            $('#singleProductVideoBtn, #videoButton').magnificPopup({
                type: "iframe"
            });
        }
    
        // :: Review Image Magnific Popup 
        if ($.fn.magnificPopup) {
            $('.review-image').magnificPopup({
                type: "image"
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
    

    })



    return (

        <div>


    <div class="header-area" id="headerArea">
      <div class="container h-100 d-flex align-items-center justify-content-between d-flex rtl-flex-d-row-r">
       
        <div class="logo-wrapper"><a href="#"><img src="assets/img/icons/fav-icon-ddn.png" alt=""/></a></div>
        <div class="navbar-logo-container d-flex align-items-center">
         
        
          
          <div class="user-profile-icon ms-2"><a href="#"><img src="assets/img/core-img/icon-ddn-72-w.png" alt=""/></a></div>
          
          <div class="ddin-navbar-toggler ms-2" data-bs-toggle="offcanvas" data-bs-target="#ddinOffcanvas" aria-controls="ddinOffcanvas">
            <div><span></span><span></span><span></span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="offcanvas offcanvas-start ddin-offcanvas-wrap" tabindex="-1" id="ddinOffcanvas" aria-labelledby="ddinOffcanvasLabel">
     
      <button class="btn-close btn-close-white" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
     
      <div class="offcanvas-body">
        
        <div class="sidenav-profile">
          <div class="user-profile"><img src="assets/img/core-img/icon-ddn-72-w.png" alt=""/></div>
          <div class="user-info">
          <h5 class="user-name mb-1 text-white" style={{fontSize:14}}>{context?.agentFullName}</h5>
            <p class="available-balance text-white">Available Balance: <span class="counter"><b>{formattedBalance}</b></span></p>
          </div>
        </div>
      
        <ul class="sidenav-nav ps-0">
          <li><a href="#"><i class="fa-solid fa-user"></i>My Profile</a></li>
          <li><a href="#"><i class="fa-solid fa-bell lni-tada-effect"></i>Notifications<span class="ms-1 badge badge-warning"></span></a></li>
          <li class="ddin-dropdown-menu"><a href="#"><i class="fa-solid fa-store"></i>DDIN Services</a>
            <ul>
              <li><a href="#">Bulk Sms</a></li>
             
            </ul>
          </li>
          <li><a href="#"><i class="fa-solid fa-file-code"></i>Terms & Conditions</a></li>
          <li class="ddin-dropdown-menu"><a href="#"><i class="fa-solid fa-list"></i>Agent Accounts</a>
            <ul>
            <li><Link to="/agent-float-account">Float A/C</Link></li>
             <li><Link to="/agent-commission-account">Commission A/C</Link></li>
            </ul>
          </li>
          <li><a href="#"><i class="fa-solid fa-sliders"></i>Settings</a></li>
          <li><Link  to="/sign-in" ><i class="fa-solid fa-toggle-off"></i>Sign Out</Link></li>
        
        </ul>
      </div>
    </div>
   

    <div class="page-content-wrapper">
    
      <div class="container">
      <br/>
      <div class="section-heading d-flex align-items-center justify-content-between dir-rtl">
   
            <h6><Link class="btn p-0" to="/"><i class="ms-1 fa-solid fa-arrow-left-long"></i> Back</Link></h6>{/*<a class="btn p-0" href="#">More<i class="ms-1 fa-solid fa-arrow-right-long"></i></a>*/}
          </div>
      <div class="discount-coupon-card-blue p-4 p-lg-5 dir-rtl">
          <div class="d-flex align-items-center">
            <div class="discountIcon"><img class="w-100" src="assets/img/core-img/icon-ddn-72-w.png" alt=""/></div>
            <div class="text-content">
              <h4 class="text-white mb-1">Agent Commission A/C</h4>
              <p class="text-white mb-0">Available Balance: <b style={{fontSize:20}}>{formattedBalanceComAccount}</b><span class="px-1 fw-bold"></span><b style={{fontSize:20}}></b></p>
            </div>
          </div>
        </div>
       
      </div>


      <div class="weekly-best-seller-area py-3">
        <div class="container">
          <div class="section-heading d-flex align-items-center justify-content-between dir-rtl">
            <h6>Agents Transactions</h6>
            
            <a class="btn p-0" onClick={viewFloatAccountInfo}>
               View All<i class="ms-1 fa-solid fa-arrow-right-long"></i></a>
          </div>
          <div class="row g-2">
           {
                 agentAccountTransactions.map((transaction,index)=>{

                

                  return(
                    <div class="col-12">
                    <div class="horizontal-product-card">
                      <div class="d-flex align-items-center">
                        <div class="product-thumbnail-side">
                         <a class="product-thumbnail shadow-sm d-block" href="#"><i class="fa-solid fa-list"></i><img src="assets/img/core-img/icon-ddn-72-w.png" alt=""/></a>
                        </div>
                        <div class="product-description">
                         <a class="wishlist-btn" href="#"><img src="assets/img/core-img/ticker.png" alt=""/></a>
                         <a class="product-title d-block" href="#">{transaction.description}</a>
                          
                          <p class="sale-price"><i class="fa-solid"></i>{transaction.processDate.substring(0,20)}<span></span></p>
                          
                          <div class="product-rating"><i class="fa-solid fa-star"></i>TX:{transaction.id}<span class="ms-1" style={{color:'red'}}><b>{transaction.formattedAmount}</b></span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                   ) 

                 })
           }
      
            
           
         
           
           
          

       
       
         
          </div>
        </div>
      </div>
  
 
    </div>
    
    <div class="internet-connection-status" id="internetStatus"></div>

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
    

        </div>
    )


}