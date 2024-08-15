import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import AuthRedirect from "@/components/redirects/auth-redirect";
import { SidebarProvider } from "@/components/ui/sidebar";
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
			<div className="flex relative h-screen max-h-screen max-w-[100vw] ">
				<DashboardSidebar />

				<OrderSelectedContextProvider>
					{/* <Animated>{children}</Animated> */}
					{children}
				</OrderSelectedContextProvider>
			</div>
		</>
	);
}