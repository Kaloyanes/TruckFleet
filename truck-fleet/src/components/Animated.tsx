"use client";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";

import type React from "react";
import { useContext, useRef } from "react";

function FrozenRouter(props: { children: React.ReactNode }) {
	const context = useContext(LayoutRouterContext ?? {});
	const frozen = useRef(context).current;

	return (
		<LayoutRouterContext.Provider value={frozen}>
			{props.children}
		</LayoutRouterContext.Provider>
	);
}

export default function Animated({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				initial={{
					opacity: 0,
					y: 20,
					height: 325,
				}}
				animate={{
					opacity: 1,
					y: 0,
					height: "auto",
				}}
				exit={{
					opacity: 0,
					y: -20,
					height: 325,
				}}
				layout
			>
				<FrozenRouter>{children}</FrozenRouter>
			</motion.div>
		</AnimatePresence>
	);
}
