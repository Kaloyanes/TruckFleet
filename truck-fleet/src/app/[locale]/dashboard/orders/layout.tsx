import OrdersMainContent from "@/components/orders/main-content";
import OrderSidebar from "@/components/orders/order-sidebar";
import { unstable_setRequestLocale } from "next-intl/server";

export default function OrdersLayout({
	children,
	params: { locale },
}: { children: React.ReactNode; params: { locale: string } }) {
	unstable_setRequestLocale(locale);

	return (
		<div className={"relative py-2 pr-2 flex overflow-hidden flex-1"}>
			<OrdersMainContent>{children}</OrdersMainContent>

			<OrderSidebar />
		</div>
	);
}
