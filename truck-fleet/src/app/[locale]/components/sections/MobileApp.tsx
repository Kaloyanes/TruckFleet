import { cn } from "@/lib/utils";
import {
	IconBell,
	IconFile,
	IconMapPin,
	IconMessageCircle,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import type { Variants } from "motion/react";
import Image from "next/image";
import type React from "react";
import { useTranslations } from "next-intl";

const features: {
	title: string;
	description: string;
	icon: React.ElementType;
	image: string;
}[] = [
	{
		title: "tracking.title",
		description: "tracking.description",
		icon: IconMapPin,
		image: "/images/phone-chat.png",
	},
	{
		title: "notifications.title",
		description: "notifications.description",
		icon: IconBell,
		image: "/images/phone-chat.png",
	},
	{
		title: "documents.title",
		description: "documents.description",
		icon: IconFile,
		image: "/images/phone-chat.png",
	},
	{
		title: "communication.title",
		description: "communication.description",
		icon: IconMessageCircle,
		image: "/images/phone-chat.png",
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
			staggerChildren: 0.1,
			staggerDirection: -1,
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
			staggerChildren: 0.1,
			staggerDirection: -1,
		},
	},
};

function FeatureCard({
	feature,
	index,
}: {
	feature: (typeof features)[0];
	index: number;
}) {
	const t = useTranslations("mobileApp.features");

	return (
		<motion.div
			variants={cardVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{
				once: true,
				margin: "0px 0px -100px 0px",
				amount: 0.75,
			}}
			className={cn(
				"flex flex-row-reverse justify-evenly py-20",
				index % 2 === 0 && "flex-row",
			)}
		>
			<motion.div
				variants={itemVariants}
				className="relative flex h-full flex-[1.5] flex-col justify-center gap-2"
			>
				<div className="flex items-center">
					<motion.div
						className="rounded-full bg-primary/10 p-2"
						whileHover={{ scale: 1.1 }}
						transition={{ type: "spring", stiffness: 400, damping: 10 }}
					>
						<feature.icon className="size-8 text-primary" />
					</motion.div>
				</div>
				<h2 className="font-semibold text-xl">{t(feature.title)}</h2>
				<p className="text-muted-foreground">{t(feature.description)}</p>
			</motion.div>
			<motion.div variants={itemVariants} className="flex-1">
				<div
					className={cn(
						"absolute inset-0 z-10 rounded-full blur-3xl",
						index % 4 === 0 &&
							"bg-gradient-to-br from-primary via-transparent to-transparent",
						index % 4 === 1 &&
							"bg-gradient-to-tr from-primary/80 via-transparent to-transparent",
						index % 4 === 2 &&
							"bg-gradient-to-tl from-primary/60 via-transparent to-transparent",
						index % 4 === 3 &&
							"bg-gradient-to-bl from-primary/40 via-transparent to-transparent",
					)}
				/>
				<Image
					src={feature.image}
					alt={t(feature.title)}
					width={350}
					height={350}
					className="relative z-20 object-contain"
					placeholder="blur"
					blurDataURL={feature.image}
				/>
			</motion.div>
		</motion.div>
	);
}

export default function MobileApp() {
	const t = useTranslations("mobileApp");

	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{
				once: true,
				margin: "0px 0px 0px 0px",
				amount: 0.2,
			}}
			transition={{
				staggerChildren: 0.1,
			}}
			id="mobile-app-root"
			className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4"
		>
			<motion.h3
				variants={itemVariants}
				id="mobile-app"
				className="scroll-mt-36 text-center font-medium text-lg text-primary uppercase tracking-wide"
			>
				{t("title")}
			</motion.h3>
			<motion.h1
				variants={itemVariants}
				className="text-center text-4xl font-bold"
			>
				{t("heading")}
			</motion.h1>
			<motion.div
				variants={itemVariants}
				className="relative flex w-full justify-between"
			>
				<div className="flex w-full flex-col gap-6">
					{features.map((feature, index) => (
						<FeatureCard key={feature.title} feature={feature} index={index} />
					))}
				</div>
			</motion.div>
		</motion.div>
	);
}
