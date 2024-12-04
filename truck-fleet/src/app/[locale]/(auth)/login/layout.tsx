import LoginRedirect from "@/components/redirects/LoginRedirect";
import { Spinner } from "@/components/ui/loading-spinner";
import { useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next/types";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Login",
	description: "Login page for the app.",
};

export default async function LoginLayout(
	props: Readonly<{
		children: React.ReactNode;
	}>,
) {
	const { children } = await props;
	const locale = useLocale();

	setRequestLocale(locale);

	return (
		<>
			<LoginRedirect />
			<section>{children}</section>
		</>
	);
}
