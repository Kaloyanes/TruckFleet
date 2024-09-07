import React, { useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

import { z } from "zod";
import AutoForm from "../ui/auto-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useToast } from "../ui/use-toast";
import { useTranslations } from "next-intl";

const schema = z.object({
	email: z.string().email(),
});

export default function ForgotPasswordDialog() {
	const t = useTranslations("LoginPage");
	const [open, setOpen] = useState(false);
	const { toast } = useToast();

	async function sendResetEmail(values: { email: string }) {
		try {
			await sendPasswordResetEmail(auth, values.email);
		} catch (e) {
			console.error(e);
		}

		toast({
			title: t("sent_email"),
			description: t("check_email"),
			variant: "success",
		});
		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="place-self-end">
				<Button type="button" variant={"link"}>
					{t("forgot_password_q")}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>{t("forgot_password")}</DialogTitle>
				<DialogDescription>{t("forgot_password_desc")}</DialogDescription>

				{/* <Input type="email" placeholder="Email" minLength={1} /> */}
				<AutoForm formSchema={schema} onSubmit={sendResetEmail}>
					<DialogFooter className="gap-2 flex-row justify-end">
						<DialogClose className="">
							<Button type="button" variant="secondary" className="w-32">
								{t("cancel")}
							</Button>
						</DialogClose>
						<Button type="submit" className="w-32">
							{t("send_email")}
						</Button>
					</DialogFooter>
				</AutoForm>
			</DialogContent>
		</Dialog>
	);
}
