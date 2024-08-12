import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import AuthRedirect from "@/components/redirects/auth-redirect";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<AuthRedirect />
			<div className="flex flex-col md:flex-row w-full flex-1 mx-auto overflow-hidden h-screen">
				<DashboardSidebar />

				<section className="w-full flex flex-1">
					{/* <Animated>{children}</Animated> */}
					{children}
				</section>
			</div>
			<div className="absolute top-5 right-5">
				<ThemeToggle />
			</div>
		</>
	);
}
