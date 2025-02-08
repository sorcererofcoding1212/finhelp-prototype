import PageLoader from "@/components/PageLoader";
import React from "react";

const AccountLoading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <PageLoader />
    </div>
  );
};

export default AccountLoading;
