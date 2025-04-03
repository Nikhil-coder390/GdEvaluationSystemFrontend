
import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import Breadcrumb from "@/components/layout/Breadcrumb";

const LoginPage = () => {
  return (
    <div className="container max-w-md py-8 md:py-12">
      <Breadcrumb items={[{ label: "Login" }]} />
      <div className="flex flex-col items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
