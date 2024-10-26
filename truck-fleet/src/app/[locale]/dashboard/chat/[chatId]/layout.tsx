import ChatRedirect from "@/components/redirects/ChatRedirect";
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
		<>
			<ChatRedirect />
			<section>{children}</section>
		</>
	);
}
