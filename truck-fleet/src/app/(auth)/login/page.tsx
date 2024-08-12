import LoginForm from "@/components/login/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { TruckIcon } from "lucide-react";

export default function Login() {
	return (
		<>
			<div className="absolute top-5 right-5">
				<ThemeToggle />
			</div>
			<div className="flex max-h-screen h-screen lg:divide-x-2 dark:divide-white z-10  ">
				<div className="flex-1 bg-[#151515] max-w-[50vw] lg:block hidden relative">
					<div className="absolute top-10 left-10 gap-2 items-center flex text-white ">
						<TruckIcon />
						<h1 className="text-xl font-bold">Truck Fleet</h1>
					</div>
				</div>
				<div className="flex-1 p-20 xl:p-52 flex flex-col items-center lg:max-w-[50vw] justify-center gap-10 dark:bg-[#09090b]">
					<div className="space-y-2 text-center">
						<h1 className="text-4xl font-sans capitalize">
							Welcome Back to Truck Fleet
						</h1>
						<h3 className="text-lg font-sans text-neutral-400">
							Enter your username and password to continue
						</h3>
					</div>
					<LoginForm />
				</div>
			</div>
		</>
	);
}
