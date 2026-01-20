/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import styled from "styled-components";

const Reciept: React.FC<{ resData: any }> = ({ resData }) => {
  function formatNaira(amount: number) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <div className="reciept">
      <div className="payment-slip sans dark:text-dark">
        <img className="backdrop-logo" src="/svgs/Fero_logo_dark.svg" alt="" />
        <div className="inner-page">
          <img className="logo" src="/svgs/Fero_logo_dark.svg" alt="" />

          <p className="p mb-1">Fero your choice of streaming software</p>
          <p className="transcript">
            Your{" "}
            <strong className="strong">
              {resData?.data?.subscription?.cycle}{" "}
              {resData?.data?.payment.metadata?.paymentPlan}
            </strong>{" "}
            Subscription Payment Slip
          </p>
          <div className="receipt-status">
            <div className="details">
              <ul className="details_info">
                <li>
                  <span>Firs Name:</span>
                  {resData?.data?.user.firstName}
                </li>
                <li>
                  <span>Last Name:</span>
                  {resData?.data?.user?.lastName}
                </li>

                <li>
                  <span> Email:</span>
                  {resData?.data?.user.email}
                </li>

                <li>
                  <span>Amount Paid:</span>
                  {formatNaira(resData?.data?.payment?.amount | 0)}
                </li>

                <li>
                  <span>Payment plan:</span>
                  {resData?.data?.payment.metadata?.paymentPlan.toUpperCase()}
                </li>
                <li>
                  <span>Payment cycle: </span>
                  {resData?.data?.subscription?.cycle.toUpperCase()}
                </li>
                <li>
                  <span>Subscribed At:</span>
                  {new Date(
                    resData?.data?.subscription?.periodStart,
                  ).toLocaleDateString()}
                </li>

                <li>
                  <span>Subscription end Date:</span>
                  {new Date(
                    resData?.data?.subscription?.periodEnd,
                  ).toLocaleDateString()}
                </li>
                <li>
                  <span>Transaction Id </span>
                  {resData?.data?.payment?.transactionId}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reciept;

const ReceiptStyles = styled.div`
  @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap");

  /* -----------------------------------STYLES----------------------------------- */

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  /* font-family: "DM Sans"; */
  /* font-family: "Open Sans"; */
  /* font-family: "Ubuntu"; */
  ul {
    list-style: none;
    /* padding-left: 0; */
  }
  .dotted_line {
    border: 1px dashed #000e1c;
    margin-block: 1rem;
    width: 100%;
  }
  .payment-slip {
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 23.6cm;
    min-height: 20.7cm;
    padding: 2cm;
    margin: auto;
    border-radius: 5px;
    background: white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    /* font-size: 12px; */

    .backdrop-logo {
      height: 50vh;
      transform: rotate(-40deg);
    }
    .inner-page {
      position: absolute;
      border-radius: 10px;

      width: 100%;
      height: 100%;
      padding: 1cm;
      background-color: #ffffffef;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      align-items: center;
      color: #000e1c;
      padding: 3rem;
      font-size: 17px;
      .logo {
        height: 7vh;

        &_receipt {
          height: 10vh;
        }
      }

      .header {
        font-weight: 600;
        font-size: 26px;
        margin: 0;
        color: #000e1c;
      }
      .p {
        color: #0093dd;
        font-weight: 400;
        font-size: 18px;
      }
      .transcript {
        font-size: 26px;
        color: #000e1c;
      }
      .strong {
        text-decoration: underline;
      }
      .receipt {
        &_details {
          width: 90%;
        }
        &-status {
          width: 100%;
        }
      }
      .details {
        /* margin-left: 2rem; */
        margin-top: 3rem;
        font-size: 18px;
        font-weight: 700;
        &_info {
          padding: 0 3cm;
          display: grid;
          gap: 0.5rem;
          & > li {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            span {
              min-width: 20rem;
            }
          }
        }
      }
      .mt-5 {
        width: 90%;
        text-align: center;
        font-weight: 500;
      }

      /* PAYMENT-RECEIPTS STYLES */

      .date-sn {
        width: 90%;
        display: flex;
        justify-content: space-between;
        font-size: 1.2rem;
      }
    }
    &-bottom {
      margin-block: 1.5rem 0;
      height: max-content;
      table {
        font-size: 18px;
        margin-top: 1rem;
        width: 100%;
        th {
          padding: 0 10px 0 0;
          text-align: start;
        }
        td {
          padding: 0 0 5px 0;
        }
      }

      .footer {
        width: 100%;
        margin-top: 6rem;
        display: flex;
        justify-content: flex-end;
        .footer-item {
          padding: 2px 2rem;
          border-top: 1px solid #000e1c;
          font-size: 16px;
        }
      }
    }
  }
`;
