import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";

export default async function ChatPage({
	params: { locale },
}: { params: { locale: string } }) {
	setRequestLocale(locale);

	return (
		<h1 className="flex h-screen w-full items-center justify-center font-bold text-2xl">
			Select Chat
		</h1>
	);
}
