import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import AuthRedirect from "@/components/redirects/auth-redirect";
import { ThemeToggle } from "@/components/theme-toggle";
import OrderSelectedContextProvider from "@/context/order-selected-context";
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
			<div className="flex flex-col md:flex-row w-full flex-1 mx-auto overflow-hidden h-screen">
				<DashboardSidebar />

				<section className="w-full flex flex-1">
					{/* <Animated>{children}</Animated> */}
					<OrderSelectedContextProvider>
						{children}
					</OrderSelectedContextProvider>
				</section>
			</div>
		</>
	);
}
