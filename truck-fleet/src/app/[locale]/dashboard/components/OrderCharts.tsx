"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartLegend,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import useCompanyId from "@/hooks/useCompanyId";
import { db } from "@/lib/Firebase";
import { useAddOrderStore } from "@/stores/Orders/AddOrderStore";
import {
	IconChartLine,
	IconMenuOrder,
	IconReceipt,
	IconReceipt2,
} from "@tabler/icons-react";
import {
	collection,
	onSnapshot,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { useStartTyping } from "react-use";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
	orders: {
		label: "Orders",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

export default function OrderCharts() {
	const [orders, setOrders] = useState<{ date: string; orders: number }[]>([]);
	const { companyId } = useCompanyId();

	useEffect(() => {
		const fetchOrders = async () => {
			const thirtyDaysAgo = new Date();
			thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

			if (!companyId) return;

			const ordersQuery = query(
				collection(db, "companies", companyId, "orders"),
				where("createdAt", ">=", thirtyDaysAgo),
				orderBy("createdAt", "asc"),
			);

			const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
				const ordersByDay = new Map();

				// Initialize last 30 days with 0 orders
				for (let i = 0; i < 30; i++) {
					const date = new Date();
					date.setDate(date.getDate() - i);
					ordersByDay.set(date.toISOString().split("T")[0], 0);
				}

				// Count orders per day
				for (const doc of snapshot.docs) {
					const orderDate = doc
						.data()
						.createdAt.toDate()
						.toISOString()
						.split("T")[0];
					ordersByDay.set(orderDate, (ordersByDay.get(orderDate) || 0) + 1);
				}

				// Convert to array format for chart
				const chartData = Array.from(ordersByDay.entries())
					.map(([date, count]) => ({
						date,
						orders: count,
					}))
					.sort(
						(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
					);

				setOrders(chartData);
			});

			return () => unsubscribe();
		};

		fetchOrders();
	}, [companyId]);

	return (
		<Card className="h-full flex-1">
			<CardHeader>
				<CardTitle>
					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<IconReceipt2 size={24} />
							<span className="text-lg font-semibold">Orders</span>
						</div>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="w-full pl-0">
				<ChartContainer config={chartConfig}>
					<LineChart
						accessibilityLayer
						data={orders}
						margin={{ top: 25, right: 5, left: -10, bottom: 5 }}
					>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<XAxis
							dataKey="date"
							tickMargin={8}
							axisLine={false}
							tickFormatter={(value) =>
								new Date(value).toLocaleDateString("en-US", {
									day: "numeric",
									month: "short",
								})
							}
						/>
						<Line
							dataKey="orders"
							type="monotoneX"
							stroke="var(--color-orders)"
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
