import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Meteors } from "@/components/magicui/meteors";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { Particles } from "@/components/magicui/particles";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
	visible: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		transition: {
			type: "spring",
			mass: 0.5,
			damping: 10,
			stiffness: 100,
		},
	},
};

export default function Hero() {
	const { resolvedTheme } = useTheme();
	const t = useTranslations("hero");
	const text = t("title");

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			transition={{ staggerChildren: 0.07, delayChildren: 0.7 }}
			className=""
		>
			<motion.div
				variants={{
					hidden: { opacity: 0, y: 150, filter: "blur(10px)" },
					visible: {
						opacity: 1,
						y: 0,
						filter: "blur(0px)",
					},
				}}
				transition={{
					staggerChildren: 0.07,
					delayChildren: 0.5,
				}}
				className="relative mt-32 h-full overflow-hidden rounded-4xl bg-foreground/[0.10] pt-20 dark:bg-foreground/[0.05]"
			>
				<Particles
					className="absolute inset-0 z-0"
					quantity={100}
					ease={20}
					staticity={20}
					color={resolvedTheme === "dark" ? "#fff" : "#000"}
					refresh
				/>
				<motion.div className="relative mx-auto flex h-full max-w-[120rem] flex-col items-center justify-center gap-10">
					<div className="flex flex-[1.2] flex-col items-center justify-center gap-6">
						<motion.h1 className="max-w-[85rem] text-center text-7xl leading-[1.15] tracking-tight">
							{text.split(" ").map((word, index) => (
								<motion.span
									key={index}
									variants={itemVariants}
									className={cn(
										"inline-block whitespace-pre-wrap",
										word.includes("*") && "font-semibold text-primary",
									)}
								>
									{word.replace("*", "")}{" "}
								</motion.span>
							))}
						</motion.h1>
						<motion.p
							variants={itemVariants}
							className="text-center text-2xl text-muted-foreground max-w-4xl"
						>
							{t("subtitle")}
						</motion.p>
						<motion.div variants={itemVariants}>
							<InteractiveHoverButton
								duration={400}
								onClick={() => {
									console.log("get_started");
								}}
								className="w-fit rounded-full px-6"
							>
								{t("getStarted")}
							</InteractiveHoverButton>
						</motion.div>
					</div>

					<div className="relative flex-[1]">
						<motion.div variants={itemVariants}>
							<Image
								src="/images/hero.png"
								fetchPriority="high"
								alt="Hero Image"
								width={1000}
								height={1000}
								className="rounded-xl pb-2"
							/>
						</motion.div>
						<motion.div
							variants={itemVariants}
							className="absolute bottom-4 right-0"
						>
							<Image
								src="/images/phone-hero.png"
								fetchPriority="high"
								alt="Hero Image"
								width={250}
								height={250}
								className="rounded-xl"
							/>
						</motion.div>
					</div>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}
