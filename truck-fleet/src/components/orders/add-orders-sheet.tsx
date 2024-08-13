import React from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

export default function AddOrdersSheet() {
	return (
		<Sheet>
			<SheetTrigger>
				<Button>Add Order</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetTitle>Add Order</SheetTitle>
			</SheetContent>
		</Sheet>
	);
}
