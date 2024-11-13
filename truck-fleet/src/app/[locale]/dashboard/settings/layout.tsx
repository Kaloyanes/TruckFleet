import AnimatedTabs from "@/components/AnimatedTabs";
import LetterPullup from "@/components/ui/letter-pullup";

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const tabs = [
		{
			label: "general",
			value: "/dashboard/settings",
		},
		{
			label: "account",
			value: "/dashboard/settings/account",
		},
	];

	return (
		<div className="flex flex-col gap-10 px-14 w-full">
			<div className="">
				<LetterPullup className="w-fit" words="Settings" />
				<div className="w-fit rounded-full bg-accent p-1">
					<AnimatedTabs tabs={tabs} />
				</div>
			</div>
			<section className="w-full">{children}</section>
		</div>
	);
}
