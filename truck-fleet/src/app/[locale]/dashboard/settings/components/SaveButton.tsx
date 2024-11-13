// "use client";
// import { Button } from "@/components/ui/button";
// import useCompanyId from "@/hooks/useCompanyId";
// import { useCompanyStore } from "@/stores/Settings/CompanyStore";
// import { IconDeviceFloppy } from "@tabler/icons-react";
// import { AnimatePresence, motion } from "framer-motion";
// import React from "react";

// export default function SaveButton() {
// 	const { save } = useCompanyStore();
// 	const { companyId } = useCompanyId();

// 	if (!companyId) return null;

// 	return (
// 		<AnimatePresence>
// 			{hasEdited && (
// 				<motion.div
// 					variants={{
// 						hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)", x: 150 },
// 						visible: { opacity: 1, scale: 1, filter: "blur(0px)", x: 0 },
// 					}}
// 					initial="hidden"
// 					animate="visible"
// 					exit="hidden"
// 				>
// 					<Button onClick={() => save(companyId)} className="" size={"icon"}>
// 						<IconDeviceFloppy />
// 					</Button>
// 				</motion.div>
// 			)}
// 		</AnimatePresence>
// 	);
// }
