import ChatRedirect from "@/components/redirects/ChatRedirect";
import ChatEditContextProvider from "@/context/chat/chat-edit-context";
import { setRequestLocale } from "next-intl/server";
import { DeleteMessageDialog } from "@/app/[locale]/dashboard/chat/[chatId]/components/DeleteMessageDialog";
import { DeleteMessageProvider } from "@/context/chat/delete-message-context";

export default function ChatSlugLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	setRequestLocale(locale);

	return (
		<ChatEditContextProvider>
			<DeleteMessageProvider>
				<ChatRedirect />
				<section className="flex flex-1 flex-col overflow-hidden">
					{children}
				</section>
				<DeleteMessageDialog />
			</DeleteMessageProvider>
		</ChatEditContextProvider>
	);
}
