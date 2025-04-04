// The problem section where i show the problem

import { IconEyeOff, IconHourglass, IconLinkOff } from "@tabler/icons-react";
import { motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";

const problems = [
	{
		icon: <IconLinkOff size={24} />,
		translationKey: "disconnected",
	},
	{
		icon: <IconEyeOff size={24} />,
		translationKey: "visibility",
	},
	{
		icon: <IconHourglass size={24} />,
		translationKey: "manual",
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

const formatWord = (word: string) => {
	if (word.startsWith("*")) {
		return <span className="font-bold text-primary">{word.slice(1)}</span>;
	}
	if (word.startsWith("|")) {
		return <span className="font-bold">{word.slice(1)}</span>;
	}
	return <span>{word}</span>;
};

export default function Problem() {
	const t = useTranslations("problem");

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
			className="flex flex-col gap-4 py-20"
		>
			<motion.h3
				variants={itemVariants}
				id="problem"
				className="scroll-mt-36 text-center font-medium text-lg text-primary uppercase tracking-wide"
			>
				{t("title")}
			</motion.h3>
			<motion.h1
				variants={itemVariants}
				className="text-center text-4xl tracking-tight sm:text-5xl"
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
			<div className="mx-auto mt-16 w-full max-w-[80rem]">
				<div className="flex flex-col gap-10 md:flex-row md:justify-between">
					{problems.map((problem) => (
						<motion.div
							variants={itemVariants}
							className="flex w-full max-w-[28rem] flex-col gap-6"
							key={problem.translationKey}
						>
							<div className="flex items-center gap-2">
								<div className="rounded-full bg-primary/15 p-4 text-primary">
									{problem.icon}
								</div>
							</div>
							<h2 className="text-xl font-semibold tracking-tight">
								{t(`problems.${problem.translationKey}.title`)}
							</h2>
							<p className="text-lg leading-relaxed text-muted-foreground">
								{t(`problems.${problem.translationKey}.description`)}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</motion.div>
	);
}
