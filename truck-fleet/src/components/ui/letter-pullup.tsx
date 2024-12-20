"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/Utils";

interface LetterPullupProps {
	className?: string;
	words: string;
	delay?: number;
}

export default function LetterPullup({
	className,
	words,
	delay,
}: LetterPullupProps) {
	const letters = words.split("");

	const pullupVariant = {
		initial: { y: 25, opacity: 0, filter: "blur(5px)" },
		animate: (i: any) => ({
			y: 0,
			opacity: 1,
			filter: "blur(0px)",
			transition: {
				delay: i * (delay ? delay : 0.05), // By default, delay each letter's animation by 0.05 seconds
			},
		}),
	};

	return (
		<div className="flex">
			{letters.map((letter, i) => (
				<motion.h1
					key={i}
					variants={pullupVariant}
					initial="initial"
					animate="animate"
					custom={i}
					className={cn(
						"text-center font-bold font-display text-4xl text-black tracking-[-0.02em] drop-shadow-sm md:text-4xl md:leading-[5rem] dark:text-white",
						className,
					)}
				>
					{letter === " " ? <span>&nbsp;</span> : letter}
				</motion.h1>
			))}
		</div>
	);
}
