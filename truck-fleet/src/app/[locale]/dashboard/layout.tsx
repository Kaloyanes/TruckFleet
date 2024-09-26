import DashboardSidebar from "@/app/[locale]/dashboard/components/dashboard-sidebar";
import AuthRedirect from "@/components/redirects/AuthRedirect";
import { unstable_setRequestLocale } from "next-intl/server";

export default function DashboardLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	return (
		<>
			<AuthRedirect />
			<div className="relative flex h-screen max-h-screen max-w-[100vw] ">
				<DashboardSidebar />

				{/* <Animated>{children}</Animated> */}
				{children}
			</div>
		</>
	);
}
