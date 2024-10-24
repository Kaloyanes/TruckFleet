import type { Variants } from "framer-motion";

export const dropdownMenuParentVariants: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.07,
			delayChildren: 0.05,
		},
	},
};

export const dropdownMenuVariants: Variants = {
	hidden: { opacity: 0, y: 50, scale: 0.7 },
	visible: { opacity: 1, y: 0, scale: 1 },
};
