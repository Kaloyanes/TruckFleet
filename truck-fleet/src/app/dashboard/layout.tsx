import Animated from "@/components/Animated";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import AuthRedirect from "@/components/redirects/AuthRedirect";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<AuthRedirect />
			<div className=" flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-950 w-full flex-1 mx-auto  overflow-hidden h-screen">
				<DashboardSidebar />

				<section className="w-full flex flex-1">
					<Animated>{children}</Animated>
				</section>
			</div>
		</>
	);
}
