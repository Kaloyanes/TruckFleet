import AnimatedTabs from "@/components/AnimatedTabs";
import AnimatedBackground from "@/components/ui/animated-background";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { motion, useInView, type Variants } from "motion/react";
import type React from "react";
import { useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import {
	IconApi,
	IconChartBar,
	IconCheck,
	IconGps,
	IconHeadset,
	IconMail,
	IconShield,
	IconSend,
	IconTruck,
	IconUsers,
	type IconProps,
	type Icon,
} from "@tabler/icons-react";

interface Feature {
	label: string;
	icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
}

interface BasePlan {
	name: string;
	features: Feature[];
}

interface FixedPricePlan extends BasePlan {
	price: number;
}

interface MediumFleetPlan extends BasePlan {
	basePrice: number;
	pricePerTruck: number;
	minTrucks: number;
	maxTrucks: number;
}

interface EnterprisePlan extends BasePlan {
	price: "Custom";
}

type PricingPlan = FixedPricePlan | MediumFleetPlan | EnterprisePlan;

const tabs = [
	{
		label: "Monthly",
		value: "monthly",
	},
	{
		label: "Annual",
		value: "annual",
	},
];

const pricingPlans: PricingPlan[] = [
	{
		name: "Starter Pack",
		price: 50,
		features: [
			{ label: "Access to core features", icon: IconCheck },
			{ label: "Up to 10 trucks", icon: IconTruck },
			{ label: "Basic fleet management", icon: IconTruck },
			{ label: "Limited reports & analytics", icon: IconChartBar },
			{ label: "Email support", icon: IconMail },
		],
	},
	{
		name: "Medium Fleet",
		basePrice: 200,
		pricePerTruck: 10,
		minTrucks: 11,
		maxTrucks: 250,
		features: [
			{ label: "Everything in Starter Pack", icon: IconCheck },
			{ label: "Real-time GPS tracking", icon: IconGps },
			{ label: "Automated dispatching", icon: IconSend },
			{ label: "Multi-user access", icon: IconUsers },
			{ label: "API access & integrations", icon: IconApi },
			{ label: "Advanced analytics", icon: IconChartBar },
		],
	},
	{
		name: "Enterprise",
		price: "Custom",
		features: [
			{ label: "Unlimited trucks", icon: IconTruck },
			{ label: "Custom integrations", icon: IconApi },
			{ label: "Dedicated support team", icon: IconHeadset },
			{ label: "Custom reporting", icon: IconChartBar },
			{ label: "SLA guarantees", icon: IconShield },
		],
	},
];

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
	visible: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		transition: {
			type: "spring",
			stiffness: 260,
			damping: 20,
		},
	},
};

export default function Pricing() {
	const pricingRef = useRef<HTMLDivElement>(null);
	const inView = useInView(pricingRef, {
		initial: false,
		amount: 0.6,
		margin: "0px 0px -10% 0px",
	});
	const [selectedPricing, setSelectedPricing] = useState("monthly");
	const [selectedTrucks, setSelectedTrucks] = useState(11);

	const calculateMediumFleetPrice = () => {
		const mediumPlan = pricingPlans[1] as MediumFleetPlan;
		return (
			mediumPlan.basePrice +
			(selectedTrucks - mediumPlan.minTrucks) * mediumPlan.pricePerTruck
		);
	};

	const isMediumFleetPlan = (plan: PricingPlan): plan is MediumFleetPlan => {
		return plan.name === "Medium Fleet";
	};

	const handleSliderChange = (value: number[]) => {
		setSelectedTrucks(value[0]);
	};

	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{
				once: true,
				margin: "0px 0px 100px 0px",
				amount: 0.7,
			}}
			transition={{
				staggerChildren: 0.07,
			}}
			className="mx-auto flex max-w-8xl flex-col gap-10 px-4"
		>
			<motion.h3
				variants={itemVariants}
				id="pricing"
				className="scroll-mt-36 text-center font-medium text-lg text-primary uppercase tracking-wide"
			>
				Pricing
			</motion.h3>
			<motion.h1
				variants={itemVariants}
				className="text-center text-4xl tracking-tight sm:text-5xl"
			>
				Pricing that <span className="font-bold text-primary">moves</span> with
				you
			</motion.h1>
			<motion.div
				variants={itemVariants}
				className="mx-auto flex flex-row justify-center gap-2 rounded-full border border-secondary bg-secondary/25"
			>
				<AnimatedBackground
					transition={{
						type: "spring",
						mass: 0.3,
						stiffness: 100,
						damping: 10,
					}}
					defaultValue={selectedPricing}
					onValueChange={(value) => {
						if (value) setSelectedPricing(value);
					}}
					enableHover
					className="rounded-full bg-secondary"
				>
					{tabs.map((tab) => (
						<Button
							data-id={tab.value}
							type="button"
							key={tab.value}
							variant={"ghost"}
							className={`hover:!bg-secondary/50 flex flex-col items-center justify-center px-2 py-1 text-muted-foreground capitalize duration-300 hover:text-foreground ${tab.value === selectedPricing ? "bg-secondary/50 text-foreground" : ""} rounded-full`}
						>
							{tab.label}
						</Button>
					))}
				</AnimatedBackground>
			</motion.div>
			<motion.div
				ref={pricingRef}
				className={cn(
					"grid w-full grid-cols-1 gap-6 transition-all duration-500 ease-in-out-quad md:grid-cols-3",
					inView ? "gap-6" : "gap-32",
				)}
			>
				{pricingPlans.map((plan) => (
					<motion.div
						key={plan.name}
						variants={itemVariants}
						className="h-full w-full"
					>
						<Card className="relative flex h-full w-full flex-col overflow-hidden">
							<CardHeader>
								<CardTitle className="text-2xl">{plan.name}</CardTitle>
							</CardHeader>
							<CardContent className="flex h-full flex-col">
								<motion.div variants={itemVariants} className="mb-6">
									<span className="text-3xl font-bold">
										{isMediumFleetPlan(plan)
											? `$${calculateMediumFleetPrice()}`
											: plan.name === "Enterprise"
												? "Contact Us"
												: `$${(plan as FixedPricePlan).price}`}
									</span>
									{isMediumFleetPlan(plan) && (
										<div className="mt-4">
											<Slider
												min={plan.minTrucks}
												max={plan.maxTrucks}
												step={1}
												value={[selectedTrucks]}
												onValueChange={handleSliderChange}
												className="w-full"
											/>
											<div className="mt-2 text-sm text-muted-foreground">
												{selectedTrucks} trucks selected
											</div>
										</div>
									)}
								</motion.div>
								<ul className="flex-1 space-y-4">
									{plan.features.map((feature, index) => (
										<motion.li
											key={feature.label}
											variants={itemVariants}
											className="flex items-center gap-2"
										>
											<feature.icon className="h-5 w-5 text-primary" />
											<span>{feature.label}</span>
										</motion.li>
									))}
								</ul>
								<motion.div variants={itemVariants}>
									<Button
										className="mt-6 w-full"
										variant={plan.name === "Enterprise" ? "outline" : "default"}
									>
										{plan.name === "Enterprise"
											? "Contact Sales"
											: "Get Started"}
									</Button>
								</motion.div>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</motion.div>
		</motion.div>
	);
}
