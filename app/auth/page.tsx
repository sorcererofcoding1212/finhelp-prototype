import React from "react";
import Form from "./components/Form";

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        <div>
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-700">
            FinHelp Signin
          </h1>
        </div>
        <Form />
      </div>
    </div>
  );
};

export default AuthPage;
