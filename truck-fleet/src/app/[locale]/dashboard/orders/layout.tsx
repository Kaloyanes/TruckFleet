import DeleteOrderConfirmationDialog from "@/components/orders/delete-confirmation-dialog";
import OrdersMainContent from "@/components/orders/main-content";
import OrderSidebar from "@/components/orders/order-sidebar";
import DeleteOrderContextProvider, {
	DeleteOrderContext,
} from "@/context/orders/order-delete-context";
import EditOrderContextProvider from "@/context/orders/order-edit-context";
import OrderSelectedContextProvider from "@/context/orders/order-selected-context";
import { unstable_setRequestLocale } from "next-intl/server";

export default function OrdersLayout({
	children,
	params: { locale },
}: { children: React.ReactNode; params: { locale: string } }) {
	unstable_setRequestLocale(locale);

	return (
		<OrderSelectedContextProvider>
			<EditOrderContextProvider>
				<DeleteOrderContextProvider>
					<DeleteOrderConfirmationDialog />
					<div className={"relative py-2 pr-2 flex overflow-hidden flex-1"}>
						<OrdersMainContent>{children}</OrdersMainContent>

						<OrderSidebar />
					</div>
				</DeleteOrderContextProvider>
			</EditOrderContextProvider>
		</OrderSelectedContextProvider>
	);
}
