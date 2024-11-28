"use client";
import AutoForm from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetCloseButton,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import useCompanyId from "@/hooks/useCompanyId";
import { db, storage } from "@/lib/firebase";
import {
	type DocumentReference,
	collection,
	doc,
	getDoc,
	query,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { useUploadFile } from "react-firebase-hooks/storage";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import type { Order } from "@/types/orders";
import { useOrderOptionsStore } from "@/stores/Orders/OrdersOptionsStore";
import { IconPlus } from "@tabler/icons-react";
import { getDownloadURL, ref } from "firebase/storage";
import SelectMenu from "./SelectMenu";
import {
	createSheetFormSchema,
	useAddOrderStore,
} from "@/stores/Orders/AddOrderStore";

export default function AddOrdersSheet() {
	const t = useTranslations("AddOrderSheet");
	const { companyId } = useCompanyId();
	const { toast } = useToast();

	const { showEditSheet, openEditSheet, order, setOrder } =
		useOrderOptionsStore();

	const [drivers, driverLoading, driverError] = useCollectionOnce(
		companyId
			? query(
					collection(db, "users"),
					where("companyId", "==", companyId),
					where("type", "==", "driver"),
				)
			: null,
	);
	const [companies, companiesLoading, companiesError] = useCollectionOnce(
		companyId
			? query(collection(db, "companies", companyId, "customers"))
			: null,
	);
	const [trucks, truckLoading, truckError] = useCollectionOnce(
		query(collection(db, `companies/${companyId}/trucks`)),
	);
	const [orders] = useCollectionOnce(
		query(collection(db, `companies/${companyId}/orders`)),
	);

	const [uploadFile, uploading, snapshot, error] = useUploadFile();

	if (driverError || companiesError || truckError) {
		console.error(driverError, companiesError, truckError);
	}

	const {
		driverName,
		driverRef,
		licensePlate,
		truckRef,
		companyName,
		companyRef,
		values,
		initialValues,
		setDriverName,
		setDriverRef,
		setTruckName,
		setTruckRef,
		setCompanyName,
		setCompanyRef,
		setValues,
		populateData,
		addOrder,
	} = useAddOrderStore();

	useEffect(() => {
		if (companyId) populateData(order, companyId);
	}, [order, companyId, populateData]);

	useEffect(() => {
		console.log(truckRef);
	}, [truckRef]);

	function getDocumentDescription() {
		// return order
		// 	? `Uploading a new document will replace the current one. Current document is ${order.documents.name}`
		// 	: "";
		if (!order?.documents) {
			return "";
		}

		return (
			<div className="flex flex-col gap-2 text-md ">
				<h1>
					{order ? "Uploading a new document will replace the current one" : ""}
				</h1>
				<h1>{order ? `Current document is ${order.documents.name}` : ""}</h1>
			</div>
		);
	}

	return (
		<Sheet open={showEditSheet} onOpenChange={openEditSheet}>
			<Tooltip>
				<TooltipTrigger asChild>
					<SheetTrigger asChild>
						<Button
							onClick={() => {
								setOrder(null);
							}}
							variant={"outline"}
							size={"icon"}
						>
							<IconPlus />
						</Button>
					</SheetTrigger>
				</TooltipTrigger>
				<TooltipContent>{t("title")}</TooltipContent>
			</Tooltip>
			<SheetContent
				className="overflow-x-hidden overflow-y-scroll "
				showCloseButton={false}
			>
				{!driverLoading && !companiesLoading && !truckLoading && (
					<>
						<SheetHeader className="flex flex-row items-center">
							<SheetTitle className="w-full flex-1">
								{order ? `${t("editTitle")} #${order.id}` : t("title")}
							</SheetTitle>
							<SheetCloseButton className="static" />
						</SheetHeader>
						<AutoForm
							values={initialValues as any}
							formSchema={createSheetFormSchema(t as any)}
							onValuesChange={(formValues) => {
								console.log(formValues, driverRef, truckRef, companyRef);
								if (driverRef && truckRef && companyRef) {
									setValues({
										id: "",
										status: formValues.status ?? "Pick Up",
										driver: driverRef,
										truck: truckRef,
										companyId: companyId ?? "",
										company: {
											ref: companyRef,
											name: companyName,
											worker: formValues.company?.worker ?? "",
										},
										palletes: formValues.palletes ?? [],
										pickUps: formValues.pickUps ?? [],
										deliveries: formValues.deliveries ?? [],
										note: formValues.note ?? "",
										createdAt: new Date(),
										licensePlate: licensePlate,
										documents: formValues.documents as any,
									});
								}
							}}
							className="flex w-full flex-col gap-6 p-2"
							fieldConfig={{
								documents: {
									fieldType: "file",
									description: getDocumentDescription(),
								},
								driver: {
									renderParent: ({ children }: any) => (
										<SelectMenu
											selectedValue={driverName}
											setValue={setDriverName}
											values={drivers}
											setRef={setDriverRef}
											selectText={t("selectDriver")}
											filterText={t("filterDrivers")}
											addText={t("addDriver")}
											field="name"
										/>
									),
								},
								truck: {
									renderParent: ({ children }: any) => (
										<SelectMenu
											selectedValue={licensePlate}
											setValue={setTruckName}
											values={trucks}
											setRef={setTruckRef}
											selectText={t("selectTruck")}
											filterText={t("filterTrucks")}
											addText={t("addTruck")}
											field="licensePlate"
										/>
									),
								},
								company: {
									name: {
										renderParent: ({ children }: any) => (
											<SelectMenu
												selectedValue={companyName}
												setValue={setCompanyName}
												values={companies}
												setRef={setCompanyRef}
												selectText={t("selectCompany")}
												filterText={t("filterCompanies")}
												addText={t("addCompany")}
												field="name"
											/>
										),
									},
								},
							}}
						>
							<SheetFooter className="sticky bottom-0 z-[99999999] flex items-center justify-end gap-2">
								<SheetClose asChild>
									<Button
										size={"sm"}
										type="button"
										className="min-w-20 max-w-32"
										variant="outline"
									>
										{t("cancel")}
									</Button>
								</SheetClose>
								<Button
									size={"sm"}
									onClick={() =>
										addOrder(
											values,
											companyId,
											orders,
											order,
											uploadFile,
											toast,
											openEditSheet,
										)
									}
									className="min-w-20 max-w-32"
									type="submit"
								>
									{order ? t("edit") : t("add")}
								</Button>
							</SheetFooter>
						</AutoForm>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
