import LoginRedirect from "@/components/redirects/LoginRedirect";
import { unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
	title: "Login",
	description: "Login page for the app.",
};

export default async function LoginLayout(
    props: {
        children: React.ReactNode;
        params: Promise<{ locale: string }>;
    }
) {
    const params = await props.params;

    const {
        locale
    } = params;

    const {
        children
    } = props;

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
