"use client";
import React from "react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { useDeleteOrderContext } from "@/context/orders/order-delete-context";
import { Button } from "../ui/button";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useToast } from "../ui/use-toast";

export default function DeleteOrderConfirmationDialog() {
	const { confirm, setConfirm, order } = useDeleteOrderContext();
	const { toast } = useToast();
	if (!order) return <></>;

	async function DeleteOrder() {
		if (!order) return;

		await deleteDoc(doc(db, "orders", order.id));

		setConfirm(false);
		toast({
			title: "Order deleted",
			description: `Order #${order.id} has been deleted`,
			variant: "success",
		});
	}

	return (
		<Dialog open={confirm} onOpenChange={setConfirm}>
			<DialogTrigger />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Order #{order?.id}</DialogTitle>
				</DialogHeader>
				<p>Are you sure you want to delete this order?</p>
				<DialogFooter>
					<Button variant={"outline"} onClick={() => setConfirm(false)}>
						Cancel
					</Button>
					<Button variant={"destructive"} onClick={DeleteOrder}>
						Delete
					</Button>
					{/* <button className="btn btn-primary">Delete</button>
				<button className="btn btn-secondary">Cancel</button> */}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
