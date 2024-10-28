import ChatRedirect from "@/components/redirects/ChatRedirect";
import ChatEditContextProvider from "@/context/chat/chat-edit-context";
import { setRequestLocale } from "next-intl/server";

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
			<ChatRedirect />
			<section>{children}</section>
		</ChatEditContextProvider>
	);
}
