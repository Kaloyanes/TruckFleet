import LoginForm from "@/components/login/login-form";
import { ThemeToggle } from "@/components/settings/theme-toggle";
import { TruckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Login({
	params: { locale },
}: { params: { locale: string } }) {
	unstable_setRequestLocale(locale);

	const t = useTranslations("LoginPage");

	return (
		<>
			<div className="absolute top-5 right-5 z-50">
				<ThemeToggle />
			</div>
			<div className="flex max-h-screen h-screen   z-10  ">
				<div className="flex-1 bg-dot-white/10 max-w-[50vw] lg:block hidden relative">
					<div className="absolute top-10 left-10 gap-2 items-center flex text-white ">
						<TruckIcon />
						<h1 className="text-xl font-bold">Truck Fleet</h1>
					</div>
				</div>

				<div className="flex-1 relative p-20 xl:p-52 flex flex-col items-center lg:max-w-[50vw] bg-background justify-center gap-10">
					{/* Mask fade */}
					<div className="space-y-2 text-center">
						<h1 className="text-3xl font-sans capitalize">
							{t("welcome_back")}
						</h1>
						<h3 className="text-lg font-sans text-neutral-400">
							{t("welcome_description")}
						</h3>
					</div>
					<LoginForm />
				</div>
			</div>
		</>
	);
}
