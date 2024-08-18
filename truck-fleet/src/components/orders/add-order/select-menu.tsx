import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import useMediaQuery from "@/hooks/useMediaQuery";
import type {
	DocumentData,
	DocumentReference,
	QuerySnapshot,
} from "firebase/firestore";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface SelectDriverMenuProps {
	selectedValue: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	values: QuerySnapshot<DocumentData, DocumentData> | undefined;
	setRef: React.Dispatch<React.SetStateAction<DocumentReference | null>>;
	selectText: string;
	filterText: string;
	addText: string;
	field: string;
}

export default function SelectMenu({
	values,
	setRef,
	selectedValue,
	setValue,
	selectText,
	filterText,
	field,
	addText,
}: SelectDriverMenuProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [open, setOpen] = useState(false);

	if (isDesktop) {
		return (
			<>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button variant="outline" className="w-full justify-start">
							{selectedValue !== "" ? <>{selectedValue}</> : <>{selectText}</>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-full p-0" align="start">
						<DriverList
							values={values}
							setOpen={setOpen}
							setRef={setRef}
							setSelectedValue={setValue}
							filterText={filterText}
							field={field}
							addText={addText}
						/>
					</PopoverContent>
				</Popover>
			</>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline" className="w-[150px] justify-start">
					{selectedValue ? <>{selectedValue}</> : <>{selectText}</>}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mt-4 border-t">
					<DriverList
						values={values}
						setOpen={setOpen}
						setRef={setRef}
						setSelectedValue={setValue}
						filterText={filterText}
						field={field}
						addText={addText}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

function DriverList({
	setOpen,
	values,
	setRef,
	setSelectedValue,
	filterText,
	field,
	addText,
}: {
	setOpen: (open: boolean) => void;
	values: QuerySnapshot<DocumentData, DocumentData> | undefined;
	setRef: React.Dispatch<React.SetStateAction<DocumentReference | null>>;
	setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
	filterText: string;
	field: string;
	addText: string;
}) {
	const t = useTranslations("AddOrderSheet");

	return (
		<Command>
			<CommandInput placeholder={filterText} />
			<CommandList>
				<CommandEmpty>
					<motion.div
						initial={{ opacity: 0, scale: 0.7, y: -10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
						className="gap-4 flex flex-col px-6"
					>
						<h1>{t("noResultsFound")}</h1>
						<Button>{addText}</Button>
					</motion.div>
				</CommandEmpty>
				<CommandGroup>
					{values?.docs.map((driver) => {
						const driverData = driver.data();
						return (
							<CommandItem
								key={driver.id}
								value={driverData.name}
								onSelect={(value) => {
									setRef(driver?.ref ?? null);
									setSelectedValue(value);
									setOpen(false);
								}}
							>
								{driverData[field]}
							</CommandItem>
						);
					})}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
