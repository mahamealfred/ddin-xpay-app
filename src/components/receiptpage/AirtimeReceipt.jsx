import React, { useContext, useRef, useState } from 'react'
import "./receipt.css"
import { Button } from "@progress/kendo-react-buttons";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import HeaderPage from "../header/HeaderPage";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { Context } from "../Wrapper";
import $ from "jquery";
import ReactToPrint from "react-to-print";
import FooterPage from "../footer/FooterPage";
const AirtimeReceipt = () => {
    const context = useContext(Context);
  const [agentAccountTransactions, setAgentAccountTransactions] = useState([]);
  const { state } = useLocation();
  const [balance, setbalance] = useState("Rwf 0.00");
  const [formattedBalance, setFormattedBalance] = useState("Rwf 0.00");
  const pdfExportComponent = useRef(null);
  const handleExportWithComponent = (event) => {
    pdfExportComponent.current.save();
  };
// Function to print the component as PDF
const printAsPDF = () => {
    window.print();
};

// Function to print the component on a printer
const printOnPrinter = () => {
    // Implement logic to print on a printer
    alert('Printing on printer...');
};
  return (
    <>
       <HeaderPage />

       <div class="page-content-wrapper">
        <div class="container">
          <br />
          <div class="section-heading d-flex align-items-center justify-content-between dir-rtl">
            <h6>
              <Link class="btn p-0" to="/bulksms-service">
                <i class="ms-1 fa-solid fa-arrow-left-long text-white"></i> Back
              </Link>
            </h6>
            {/*<a class="btn p-0" href="#">More<i class="ms-1 fa-solid fa-arrow-right-long"></i></a>*/}
          </div>
          <div class="row justify-content-center">
            <div class="col-12 col-lg-12">
              <div>
                <div className="box wide hidden-on-narrow"
               // style={{ backgroundColor: "white" }}
                >
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
       <div className="my-5 page" size="A4">
            <div className="p-5">
                <section className="top-content bb d-flex justify-content-between">
                    <div className="logo">
                        <img src="assets/img/core-img/icon-ddn-72-w.png" alt="" className="img-fluid"/>
                    </div>
                    <div className="col-5">
                     <h2>Airtime Receipt</h2>  
                    </div>
                    <div className="top-left">
                        <div className="graphic-path">
                            <p>Receipt</p>
                        </div>
                        <div className="position-relative">
                            <p>Receipt No. <span>{state?.transactionData?.id}</span></p>
                        </div>
                    </div>
                   
                </section>

                <div className="store-user mt-5">
                    <div className="col-10">
                        <div className="row bb pb-3">
                            <div className="col-7">
                                <p>Company,</p>
                                <h2>DDIN Ltd</h2>
                                <p className="address"> kn 78 st, <br/> Norrsken House, <br/> Kigali</p>
                                <div className="txn mt-2">TXN: XXXXXXX</div>
                            </div>
                            <div className="col-5">
                                <p>Agent,</p>
                                <h2>{context.agentFullName}</h2>
                                <p className="address"> 777 Brockton Avenue, <br/> Abington MA 2351, <br/>Vestavia Hills AL </p>
                                <div className="txn mt-2">TXN: XXXXXXX</div>
                            </div>
                        </div>
                        <div className="row extra-info pt-3">
                            <div className="col-7">
                                <p>Payment Method: <span>Cash</span></p>
                                <p>Transaction Number: <span>{state?.transactionData?.id}</span></p>
                            </div>
                            <div className="col-5">
                                <p>Date: <span> {state?.transactionData?.processDate}</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="product-area mt-4">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <td>Item</td>
                                {/* <td>Price</td> */}
                                <td>Details</td>
                                {/* <td>Total</td> */}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="media">
                                        {/* <img className="mr-3 img-fluid" src="mobile.jpg" alt="Product 01"/> */}
                                        <div className="media-body">
                                            <p className="mt-0 title">Description</p>
                                            {/* Cras sit amet nibh libero, in gravida nulla. */}
                                        </div>
                                    </div>
                                </td>
                                {/* <td>200$</td> */}
                                <td>  {state?.transactionData?.description}</td>
                                {/* <td>200$</td> */}
                            </tr>
                            <tr>
                                <td>
                                    <div className="media">
                                        {/* <img className="mr-3 img-fluid" src="mobile-2.jpg" alt="Product 01"/> */}
                                        <div className="media-body">
                                            <p className="mt-0 title">Media heading</p>
                                            Cras sit amet nibh libero, in gravida nulla.
                                        </div>
                                    </div>
                                </td>
                                {/* <td>300$</td> */}
                                <td>
                                Cras sit amet nibh libero, in gravida nulla.   Cras sit amet nibh libero, in gravida nulla.
                                Cras sit amet nibh libero, in gravida nulla.
                                </td>
                                {/* <td>600$</td> */}
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section className="balance-info">
                    <div className="row">
                        <div className="col-8">
                            <p className="m-0 font-weight-bold"> Note: </p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. In delectus, adipisci vero est dolore praesentium.</p>
                        </div>
                        <div className="col-4">
                            <table className="table border-0 table-hover">
                                <tr>
                                    <td>Sub Total:</td>
                                    <td>{(
                                  parseFloat(state?.transactionData?.amount) +
                                  parseFloat(state?.transactionData?.amount) /
                                    16.24
                                ).toFixed()}</td>
                                </tr>
                                <tr>
                                    <td>Tax:</td>
                                    <td>0</td>
                                </tr>
                                <tr>
                                    <td>Deliver:</td>
                                    <td>0</td>
                                </tr>
                                <tfoot>
                                    <tr>
                                        <td>Total:</td>
                                        <td>{(
                                  parseFloat(state?.transactionData?.amount) +
                                  parseFloat(state?.transactionData?.amount) /
                                    16.24
                                ).toFixed()}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            <div className="col-12">
                                {/* <img src="assets/img/core-img/icon-ddn-72-w.png" className="img-fluid" alt=""/> */}
                                <p className="text-center m-0"></p>
                            </div>
                        </div>
                    </div>
                </section>

                <img src="cart.jpg" className="img-fluid cart-bg" alt=""/>

                <footer>
                    <hr/>
                    {/* <p className="m-0 text-center">
                        View This Receipt Online At - <a href="#!"> invoice/saburbd.com/#868 </a>
                    </p> */}
                    <div className="social pt-3">
                        <span className="pr-2">
                            <i className="fas fa-mobile-alt"></i>
                            <span>+250 783 038 641</span>
                        </span>
                        <span className="pr-2">
                            <i className="fas fa-envelope"></i>
                            <span>contacts@ddin.rw</span>
                        </span>
                        {/* <span className="pr-2">
                            <i className="fab fa-facebook-f"></i>
                            <span>/sabur.7264</span>
                        </span>
                        <span className="pr-2">
                            <i className="fab fa-youtube"></i>
                            <span>/abdussabur</span>
                        </span>
                        <span className="pr-2">
                            <i className="fab fa-github"></i>
                            <span>/example</span>
                        </span> */}
                    </div>
                </footer>
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
   
    </>
  )
}

export default AirtimeReceipt