"use client";
import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../../../../components/ui/dialog";
import { useDeleteOrderContext } from "@/context/orders/order-delete-context";
import { Button } from "../../../../../components/ui/button";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useToast } from "../../../../../components/ui/use-toast";
import { useTranslations } from "next-intl";

export default function DeleteOrderConfirmationDialog() {
	const { confirm, setConfirm, order } = useDeleteOrderContext();
	const t = useTranslations("DeleteConfirmationDialog");
	const { toast } = useToast();
	if (!order) return <></>;

	async function DeleteOrder() {
		if (!order) return;

		await deleteDoc(doc(db, "orders", order.id));

		setConfirm(false);
		toast({
			title: t("deletedSuccessfully"),
			description: t("deletedDescription", { id: order.id }),
			variant: "success",
		});
	}

	return (
		<Dialog open={confirm} onOpenChange={setConfirm}>
			<DialogTrigger />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t("title")} #{order?.id}
					</DialogTitle>
				</DialogHeader>
				<DialogDescription>{t("description")}</DialogDescription>
				<DialogFooter>
					<Button variant={"outline"} onClick={() => setConfirm(false)}>
						{t("cancel")}
					</Button>
					<Button variant={"destructive"} onClick={DeleteOrder}>
						{t("delete")}
					</Button>
					{/* <button className="btn btn-primary">Delete</button>
				<button className="btn btn-secondary">Cancel</button> */}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
