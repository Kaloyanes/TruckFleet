import AnimatedTabs from "@/components/AnimatedTabs";
import AnimatedBackground from "@/components/ui/animated-background";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
	AnimatePresence,
	motion,
	useInView,
	type Variants,
} from "motion/react";
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
import NumberFlow from "@number-flow/react";
import { useTranslations } from "next-intl";

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
	price: number;
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
		label: "monthly",
		value: "monthly",
	},
	{
		label: "annual",
		value: "annual",
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
	const t = useTranslations("pricing");
	const pricingRef = useRef<HTMLDivElement>(null);
	const inView = useInView(pricingRef, {
		initial: false,
		amount: 0.6,
		margin: "0px 0px -10% 0px",
	});
	const [selectedPricing, setSelectedPricing] = useState("monthly");
	const [selectedTrucks, setSelectedTrucks] = useState(11);

	const pricingPlans: PricingPlan[] = [
		{
			name: t("plans.starter.name"),
			price: 50,
			features: [
				{ label: t("plans.starter.features.0"), icon: IconCheck },
				{ label: t("plans.starter.features.1"), icon: IconTruck },
				{ label: t("plans.starter.features.2"), icon: IconTruck },
				{ label: t("plans.starter.features.3"), icon: IconChartBar },
				{ label: t("plans.starter.features.4"), icon: IconMail },
			],
		},
		{
			name: t("plans.medium.name"),
			price: 200,
			pricePerTruck: 10,
			minTrucks: 11,
			maxTrucks: 250,
			features: [
				{ label: t("plans.medium.features.0"), icon: IconCheck },
				{ label: t("plans.medium.features.1"), icon: IconGps },
				{ label: t("plans.medium.features.2"), icon: IconSend },
				{ label: t("plans.medium.features.3"), icon: IconUsers },
				{ label: t("plans.medium.features.4"), icon: IconApi },
				{ label: t("plans.medium.features.5"), icon: IconChartBar },
			],
		},
		{
			name: t("plans.enterprise.name"),
			price: "Custom",
			features: [
				{ label: t("plans.enterprise.features.0"), icon: IconTruck },
				{ label: t("plans.enterprise.features.1"), icon: IconApi },
				{ label: t("plans.enterprise.features.2"), icon: IconHeadset },
				{ label: t("plans.enterprise.features.3"), icon: IconChartBar },
				{ label: t("plans.enterprise.features.4"), icon: IconShield },
			],
		},
	];

	const calculateMediumFleetPrice = () => {
		const mediumPlan = pricingPlans[1] as MediumFleetPlan;
		const basePrice = mediumPlan.price;
		const pricePerTruck = mediumPlan.pricePerTruck;
		const totalPrice =
			basePrice + (selectedTrucks - mediumPlan.minTrucks) * pricePerTruck;

		return selectedPricing === "annual"
			? Math.floor((totalPrice * 10) / 12)
			: totalPrice;
	};

	const calculatePrice = (plan: PricingPlan) => {
		if (isMediumFleetPlan(plan)) {
			return calculateMediumFleetPrice();
		}

		if (plan.name === t("plans.enterprise.name")) {
			return t("billing.contactUs");
		}

		const fixedPlan = plan as FixedPricePlan;
		return selectedPricing === "annual"
			? Math.round((fixedPlan.price * 10) / 12)
			: fixedPlan.price;
	};

	const getAnnualTotal = (price: number | string) => {
		if (typeof price === "string") return price;
		return price * 12;
	};

	const isMediumFleetPlan = (plan: PricingPlan): plan is MediumFleetPlan => {
		return plan.name === t("plans.medium.name");
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
			className="mx-auto flex max-w-7xl flex-col gap-10 px-4"
		>
			<motion.h3
				variants={itemVariants}
				// id="pricing"
				className="scroll-mt-36 text-center font-medium text-lg text-primary uppercase tracking-wide"
			>
				{t("title")}
			</motion.h3>
			<motion.h1
				variants={itemVariants}
				className="text-center text-4xl tracking-tight sm:text-5xl"
			>
				{t("heading")}
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
							onClick={() => setSelectedPricing(tab.value)}
						>
							{t(`billing.${tab.label}`)}
						</Button>
					))}
				</AnimatedBackground>
			</motion.div>
			<motion.div
				ref={pricingRef}
				className={cn(
					"grid w-full grid-cols-1 transition-all duration-500 ease-in-out-quad lg:grid-cols-3",
					inView ? "gap-6" : "gap-12 xl:gap-32",
				)}
			>
				{pricingPlans.map((plan) => (
					<motion.div
						key={plan.name}
						variants={itemVariants}
						className="h-full w-full sm:w-[280px] lg:w-[320px] mx-auto"
					>
						<Card className="relative flex h-full w-full flex-col overflow-hidden">
							<CardHeader>
								<CardTitle className="text-2xl">{plan.name}</CardTitle>
							</CardHeader>
							<CardContent className="flex h-full flex-col">
								<motion.div variants={itemVariants} className="mb-6">
									{plan.price !== "Custom" ? (
										<NumberFlow
											value={calculatePrice(plan) as number}
											className="font-bold text-3xl"
											prefix="$"
										/>
									) : (
										<span className="font-bold text-3xl">
											{t("billing.contactUs")}
										</span>
									)}
									{plan.price !== "Custom" ? (
										<AnimatePresence mode="wait" propagate>
											<motion.div
												key={selectedPricing}
												initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
												animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
												exit={{ opacity: 0, filter: "blur(10px)", y: -20 }}
												transition={{
													duration: 0.3,
													ease: "easeInOut",
												}}
												className="mt-1 text-muted-foreground text-sm capitalize"
											>
												{selectedPricing === "annual" ? (
													<>{t("billing.perMonthBilledAnnually")}</>
												) : (
													t("billing.perMonth")
												)}
											</motion.div>
										</AnimatePresence>
									) : null}
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
												{selectedTrucks} {t("plans.medium.name")}
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
										variant={
											plan.name === t("plans.enterprise.name")
												? "outline"
												: "default"
										}
									>
										{plan.name === t("plans.enterprise.name")
											? t("billing.contactSales")
											: t("billing.getStarted")}
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
