import LoginForm from "@/components/Login/LoginForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TruckIcon } from "lucide-react";

export default function Login() {
  return (
    <>
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>
      <div className="flex max-h-screen h-screen divide-x-2 dark:divide-white  ">
        <div className="flex-1 bg-[#18181b] max-w-[50vw] md:block hidden relative">
          <div className="flex absolute top-10 left-10 gap-2 items-center">
            <TruckIcon />
            <h1 className="text-xl font-bold">Truck Fleet</h1>
          </div>
        </div>
        <div className="flex-1 p-20 flex flex-col md:max-w-[50vw]  justify-center gap-10  dark:bg-[#09090b]">
          <h1 className="text-4xl font-sans ">Login into your account</h1>
          <LoginForm />
        </div>
      </div>
    </>
  );
}
