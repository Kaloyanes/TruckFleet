import { unstable_setRequestLocale } from "next-intl/server";

export default async function ChatPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;

    const {
        locale
    } = params;

    unstable_setRequestLocale(locale);

    return (
		<h1 className="flex h-screen w-full items-center justify-center font-bold text-2xl">
			Select Chat
		</h1>
	);
}
