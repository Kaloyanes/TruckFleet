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
import { useChatOptionsStore } from "@/stores/Chats/ChatOptionsStore";
import { deleteDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";

export function DeleteMessageDialog() {
	const { showDeleteDialog, messageToDelete, closeDeleteDialog } =
		useChatOptionsStore();
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
