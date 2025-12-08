import AuthenticationForm from "@/app/components/_auths/AuthenticationForm";
const page = () => {
  return (
    <div className="h-screen p-6 mx-auto flex flex-col gap-4">
      <AuthenticationForm />
    </div>
  );
};

export default page;
