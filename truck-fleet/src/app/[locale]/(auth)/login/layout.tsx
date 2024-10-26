import LoginRedirect from "@/components/redirects/LoginRedirect";
import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
	title: "Login",
	description: "Login page for the app.",
};

export default async function LoginLayout({
	children,
	params: { locale },
}: Readonly<{
	children: React.ReactNode;
	params: { locale: string };
}>) {
	setRequestLocale(locale);

	return (
		<>
			<div className="z-100">
				<LoginRedirect />
			</div>
			<section>{children}</section>
		</>
	);
}
