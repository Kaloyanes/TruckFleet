import { use } from "react";
import LoginForm from "@/app/[locale]/(auth)/login/components/LoginForm";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { IconPackages } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
// fkoskfo
export default function Login(props: { params: Promise<{ locale: string }> }) {
    const params = use(props.params);

    const {
        locale
    } = params;

    unstable_setRequestLocale(locale);

    const t = useTranslations("LoginPage");
    return (
		<>
			<div className="absolute top-5 right-5 z-50">
				<ThemeToggle />
			</div>
			<div className="z-10 flex h-screen max-h-screen ">
				<div className="relative hidden max-w-[50vw] flex-1 bg-dot-black/15 lg:block dark:bg-dot-white/15">
					<div className="absolute top-10 left-10 gap-2 items-center flex dark:text-white ">
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
							<IconPackages className="size-6" />
						</div>
						<div className="grid flex-1 text-left text-lg leading-tight">
							<span className="truncate font-semibold">Truck Fleet</span>
						</div>
					</div>
				</div>

				<div className="relative flex flex-1 flex-col items-center justify-center gap-10 bg-background p-20 lg:max-w-[50vw] xl:p-52">
					{/* Mask fade */}
					<div className="space-y-2 text-center">
						<h1 className="font-sans text-3xl font-semibold capitalize">
							{t("welcome_back")}
						</h1>
						<h3 className="font-sans text-lg text-neutral-600 dark:text-neutral-400">
							{t("welcome_description")}
						</h3>
					</div>
					<LoginForm />
				</div>
			</div>
		</>
	);
}
