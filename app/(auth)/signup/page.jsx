import SignUp from "@/components/auth/SignUp";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
};

export default Page;
