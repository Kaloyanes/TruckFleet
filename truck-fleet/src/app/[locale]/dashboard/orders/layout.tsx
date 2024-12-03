import DeleteOrderConfirmationDialog from "@/app/[locale]/dashboard/orders/components/DeleteOrderConfirmationDialog";
import OrdersMainContent from "@/app/[locale]/dashboard/orders/components/OrderMainContent";
import { setRequestLocale } from "next-intl/server";

export default async function OrdersLayout(
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

    setRequestLocale(locale);

    return (
		<div className={"relative flex flex-1 overflow-hidden"}>
			<DeleteOrderConfirmationDialog />
			<OrdersMainContent>{children}</OrdersMainContent>

			{/* <OrderSidebar /> */}
		</div>
	);
}
