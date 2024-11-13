import DeleteOrderConfirmationDialog from "@/app/[locale]/dashboard/orders/components/DeleteOrderConfirmationDialog";
import OrdersMainContent from "@/app/[locale]/dashboard/orders/components/OrderMainContent";
import { setRequestLocale } from "next-intl/server";

export default async function OrdersLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	setRequestLocale(locale);

	return (
		<div className={"relative flex flex-1 overflow-hidden"}>
			<DeleteOrderConfirmationDialog />
			<OrdersMainContent>{children}</OrdersMainContent>

			{/* <OrderSidebar /> */}
		</div>
	);
}
