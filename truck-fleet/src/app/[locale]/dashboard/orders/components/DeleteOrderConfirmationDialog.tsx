"use client";
import { db } from "@/lib/Firebase";
import { useOrderOptionsStore } from "@/stores/Orders/OrdersOptionsStore";
import { deleteDoc, doc } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { Button } from "../../../../../components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../../../../components/ui/dialog";
import { useToast } from "../../../../../components/ui/use-toast";

export default function DeleteOrderConfirmationDialog() {
	const { showDeleteDialog, openDeleteDialog, order } = useOrderOptionsStore();
	const t = useTranslations("DeleteConfirmationDialog");
	const { toast } = useToast();
	if (!order) return <></>;

	async function DeleteOrder() {
		if (!order) return;

		await deleteDoc(doc(db, "orders", order.id));

		openDeleteDialog(false);
		toast({
			title: t("deletedSuccessfully"),
			description: t("deletedDescription", { id: order.id }),
			variant: "success",
		});
	}

	return (
		<Dialog open={showDeleteDialog} onOpenChange={openDeleteDialog}>
			<DialogTrigger />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t("title")} #{order?.id}
					</DialogTitle>
				</DialogHeader>
				<DialogDescription>{t("description")}</DialogDescription>
				<DialogFooter>
					<Button variant={"outline"} onClick={() => openDeleteDialog(false)}>
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
