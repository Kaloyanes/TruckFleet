"use client";
import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTruckStore } from "@/stores/Trucks/TrucksStore";
import { useTranslations } from "next-intl";

const TruckDeleteDialog = () => {
	// Use selectedTruck from store
	const { isDeletingTruck, deleteTruck, selectedTruck } = useTruckStore();
	const t = useTranslations("TruckList");

	const handleConfirm = async () => {
		await deleteTruck(true);
	};

	const handleCancel = async () => {
		await deleteTruck(false);
	};

	return (
		<Dialog
			open={isDeletingTruck}
			onOpenChange={(open) => !open && handleCancel()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t("confirmDeletionTitle", {
							licensePlate: selectedTruck?.licensePlate || "",
						})}
					</DialogTitle>
					<DialogDescription>
						{t("confirmDeletionDescription")}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={handleCancel}>
						{t("cancel")}
					</Button>
					<Button
						variant="destructive"
						className="ml-2"
						onClick={handleConfirm}
					>
						{t("confirm")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default TruckDeleteDialog;
