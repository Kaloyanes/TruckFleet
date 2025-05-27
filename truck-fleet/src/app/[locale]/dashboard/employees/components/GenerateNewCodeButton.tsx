"use client";
import { generateCompanyCode } from "@/lib/GenerateCompanyCode";
import type { DocumentReference } from "firebase/firestore";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
	Dialog,
	DialogFooter,
	DialogHeader,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export default function GenerateNewCodeButton({
	companyRef,
}: {
	companyRef: DocumentReference;
}) {
	const [open, setOpen] = useState(false);
	const t = useTranslations("EmployeePage");

	const handleAgree = () => {
		generateCompanyCode(companyRef);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>{t("generateNewCode")}</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("generateNewCodeTitle")}</DialogTitle>
				</DialogHeader>
				<DialogDescription>{t("generateNewCodeDescription")}</DialogDescription>
				<DialogFooter>
					<Button variant={"outline"} className="min-w-24">
						{t("cancel")}
					</Button>
					<Button
						variant={"destructive"}
						className="min-w-24"
						onClick={handleAgree}
					>
						{t("yes")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
