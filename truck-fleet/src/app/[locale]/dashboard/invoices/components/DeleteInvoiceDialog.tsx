"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import useCompanyId from "@/hooks/useCompanyId";
import { useInvoicesStore } from "@/stores/Invoices/InvoicesStore";
import React from "react";
import { useTranslations } from "next-intl";

export default function DeleteInvoiceDialog() {
	const {
		selectedInvoice,
		openDeleteDialog,
		setDialogVisibility,
		deleteInvoice,
	} = useInvoicesStore();
	const { companyId } = useCompanyId();

	const { toast } = useToast();
	const t = useTranslations("DeleteInvoiceDialog");

	return (
		<Dialog open={openDeleteDialog} onOpenChange={setDialogVisibility}>
			<DialogContent className="overflow-hidden">
				<DialogHeader>
					<DialogTitle>
						{t("title", { invoiceNumber: selectedInvoice?.invoiceNumber })}
					</DialogTitle>
					<DialogDescription>{t("description")}</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 flex-row justify-end">
					<DialogClose asChild className="">
						<Button type="button" variant="ghost" className="w-32">
							{t("cancel")}
						</Button>
					</DialogClose>
					<Button
						variant="destructive"
						className="w-32"
						onClick={async () => {
							if (companyId) {
								deleteInvoice(companyId);
								toast({
									variant: "destructive",
									title: t("toastTitle"),
								});
							}
						}}
					>
						{t("delete")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
