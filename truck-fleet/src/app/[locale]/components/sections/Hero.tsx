import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Meteors } from "@/components/magicui/meteors";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { Particles } from "@/components/magicui/particles";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import type React from "react";

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

const photoVariants: Variants = {
	hidden: { opacity: 0, x: 150, filter: "blur(10px)" },
	visible: {
		opacity: 1,
		x: 0,
		filter: "blur(0px)",
		transition: {
			type: "spring",
			mass: 0.7,
			damping: 10,
			stiffness: 100,
		},
	},
};

export default function Hero() {
	const { resolvedTheme } = useTheme();
	const t = useTranslations("hero");
	const text = t("title");

	function getStarted(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		const element = document.querySelector("#pricing");
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	}

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			transition={{ staggerChildren: 0.07, delayChildren: 0.5 }}
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
				className="relative mt-32 h-[85vh] overflow-hidden rounded-4xl bg-foreground/[0.10] dark:bg-foreground/[0.05]"
			>
				<Particles
					className="absolute inset-0 z-0 h-full w-full"
					quantity={200}
					ease={20}
					staticity={20}
					color={resolvedTheme === "dark" ? "#fff" : "#000"}
				/>
				<motion.div className="relative mx-auto flex h-full max-w-[120rem] flex-row items-center justify-between gap-10 px-24 py-32">
					<div className="flex flex-1 flex-col items-start justify-center gap-6">
						<motion.h1 className="max-w-[40rem] text-left text-7xl leading-[1.05] tracking-tight font-semibold">
							{text.split(" ").map((word, index) => (
								<motion.span
									key={index}
									variants={itemVariants}
									className={cn(
										"inline-block whitespace-pre-wrap",
										word.includes("*") && "font-black text-primary",
									)}
								>
									{word.replace("*", "")}{" "}
								</motion.span>
							))}
						</motion.h1>
						<motion.p
							variants={itemVariants}
							className="max-w-2xl text-left text-2xl text-muted-foreground"
						>
							{t("subtitle")}
						</motion.p>
						<motion.div variants={itemVariants}>
							<InteractiveHoverButton
								duration={400}
								onClick={getStarted}
								className="w-fit rounded-full px-6"
							>
								{t("getStarted")}
							</InteractiveHoverButton>
							{/* <Button
								variant={"ringHover"}
								size={"lg"}
								onClick={getStarted}
								className="w-fit rounded-full px-8"
							>
								{t("getStarted")}
							</Button> */}
						</motion.div>
					</div>

					<div className="relative flex-[0.8]">
						<motion.div variants={photoVariants}>
							<Image
								src="/images/hero3.png"
								fetchPriority="high"
								alt="Hero Image"
								width={1300}
								height={1300}
								className="h-full w-full"
								placeholder="blur"
								blurDataURL="/images/hero.png"
							/>
						</motion.div>
						<motion.div
							variants={photoVariants}
							className="-bottom-8 absolute right-0"
						>
							<Image
								src="/images/phone-hero.png"
								fetchPriority="high"
								alt="Hero Image"
								width={225}
								height={225}
								className="rounded-xl"
								placeholder="blur"
								blurDataURL="/images/phone-hero.png"
							/>
						</motion.div>
					</div>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}
