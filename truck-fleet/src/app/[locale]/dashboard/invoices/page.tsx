"use client";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { IconFilter, IconPlus, IconSearch } from "@tabler/icons-react";
import { AddInvoice } from "./components/AddInvoice/AddInvoice";
import { InvoiceTable } from "./components/InvoiceTable/InvoiceTable";
import { useInvoicesStore } from "@/stores/Invoices/InvoicesStore";
import { useEffect } from "react";
import useCompanyId from "@/hooks/useCompanyId";

export default function InvoicesPage() {
	const { invoices, loadInvoices, isLoading } = useInvoicesStore();
	const { companyId } = useCompanyId();
	useEffect(() => {
		if (companyId) loadInvoices(companyId);
	}, [loadInvoices, companyId]);

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="mx-5 mt-4 flex flex-col">
			<div className="flex w-full items-center justify-between">
				<div className="relative max-w-80 flex-[1]">
					<InputWithIcon
						icon={<IconSearch size={18} className="text-muted-foreground" />}
						position="leading"
						inputProps={{
							placeholder: "Search",
						}}
					/>
					<Button
						size={"icon"}
						className="absolute top-[0px] right-0 hover:translate-y-0 "
						variant={"ghost"}
					>
						<IconFilter size={18} className="text-muted-foreground" />
					</Button>
				</div>

				<AddInvoice />
			</div>
			<div className="mt-4">
				<InvoiceTable data={invoices} />
			</div>
		</div>
	);
}
