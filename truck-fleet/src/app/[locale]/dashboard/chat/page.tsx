import { setRequestLocale } from "next-intl/server";

export default async function ChatPage({
	params: { locale },
}: { params: { locale: string } }) {
	setRequestLocale(locale);

	return (
		<div className="flex flex-1 items-center justify-center">
			<h1 className="font-bold text-2xl">Select Chat</h1>
		</div>
	);
}
