import type { Variants } from "framer-motion";

export const dropdownMenuParentVariants: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.05,
			delayChildren: 0.05,
		},
	},
};

export const dropdownMenuVariants: Variants = {
	hidden: { opacity: 0, y: 25, filter: "blur(10px)", scale: 0.8 },
	visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 },
};
