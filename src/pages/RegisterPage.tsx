
import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import Breadcrumb from "@/components/layout/Breadcrumb";

const RegisterPage = () => {
  return (
    <div className="container max-w-lg py-8 md:py-12">
      <Breadcrumb items={[{ label: "Register" }]} />
      <div className="flex flex-col items-center justify-center">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
