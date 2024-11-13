"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import useCompanyId from "@/hooks/useCompanyId";
import { useCompanyStore } from "@/stores/Settings/CompanyStore";
import { useEffect } from "react";

export default function CompanyPage() {
	const { setField, load, isLoading, ...values } = useCompanyStore();

	const groups = [
		{
			label: "Company",
			fields: [
				{ label: "Name", value: values.name },
				{ label: "Person in Charge", value: values.personInCharge },
				{ label: "Email", value: values.ownerEmail },
				{ label: "Phone", value: values.phone },
				{ label: "Address", value: values.address },
			],
		},
		{
			label: "Invoice",
			fields: [
				{ label: "IBAN", value: values.name },
				{ label: "Bank", value: values.name },
				{ label: "Bank Code", value: values.name },
				{ label: "VAT Number", value: values.name },
			],
		},
	];

	const { companyId } = useCompanyId();
	useEffect(() => {
		console.log(companyId);
		if (companyId) load(companyId);
	}, [companyId, load]);

	if (isLoading) {
		return (
			<div className="h-full w-full">
				<Spinner />
			</div>
		);
	}

	return (
		<Card className="w-full flex-1">
			{groups.map((group, index) => (
				<div key={group.label}>
					<CardHeader>
						<CardTitle>{group.label}</CardTitle>
					</CardHeader>

					<CardContent className="space-y-2">
						{group.fields.map((field) => (
							<div key={field.label} className="space-y-2">
								<Label>{field.label}:</Label>
								<Input
									name={field.label}
									value={field.value}
									onChange={(e) =>
										setField(
											field.label
												.split(" ")
												.map((word, index) =>
													index === 0
														? word.toLowerCase()
														: word.charAt(0).toUpperCase() + word.slice(1),
												)
												.join(""),
											e.target.value,
										)
									}
								/>
							</div>
						))}
					</CardContent>

					{index < groups.length - 1 && <Separator className="my-0" />}
				</div>
			))}
		</Card>
	);
}
