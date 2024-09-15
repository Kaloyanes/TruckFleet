import DeleteOrderConfirmationDialog from "@/components/orders/DeleteOrderConfirmationDialog";
import OrdersMainContent from "@/components/orders/OrderMainContent";
import OrderSidebar from "@/components/orders/OrderSidebar";
import DeleteOrderContextProvider, {
	DeleteOrderContext,
} from "@/context/orders/order-delete-context";
import EditOrderContextProvider from "@/context/orders/order-edit-context";
import OrderSelectedContextProvider from "@/context/orders/order-selected-context";
import { unstable_setRequestLocale } from "next-intl/server";
import { APIProvider } from "@vis.gl/react-google-maps";

export default function OrdersLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	return (
		<OrderSelectedContextProvider>
			<EditOrderContextProvider>
				<DeleteOrderContextProvider>
					<DeleteOrderConfirmationDialog />
					<div className={"relative  flex overflow-hidden flex-1"}>
						<OrdersMainContent>{children}</OrdersMainContent>

						<OrderSidebar />
					</div>
				</DeleteOrderContextProvider>
			</EditOrderContextProvider>
		</OrderSelectedContextProvider>
	);
}
