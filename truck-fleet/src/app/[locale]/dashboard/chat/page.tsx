import { unstable_setRequestLocale } from "next-intl/server";

export default function ChatPage({
	params: { locale },
}: { params: { locale: string } }) {
	unstable_setRequestLocale(locale);

	return <h1>Welcome to Chatpage!</h1>;
}
