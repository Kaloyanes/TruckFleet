// The solution section where i show the solution to the problem
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {
	IconLayoutDashboard,
	IconMapPin,
	IconFileCheck,
	IconMessageCircle,
	IconSettingsCog,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";

const features = [
	{
		Icon: IconLayoutDashboard,
		name: "One Dashboard for Everything",
		description:
			"No more switching between platforms—manage orders, trucks, and drivers in one place.",
		href: "/",
		cta: "Learn more",
		background: (
			<div className="absolute inset-0 bg-gradient-to-b to-primary/15 from-transparent" />
		),
		className: "lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-2",
	},
	{
		Icon: IconMapPin,
		name: "Live GPS & Fuel Monitoring",
		description:
			"Track your fleet's exact location, fuel usage, and performance in real time.",
		href: "/",
		cta: "Learn more",
		background: (
			<div className="absolute inset-0 bg-gradient-to-tl to-primary/15 from-transparent" />
		),
		className: "lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-4",
	},
	{
		Icon: IconFileCheck,
		name: "Automated Order & Invoice Management",
		description:
			"Create, send, and track invoices automatically—no manual input needed.",
		href: "/",
		cta: "Learn more",
		background: (
			<div className="absolute inset-0 bg-gradient-to-bl to-primary/15 from-transparent" />
		),
		className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
	},
	{
		Icon: IconMessageCircle,
		name: "Instant Driver & Dispatcher Communication",
		description:
			"Keep drivers, dispatchers, and managers connected with real-time messaging.",
		href: "/",
		cta: "Learn more",
		background: (
			<div className="absolute inset-0 bg-gradient-to-tr to-primary/15 from-transparent" />
		),
		className: "lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3",
	},
	{
		Icon: IconSettingsCog,
		name: "Predictive Maintenance & Alerts",
		description:
			"Get automatic notifications for maintenance needs before breakdowns happen.",
		href: "/",
		cta: "Learn more",
		background: (
			<div className="absolute inset-0 bg-gradient-to-tr to-primary/15 from-transparent" />
		),
		className: "lg:col-start-1 lg:col-end-1 lg:row-start-3 lg:row-end-4",
	},
];

export default function Solution() {
	const t = useTranslations("solution");

	return (
		<div className="flex flex-col gap-10 py-20 max-w-7xl mx-auto px-4">
			<h2 className="text-center font-medium text-primary text-sm uppercase tracking-wide">
				Solution
			</h2>

			<BentoGrid className="grid-cols-1 lg:grid-cols-3 auto-rows-[minmax(15rem,auto)] ">
				{features.map((feature) => (
					<BentoCard key={feature.name} {...feature} />
				))}
			</BentoGrid>
		</div>
	);
}
