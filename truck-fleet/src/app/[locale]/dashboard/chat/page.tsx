import LetterPullup from "@/components/ui/letter-pullup";
import TypingAnimation from "@/components/ui/typing-animation";
import WordPullUp from "@/components/ui/word-pull-up";
import { setRequestLocale } from "next-intl/server";

export default async function ChatPage({
	params: { locale },
}: { params: { locale: string } }) {
	setRequestLocale(locale);

	return (
		<div className="flex h-screen flex-1 items-center justify-center">
			<TypingAnimation className="font-semibold" text="Select Chat" />
		</div>
	);
}
