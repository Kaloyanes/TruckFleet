import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { IconFilter, IconPlus, IconSearch } from "@tabler/icons-react";
import { AddInvoice } from "./components/AddInvoice";

export default function InvoicesPage() {
	return (
		<div className="mx-5 mt-2 flex flex-col pt-4">
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
		</div>
	);
}
