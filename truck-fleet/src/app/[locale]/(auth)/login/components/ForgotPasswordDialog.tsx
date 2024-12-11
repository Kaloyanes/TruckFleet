import React, { useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "../../../../../components/ui/dialog";
import { Button } from "../../../../../components/ui/button";

import { z } from "zod";
import AutoForm from "../../../../../components/ui/auto-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/Firebase";
import { useToast } from "../../../../../components/ui/use-toast";
import { useTranslations } from "next-intl";

export default function ForgotPasswordDialog() {
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const t = useTranslations("LoginPage");

	const schema = z.object({
		email: z.string().describe(t("email")).email(),
	});

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
			<DialogTrigger asChild className="place-self-end">
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
						<DialogClose asChild className="">
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
