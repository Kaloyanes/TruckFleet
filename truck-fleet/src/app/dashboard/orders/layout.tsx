import OrdersMainContent from "@/components/orders/main-content";
import OrderSidebar from "@/components/orders/order-sidebar";

export default function OrdersLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className={"px-4 overflow-y-clip relative py-2 w-full flex "}>
			<OrdersMainContent>{children}</OrdersMainContent>

			<OrderSidebar />

			<circle className="absolute left-[75%] top-[20%] -z-10  aspect-square w-3/4 -translate-x-1/2 rounded-full bg-accent/75 blur-[200px] sm:w-1/2 lg:top-[30%]" />
		</div>
	);
}
