"use client";

import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

const ToastWrapper = ({ children }: { children: Readonly<ReactNode> }) => {
  return (
    <div>
      <ToastContainer position="top-center" />
      {children}
    </div>
  );
};

export default ToastWrapper;
