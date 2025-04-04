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
import { motion, type Variants } from "motion/react";
import React from "react";

const features = [
	{
		Icon: IconLayoutDashboard,
		translationKey: "dashboard",
		href: "/",
		cta: "Learn more",
		background: (
			<div className="absolute inset-0 bg-gradient-to-b to-primary/15 from-transparent" />
		),
		className: "lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-2",
	},
	{
		Icon: IconFileCheck,
		translationKey: "automation",
		href: "/",
		cta: "Learn more",
		background: (
			<div className="absolute inset-0 bg-gradient-to-bl to-primary/15 from-transparent" />
		),
		className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
	},

	{
		Icon: IconMessageCircle,
		translationKey: "communication",
		href: "/",
		cta: "Learn more",
		background: (
			<div className="absolute inset-0 bg-gradient-to-tr to-primary/15 from-transparent" />
		),
		className: "lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3",
	},
	{
		Icon: IconSettingsCog,
		translationKey: "maintenance",
		href: "/",
		cta: "Learn more",
		background: (
			<div className="absolute inset-0 bg-gradient-to-tr to-primary/15 from-transparent" />
		),
		className: "lg:col-start-1 lg:col-end-1 lg:row-start-3 lg:row-end-4",
	},
	{
		Icon: IconMapPin,
		translationKey: "gps",
		href: "/",
		cta: "Learn more",
		background: (
			<div className="absolute inset-0 bg-gradient-to-tl to-primary/15 from-transparent" />
		),
		className: "lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-4",
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
			staggerChildren: 0.07,
		},
	},
};

const cardVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95, y: 20 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 260,
			damping: 20,
			staggerChildren: 0.07,
		},
	},
};

const formatWord = (word: string) => {
	if (word.startsWith("*")) {
		return <span className="font-bold text-primary">{word.slice(1)}</span>;
	}
	if (word.startsWith("|")) {
		return <span className="font-bold">{word.slice(1)}</span>;
	}
	return <span>{word}</span>;
};

export default function Solution() {
	const t = useTranslations("solution");

	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{
				once: true,
				margin: "0px 0px 50px 0px",
				amount: 0.7,
			}}
			transition={{
				staggerChildren: 0.07,
			}}
			className="mx-auto flex max-w-7xl flex-col gap-10 px-4"
		>
			<motion.h3
				id="solution"
				variants={itemVariants}
				className="scroll-mt-36 text-center font-medium text-primary uppercase tracking-wide"
			>
				{t("title")}
			</motion.h3>
			<motion.h1
				variants={itemVariants}
				className="text-center text-[2.9rem] tracking-tight"
			>
				{t("heading")
					.split(" ")
					.map((word, i) => (
						<span key={i}>
							{formatWord(word)}
							{i !== t("heading").split(" ").length - 1 && " "}
						</span>
					))}
			</motion.h1>

			<motion.div
				transition={{
					staggerChildren: 0.07,
					delayChildren: 0.2,
				}}
			>
				<BentoGrid className="auto-rows-[minmax(15rem,auto)] grid-cols-1 lg:grid-cols-3">
					{features.map((feature) => (
						<BentoCard
							key={feature.translationKey}
							{...feature}
							variants={cardVariants}
							name={t(`features.${feature.translationKey}.title`)}
							description={t(`features.${feature.translationKey}.description`)}
						/>
					))}
				</BentoGrid>
			</motion.div>
		</motion.div>
	);
}
