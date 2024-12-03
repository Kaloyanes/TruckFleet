import LoginRedirect from "@/components/redirects/LoginRedirect";
import { Spinner } from "@/components/ui/loading-spinner";
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
        params: { locale: string };
    }>
) {
    const params = await props.params;

    const {
        locale
    } = params;

    const {
        children
    } = props;

    setRequestLocale(locale);

    return (
		<>
			<Suspense fallback={<Spinner />}>
				<LoginRedirect />
			</Suspense>
			<section>{children}</section>
		</>
	);
}
