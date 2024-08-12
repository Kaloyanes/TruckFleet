import TimeTitle from "@/components/orders/time-title";
import TruckTabs from "@/components/orders/truck-tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function OrdersLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="px-4 py-2 w-full flex gap-4 relative">
			<Card className="flex-1 bg-transparent backdrop-blur-lg backdrop-saturate-150">
				<CardHeader>
					<TimeTitle />
					<TruckTabs />
				</CardHeader>
				<CardContent>{children}</CardContent>
			</Card>

			<Card className="flex-[0.4] bg-transparent backdrop-blur-lg backdrop-saturate-150">
				<CardHeader>
					<h1>Orders</h1>
				</CardHeader>
			</Card>
			<circle className="absolute left-[75%] top-[20%] -z-10  aspect-square w-3/4 -translate-x-1/2 rounded-full bg-accent blur-[200px] sm:w-1/2 lg:top-[30%]" />
		</div>
	);
}
