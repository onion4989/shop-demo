import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/registerForm";

export default function RegisterPage() {
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  ) 
};

//export default RegisterPage;
