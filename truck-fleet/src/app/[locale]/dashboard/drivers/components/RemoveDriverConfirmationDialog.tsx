"use client";
import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useRemoveDriverContext } from "@/context/drivers/remove-driver-context";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

export default function RemoveDriverConfirmationDialog() {
	const { confirm, setConfirm, driver } = useRemoveDriverContext();
	const { toast } = useToast();
	const t = useTranslations("RemoveDriverConfirmationDialog");

	async function removeDriver() {
		if (!driver) return;

		await updateDoc(doc(db, "users", driver.id), {
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
						name: driver?.name || "Driver",
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
