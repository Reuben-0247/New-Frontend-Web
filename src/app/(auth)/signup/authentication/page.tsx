import AuthenticationForm from "@/app/components/_auths/AuthenticationForm";
import { Suspense } from "react";
const page = () => {
  return (
    <div className="h-max p-4 mt-8 mx-auto flex flex-col gap-4 shadow-xl  rounded-md">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthenticationForm />
      </Suspense>
    </div>
  );
};

export default page;
