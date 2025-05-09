import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast, useToast } from "@/components/ui/use-toast";
import { auth, db } from "@/lib/Firebase";
import { Link, useRouter } from "@/i18n/routing";
import type { Driver } from "@/types/driver";
import { useDriverOptionsStore } from "@/stores/Drivers/DriverOptionsStore";
import { AvatarFallback } from "@radix-ui/react-avatar";
import {
	IconGraphFilled,
	IconMessage,
	IconPhone,
	IconTrash,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCopyToClipboard } from "react-use";

export const EmployeeColumns: ColumnDef<Driver>[] = [
	{
		id: "name",
		accessorFn: (row) => row.name,
		enableGlobalFilter: true,
		header(props) {
			const t = useTranslations("EmployeeList");
			return <span>{t("name")}</span>;
		},
		cell: ({ getValue, row }) => {
			const { view } = useDriverOptionsStore();
			const name = getValue() as string;

			const photoUrl = row.original.photoUrl;

			return (
				<div
					className={`flex items-center gap-2 ${view === "grid" ? "flex-col" : ""}`}
				>
					<Avatar className={`${view === "grid" ? "h-10 w-10" : ""}`}>
						<AvatarImage src={photoUrl} alt={name} className="object-cover" />
						<AvatarFallback>
							{(name as string)
								?.split(" ")
								.map((name) => name[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
					<span>{name}</span>
				</div>
			);
		},
	},
	{
		id: "email",
		accessorKey: "email",
		header(props) {
			const t = useTranslations("EmployeeList");
			return <span>{t("email")}</span>;
		},
		cell: ({ getValue }) => {
			const [clipboard, setClipboard] = useCopyToClipboard();
			const { toast } = useToast();
			const value = getValue() as string;
			const t = useTranslations("General");

			useEffect(() => {
				if (clipboard.value === value) {
					toast({
						title: t("copiedToClipboard"),
						variant: "success",
					});
				}
			}, [clipboard, toast, value, t]);

			return (
				<button
					type="button"
					className="cursor-pointer text-left hover:underline"
					onClick={() => setClipboard(value)}
					onKeyUp={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setClipboard(value);
						}
					}}
					aria-label={t("copiedToClipboard", { value })}
				>
					{value}
				</button>
			);
		},
	},
	{
		accessorKey: "phone",
		id: "phone",
		header(props) {
			const t = useTranslations("EmployeeList");
			return <span>{t("phone")}</span>;
		},
		cell: ({ getValue }) => {
			const [clipboard, setClipboard] = useCopyToClipboard();
			const { toast } = useToast();
			const value = getValue() as string;
			const t = useTranslations("General");

			useEffect(() => {
				if (clipboard.value === value) {
					toast({
						title: t("copiedToClipboard"),
						variant: "success",
					});
				}
			}, [clipboard, toast, value, t]);

			return (
				<button
					type="button"
					className="cursor-pointer text-left hover:underline"
					onClick={() => setClipboard(value)}
					onKeyUp={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setClipboard(value);
						}
					}}
					aria-label={t("copiedToClipboard", { value })}
				>
					{value}
				</button>
			);
		},
	},
	{
		accessorKey: "type",
		// header: "Type",
		header(props) {
			const t = useTranslations("EmployeeList");
			return <span>{t("role")}</span>;
		},
		cell: ({ getValue }) => {
			const t = useTranslations("EmployeePage");

			return <span>{t(getValue() as string as any)}</span>;
		},
	},
	{
		accessorKey: "actions",
		header: "",
		cell: ({ row }) => {
			const { view, setConfirm, setSelectedDriver } = useDriverOptionsStore();
			const router = useRouter();
			const [user, userLoading] = useAuthState(auth);
			const t = useTranslations("DriverActions");

			async function createChat() {
				if (userLoading || !user) {
					toast({
						title: t("chatCreationFailed"),
						description: t("userNotLoggedIn"),
						variant: "destructive",
					});
					return;
				}

				const driverId = row.original.id;
				const currentUserId = user.uid;

				if (!driverId || typeof driverId !== "string") {
					toast({
						title: t("chatCreationFailed"),
						description: t("invalidDriverId"),
						variant: "destructive",
					});
					return;
				}

				if (!currentUserId || typeof currentUserId !== "string") {
					toast({
						title: t("chatCreationFailed"),
						description: t("invalidUserId"),
						variant: "destructive",
					});
					return;
				}

				if (currentUserId === driverId) {
					toast({
						title: t("chatWithSelfError"),
						variant: "destructive",
					});
					return;
				}

				const participants = [driverId, currentUserId].sort();

				const chatQuery = query(
					collection(db, "chats"),
					where("participants", "==", participants),
				);

				try {
					const chatSnapshot = await getDocs(chatQuery);

					if (!chatSnapshot.empty) {
						const chatId = chatSnapshot.docs[0].id;
						router.push(`/dashboard/chat/${chatId}`);
						return;
					}

					const chatValues = {
						createdAt: new Date(),
						lastMessagedAt: new Date(),
						participants: participants, // Corrected object syntax
					};
					const chatRef = await addDoc(collection(db, "chats"), chatValues);

					router.push(`/dashboard/chat/${chatRef.id}`);
				} catch (error) {
					console.error("Error creating or finding chat:", error);
					toast({
						title: t("chatOperationFailed"),
						description: error instanceof Error ? error.message : String(error),
						variant: "destructive",
					});
				}
			}

			return (
				<div className="flex justify-end gap-2">
					<Link href={`/dashboard/employees/${row.original.id}/stats`}>
						<Button variant="outline" size="icon">
							<IconGraphFilled />
						</Button>
					</Link>
					<Button variant="outline" size="icon">
						<IconPhone />
					</Button>
					<Button variant="outline" size="icon" onClick={createChat}>
						<IconMessage />
					</Button>
					<Button
						variant="outline"
						className="border-red-500/50 bg-red-500/15 text-red-800 hover:bg-red-500/50 dark:text-red-200"
						size="icon"
						onClick={() => {
							setConfirm(true);
							setSelectedDriver(row.original);
						}}
					>
						<IconTrash />
					</Button>
				</div>
			);
		},
	},
];
