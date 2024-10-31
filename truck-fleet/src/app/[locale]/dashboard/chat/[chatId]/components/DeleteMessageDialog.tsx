"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteMessage } from "@/context/chat/delete-message-context";
import { deleteDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";

export function DeleteMessageDialog() {
	const { showDeleteDialog, messageToDelete, closeDeleteDialog } =
		useDeleteMessage();
	const t = useTranslations("ChatPage");
	const { toast } = useToast();

	const handleDelete = async () => {
		if (messageToDelete) {
			await deleteDoc(messageToDelete);
		}
		closeDeleteDialog();
		toast({
			title: t("messageDeleted"),
			variant: "destructive",
		});
	};

	return (
		<Dialog open={showDeleteDialog} onOpenChange={closeDeleteDialog}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("deleteMessage")}</DialogTitle>
					<DialogDescription>
						{t("deleteMessageConfirmation")}
						<p className="pt-2 text-sm text-muted-foreground">{t("protip")}</p>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={closeDeleteDialog}>
						{t("cancel")}
					</Button>
					<Button variant="destructive" onClick={handleDelete}>
						{t("delete")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
