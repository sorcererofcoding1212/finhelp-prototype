import PageLoader from "@/components/PageLoader";
import React from "react";

const BalanceLoading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <PageLoader />
    </div>
  );
};

export default BalanceLoading;
