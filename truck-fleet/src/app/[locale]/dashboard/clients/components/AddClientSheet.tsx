"use client";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { IconPlus } from "@tabler/icons-react";
import React from "react";

export default function AddClientSheet() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button size={"icon"} variant={"outline"}>
					<IconPlus />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetTitle>Add a customer</SheetTitle>
			</SheetContent>
		</Sheet>
	);
}
