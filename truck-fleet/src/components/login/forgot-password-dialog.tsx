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

const schema = z.object({
	email: z.string().email(),
});

export default function ForgotPasswordDialog() {
	const [open, setOpen] = useState(false);
	const { toast } = useToast();

	async function sendResetEmail(values: { email: string }) {
		console.log(values);
		// try {
		// await sendPasswordResetEmail(auth, values.email);
		// } catch (e) {
		// 	console.error(e);
		// }

		toast({
			title: "Sent email",
			description: "Check your email for a link to reset your password",
			variant: "success",
		});
		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="place-self-end">
				<Button type="button" variant={"link"}>
					Forgot password?
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Forgot Password</DialogTitle>
				<DialogDescription>
					Enter your email address and we'll send you a link to reset your
					password
				</DialogDescription>

				{/* <Input type="email" placeholder="Email" minLength={1} /> */}
				<AutoForm formSchema={schema} onSubmit={sendResetEmail}>
					<DialogFooter>
						<DialogClose>
							<Button type="button" variant="secondary">
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit">Send email</Button>
					</DialogFooter>
				</AutoForm>
			</DialogContent>
		</Dialog>
	);
}
