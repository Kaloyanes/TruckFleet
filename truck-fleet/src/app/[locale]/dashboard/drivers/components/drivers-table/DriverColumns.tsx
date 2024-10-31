import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast, useToast } from "@/components/ui/use-toast";
import { useDriverToggleViewContext } from "@/context/drivers/driver-toggle-view-context";
import { useRemoveDriverContext } from "@/context/drivers/remove-driver-context";
import { auth, db } from "@/firebase/firebase";
import { Link, useRouter } from "@/lib/navigation";
import type { Driver } from "@/models/driver";
import { AvatarFallback } from "@radix-ui/react-avatar";
import {
	IconGraphFilled,
	IconMessage,
	IconPhone,
	IconTrash,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import {
	addDoc,
	collection,
	getDoc,
	getDocs,
	getDocsFromCache,
	or,
	query,
	where,
} from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCopyToClipboard } from "react-use";

export const DriverColumns: ColumnDef<Driver>[] = [
	{
		id: "name",
		accessorFn: (row) => row.name,
		enableGlobalFilter: true,
		header(props) {
			const t = useTranslations("EmployeeList");
			return <span>{t("name")}</span>;
		},
		cell: ({ getValue, row }) => {
			const { view } = useDriverToggleViewContext();
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
				<span
					onClick={() => setClipboard(value)}
					onKeyUp={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setClipboard(value);
						}
					}}
				>
					{value}
				</span>
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
				<span
					onClick={() => setClipboard(value)}
					onKeyUp={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setClipboard(value);
						}
					}}
				>
					{value}
				</span>
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
			const { view } = useDriverToggleViewContext();
			const { setConfirm, setDriver } = useRemoveDriverContext();
			const router = useRouter();
			const [user, userLoading] = useAuthState(auth);

			async function createChat() {
				if (userLoading || !user) {
					toast({
						title: "Couldn't create chat. Try again later.",
						variant: "destructive",
					});
					return;
				}

				if (user.uid === row.original.id) {
					toast({
						title: "You can't chat with yourself.",
						variant: "destructive",
					});
					return;
				}

				const chatQuery = query(
					collection(db, "chats"),
					where("participants", "array-contains", user.uid),
				);

				const chatSnapshot = await getDocs(chatQuery);
				console.log("chatSnapshot", chatSnapshot);
				if (!chatSnapshot.empty) {
					for (const doc of chatSnapshot.docs) {
						const chat = doc.data();

						if (!chat.participants.includes(row.original.id)) {
							continue;
						}

						router.push(`/dashboard/chat/${doc.id}`);
						return;
					}
				}

				const chatValues = {
					createdAt: new Date(),
					lastMessagedAt: new Date(),
					participants: [row.original.id, user.uid].sort(),
				};
				const chatRef = await addDoc(collection(db, "chats"), chatValues);

				router.push(`/dashboard/chat/${chatRef.id}`);
			}

			return (
				<div className="flex justify-end gap-2">
					<Link href={`/dashboard/drivers/${row.original.id}/stats`}>
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
							setDriver(row.original);
						}}
					>
						<IconTrash />
					</Button>
				</div>
			);
		},
	},
];
