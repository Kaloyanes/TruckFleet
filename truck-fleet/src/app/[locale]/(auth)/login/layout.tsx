import LoginRedirect from "@/components/redirects/login-redirect";
import { unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
	title: "Login",
	description: "Login page for the app.",
};

export default function LoginLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	return (
		<>
			<div className="z-100">
				<LoginRedirect />
			</div>
			<section>{children}</section>
		</>
	);
}
