import ResetPassword from "@/app/components/_auths/ResetPassword";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) => {
  const params = await searchParams;

  const email = params.email;
  return (
    <div className="md:mt-6 mt-2 shadow-xl p-1 rounded-md py-6">
      <ResetPassword email={email || ""} />
    </div>
  );
};

export default page;
