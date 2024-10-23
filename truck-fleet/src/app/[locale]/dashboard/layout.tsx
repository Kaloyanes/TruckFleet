import DashboardSidebar from "@/app/[locale]/dashboard/components/DashboardSidebar";
import AuthRedirect from "@/components/redirects/AuthRedirect";
import { SidebarProvider } from "@/components/ui/sidebar";
import { unstable_setRequestLocale } from "next-intl/server";

export default async function DashboardLayout(
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
			<AuthRedirect />
			<SidebarProvider
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
