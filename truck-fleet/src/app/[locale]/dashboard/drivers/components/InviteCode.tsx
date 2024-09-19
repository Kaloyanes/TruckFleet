"use client";
import React, { useEffect } from "react";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { generateCompanyCode } from "@/lib/generateCompanyCode";
import useCompanyId from "@/hooks/useCompanyId";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useCopyToClipboard } from "react-use";
import { useToast } from "@/components/ui/use-toast";
import GenerateNewCodeButton from "./GenerateNewCodeButton";

export default function InviteCodeInfo() {
	const t = useTranslations("EmployeePage");
	const { companyRef } = useCompanyId();
	const [companyData, loading, error] = useDocumentData(companyRef);
	const { toast } = useToast();

	const [clipboard, setClipboard] = useCopyToClipboard();

	const handleCopy = () => {
		setClipboard(companyData?.companyCode);
		toast({
			title: t("codeCopied"),
			variant: "success",
			duration: 2000,
		});
	};

	useEffect(() => {
		if (companyData && companyRef && companyData.companyCode === undefined) {
			generateCompanyCode(companyRef);
		}
	}, [loading]);

	if (companyRef === null || loading || error) return null;

	return (
		<div className="flex flex-col gap-2 items-end">
			<h1
				onClick={handleCopy}
				onKeyDown={handleCopy}
				className="text-xl cursor-pointer"
			>
				Invite Code: {companyData?.companyCode}
			</h1>

			<GenerateNewCodeButton companyRef={companyRef} />
		</div>
	);
}
