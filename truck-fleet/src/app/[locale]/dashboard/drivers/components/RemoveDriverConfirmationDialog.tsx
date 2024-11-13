"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase";
import { useDriverOptionsStore } from "@/stores/Drivers/DriverOptionsStore";
import { doc, updateDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";

export default function RemoveDriverConfirmationDialog() {
	const { confirm, setConfirm, selectedDriver } = useDriverOptionsStore();
	const { toast } = useToast();
	const t = useTranslations("RemoveDriverConfirmationDialog");

	async function removeDriver() {
		if (!selectedDriver) return;

		await updateDoc(doc(db, "users", selectedDriver.id), {
			companyId: "",
		});

		toast({
			title: t("removedSuccessfully"),
			variant: "destructive",
		});
		setConfirm(false);
	}

	return (
		<Dialog open={confirm} onOpenChange={setConfirm}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					{t("description", {
						name: selectedDriver?.name || "Driver",
					})}
				</DialogDescription>
				<DialogFooter>
					<Button variant={"outline"} onClick={() => setConfirm(false)}>
						Cancel
					</Button>
					<Button variant={"destructive"} onClick={removeDriver}>
						Remove
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
