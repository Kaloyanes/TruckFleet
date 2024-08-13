import LoginForm from "@/components/login/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { TruckIcon } from "lucide-react";

export default function Login() {
	return (
		<>
			<div className="absolute top-5 right-5">
				<ThemeToggle />
			</div>
			<div className="flex max-h-screen h-screen   z-10  ">
				<div className="flex-1 bg-accent max-w-[50vw] lg:block hidden relative">
					<div className="absolute top-10 left-10 gap-2 items-center flex text-white ">
						<TruckIcon />
						<h1 className="text-xl font-bold">Truck Fleet</h1>
					</div>
				</div>
				<div className="flex-1 relative p-20 xl:p-52 flex flex-col items-center lg:max-w-[50vw] justify-center gap-10 bg-dot-white/20">
					{/* Mask fade */}
					<div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
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
