import DashboardSidebar from "@/app/[locale]/dashboard/components/DashboardSidebar";
import AuthRedirect from "@/components/redirects/AuthRedirect";
import { SidebarProvider } from "@/components/ui/sidebar";
import { setRequestLocale } from "next-intl/server";
import { cookies } from "next/headers";

export default async function DashboardLayout(props: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const params = await props.params;

	const { locale } = params;

	const { children } = props;

	setRequestLocale(locale);

	const sidebarState = (await cookies()).get("sidebar:state");

	let defaultOpen = true;
	if (sidebarState) {
		defaultOpen = sidebarState.value !== "true";
	}

	return (
		<>
			<AuthRedirect />
			<SidebarProvider
				defaultOpen={defaultOpen}
				style={
					{
						"--sidebar-width": "15rem",
						"--sidebar-width-mobile": "20rem",
					} as React.CSSProperties
				}
				className="relative flex h-screen max-h-screen max-w-[100vw] "
			>
				<DashboardSidebar />

				{/* <Animated>{children}</Animated> */}
				{children}
			</SidebarProvider>
		</>
	);
}
