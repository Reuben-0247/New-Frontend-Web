import LoginComp from "@/app/components/_auths/LoginComp";

const LogInPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) => {
  const params = await searchParams;

  const token = params.token;
  return (
    <div className="md:mt-6 mt-2 shadow-xl p-1 rounded-md">
      <LoginComp token={token as string} />
    </div>
  );
};

export default LogInPage;
