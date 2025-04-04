import LanguageSelector from "@/components/settings/LanguageSelector";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { IconPackages } from "@tabler/icons-react";
import { motion, type Variants } from "motion/react";
import React from "react";
import { useTranslations } from "next-intl";

const itemVariants: Variants = {
	hidden: { opacity: 0, y: -20, filter: "blur(15px)" },
	visible: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		scale: 1,
		transition: {
			y: { duration: 0.3 },
			opacity: { duration: 0.4 },
			filter: { duration: 0.3 },
		},
	},
};

export default function Header() {
	const [isScrolled, setIsScrolled] = React.useState(false);
	const t = useTranslations("");

	React.useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 25);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleSectionClick = (
		e: React.MouseEvent<HTMLAnchorElement>,
		sectionId: string,
	) => {
		e.preventDefault();
		const element = document.querySelector(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	const sections = [
		{
			link: "#problem",
			label: t("problem.title"),
		},
		{
			link: "#solution",
			label: t("solution.title"),
		},
		// {
		// 	link: "#pricing",
		// 	label: t("pricing"),
		// },
		// {
		// 	link: "#features",
		// 	label: t("features"),
		// },
		// {
		// 	link: "#fleet",
		// 	label: t("fleet"),
		// },
		// {
		// 	link: "#analytics",
		// 	label: t("analytics"),
		// },
	];

	return (
		<>
			<motion.div
				initial="hidden"
				animate="visible"
				transition={{
					staggerChildren: 0.1,
				}}
				className={cn(
					"fixed top-0 right-0 left-0 z-50 mx-auto my-5 w-[90%] rounded-3xl border px-6 py-4 transition-all duration-300 ease-out-quad ",
					isScrolled && " border-primary/5 bg-background/50 backdrop-blur-lg",
					!isScrolled &&
						" border-transparent bg-background/0 backdrop-blur-none",
				)}
			>
				<div className="flex items-center justify-between">
					<motion.h1
						onClick={() => {
							window.scrollTo({ top: 0, behavior: "smooth" });
						}}
						variants={itemVariants}
						className="flex cursor-pointer items-center gap-2 font-sans font-semibold text-2xl"
					>
						<IconPackages size={32} className="size-8" />
						Truck Fleet
					</motion.h1>
					<div className="flex gap-4">
						{sections.map((section, index) => (
							<motion.div key={section.label} variants={itemVariants}>
								<Link
									href={section.link}
									onClick={(e) => handleSectionClick(e, section.link)}
								>
									<Button variant="linkHover2" size={"lg"} className="text-lg">
										{section.label}
									</Button>
								</Link>
							</motion.div>
						))}
					</div>
					<div className="flex items-center gap-2">
						<motion.div variants={itemVariants}>
							<ThemeToggle className="rounded-2xl" />
						</motion.div>
						<motion.div variants={itemVariants}>
							<LanguageSelector className="rounded-2xl" />
						</motion.div>
						<motion.div variants={itemVariants}>
							<Link href="/login" prefetch>
								<Button variant="default" className="">
									Sign in
								</Button>
							</Link>
						</motion.div>
					</div>
				</div>
			</motion.div>
		</>
	);
}
