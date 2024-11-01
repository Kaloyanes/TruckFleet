"use client";
import ChatRedirect from "@/components/redirects/ChatRedirect";
import ChatEditContextProvider from "@/context/chat/chat-edit-context";
import { setRequestLocale } from "next-intl/server";
import { DeleteMessageDialog } from "@/app/[locale]/dashboard/chat/[chatId]/components/DeleteMessageDialog";
import { DeleteMessageProvider } from "@/context/chat/delete-message-context";
import { APIProvider } from "@vis.gl/react-google-maps";

export default function ChatSlugLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	// setRequestLocale(locale);

	return (
		<ChatEditContextProvider>
			<DeleteMessageProvider>
				<APIProvider
					apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
				>
					<ChatRedirect />
					<section className="flex flex-1 flex-col overflow-hidden">
						{children}
					</section>
				</APIProvider>
				<DeleteMessageDialog />
			</DeleteMessageProvider>
		</ChatEditContextProvider>
	);
}
