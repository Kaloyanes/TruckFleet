"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useCompanyId from "@/hooks/useCompanyId";
import { useCompanyStore } from "@/stores/Settings/CompanyStore";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";

export default function SaveButton() {
	const { save, hasEdited } = useCompanyStore();
	const { companyId } = useCompanyId();
	const { toast } = useToast();

	async function saveInfo() {
		if (!companyId) return;
		await save(companyId);
		toast({
			title: "Company info saved",
			variant: "success",
		});
	}

	if (!companyId) return null;

	return (
		<AnimatePresence>
			{hasEdited && (
				<motion.div
					variants={{
						hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)", x: 150 },
						visible: { opacity: 1, scale: 1, filter: "blur(0px)", x: 0 },
					}}
					initial="hidden"
					animate="visible"
					exit="hidden"
				>
					<Button onClick={saveInfo} className="" size={"icon"}>
						<IconDeviceFloppy />
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
