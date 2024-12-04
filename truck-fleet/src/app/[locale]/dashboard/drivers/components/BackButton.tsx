"use client";

import { Button } from "@/components/ui/button";
import LetterPullup from "@/components/ui/letter-pullup";
import { usePathname, useRouter } from "@/lib/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function BackButton() {
	const route = usePathname();
	const router = useRouter();

	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setVisible(route !== "/dashboard/drivers");
	}, [route]);

	const t = useTranslations("EmployeePage");

	return (
		<AnimatePresence mode="sync">
			<motion.div
				layout
				className="flex items-center gap-4 h-10"
				initial={{ opacity: 1 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 1 }}
				transition={{
					duration: 0.3,
					type: "spring",
					bounce: 0.25,
					damping: 20,
				}}
			>
				{visible && (
					<motion.div
						initial={{ opacity: 1, x: -100, scale: 0 }}
						animate={{ opacity: 1, x: 0, scale: 1 }}
						exit={{ opacity: 1, x: -100, scale: 0 }}
						transition={{
							duration: 0.2,
							type: "spring",
							bounce: 0.6,
							damping: 20,
						}}
					>
						<Button
							size={"icon"}
							variant={"ghost"}
							onClick={() => {
								router.back();
							}}
						>
							<IconArrowLeft />
						</Button>
					</motion.div>
				)}
				<motion.h1
					layoutId="drivers-title"
					layout
					className="font-bold text-2xl"
				>
					<LetterPullup words={t("drivers")} delay={0.1} />
				</motion.h1>
			</motion.div>
		</AnimatePresence>
	);
}
