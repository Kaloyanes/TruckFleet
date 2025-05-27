"use client";

import { Button } from "@/components/ui/button";
import LetterPullup from "@/components/ui/letter-pullup";
import { usePathname, useRouter } from "@/i18n/routing";
import { IconArrowLeft } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function BackButton() {
	const route = usePathname();
	const router = useRouter();

	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setVisible(route !== "/dashboard/employees");
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
						initial={{ opacity: 1, x: -100, scale: 0, filter: "blur(10px)" }}
						animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
						exit={{ opacity: 1, x: -100, scale: 0, filter: "blur(10px)" }}
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
					layoutId="employees-title"
					layout
					className="font-bold text-2xl"
				>
					<LetterPullup words={t("employees")} delay={0.1} />
				</motion.h1>
			</motion.div>
		</AnimatePresence>
	);
}
