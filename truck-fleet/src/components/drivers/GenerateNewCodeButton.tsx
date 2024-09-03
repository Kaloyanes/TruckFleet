"use client";
import { generateCompanyCode } from "@/lib/generateCompanyCode";
import type { DocumentReference } from "firebase/firestore";
import React, { useState } from "react";
import { Button } from "../ui/button";
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
} from "../ui/dialog";

export default function GenerateNewCodeButton({
	companyRef,
}: {
	companyRef: DocumentReference;
}) {
	const [open, setOpen] = useState(false);
	const t = useTranslations("EmployeePage");

	const handleAgree = () => {
		generateCompanyCode(companyRef);
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
					<Button variant={"outline"}>{t("cancel")}</Button>
					<Button variant={"destructive"}>{t("yes")}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
