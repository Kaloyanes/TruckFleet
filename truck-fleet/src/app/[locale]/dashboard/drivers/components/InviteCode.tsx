"use client";
import { useToast } from "@/components/ui/use-toast";
import useCompanyId from "@/hooks/useCompanyId";
import { generateCompanyCode } from "@/lib/GenerateCompanyCode";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useCopyToClipboard } from "react-use";
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
	}, [companyData, companyRef]);

	if (companyRef === null || loading || error) return null;

	return (
		<div className="flex flex-col items-end gap-2">
			<h1
				onClick={handleCopy}
				onKeyDown={handleCopy}
				className="cursor-pointer text-xl"
			>
				{t("inviteCode", { code: companyData?.companyCode })}
			</h1>

			<GenerateNewCodeButton companyRef={companyRef} />
		</div>
	);
}
