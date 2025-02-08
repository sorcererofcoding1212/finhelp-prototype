import ToastWrapper from "@/context/ToastWrapper";
import React from "react";

const AccountsLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  return (
    <>
      <ToastWrapper>{children}</ToastWrapper>
    </>
  );
};

export default AccountsLayout;
