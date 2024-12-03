import LetterPullup from "@/components/ui/letter-pullup";
import TypingAnimation from "@/components/ui/typing-animation";
import WordPullUp from "@/components/ui/word-pull-up";
import { setRequestLocale } from "next-intl/server";

export default async function ChatPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;

    const {
        locale
    } = params;

    setRequestLocale(locale);

    return (
		<div className="flex h-screen flex-1 items-center justify-center">
			<TypingAnimation className="font-semibold" text="Select Chat" />
		</div>
	);
}
