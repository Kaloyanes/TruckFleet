import { unstable_setRequestLocale } from "next-intl/server";

export default function ChatPage({
	params: { locale },
}: { params: { locale: string } }) {
	unstable_setRequestLocale(locale);

	return (
		<h1 className="flex h-screen w-full items-center justify-center text-2xl font-bold">
			Select Chat
		</h1>
	);
}
