"use client";

import React from "react";
import { signUpSchema } from "@/lib/Validations";
import AuthForm from "@/components/AuthForm";

const Page = () => (
  <AuthForm
    type={"SIGN_UP"}
    schema={signUpSchema}
    defaultValues={{
      email: "",
      password: "",
      fullName: "",
      universityId: 0,
      universityCard: "",
    }}
    onSubmit={() => {}}
  />
);

export default Page;
