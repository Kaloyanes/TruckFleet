import SignOutButton from "@/app/[locale]/dashboard/components/SignOutButton";
import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";
import { OrderSelectedProvider } from "@/context/orders/order-selected-context";
import DashboardSidebar from "./components/DashboardSidebar";
import OrderSidebar from "./orders/components/OrderSidebar";

export default async function DashboardPage({
	params: { locale },
}: {
	params: { locale: string };
}) {
	setRequestLocale(locale);
	return (
		<OrderSelectedProvider>
			<DashboardSidebar />
			<OrderSidebar />
			<div className="flex h-20 w-20">
				<h1>Dashboard Page</h1>
				<SignOutButton />
			</div>
		</OrderSelectedProvider>
	);
}
