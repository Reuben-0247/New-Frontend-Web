import React, { Suspense } from "react";
import PaymentVerification from "./PaymentVerification";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentVerification />
    </Suspense>
  );
};

export default Page;
