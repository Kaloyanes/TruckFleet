import ChatRedirect from "@/components/redirects/ChatRedirect";

export default function ChatSlugLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<ChatRedirect />
			<section>{children}</section>
		</>
	);
}
