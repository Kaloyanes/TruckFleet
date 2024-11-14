import AnimatedTabs from "@/components/AnimatedTabs";
import LetterPullup from "@/components/ui/letter-pullup";
import SaveButton from "./components/SaveButton";
// import SaveButton from "./components/SaveButton";

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
		// TODO: Remove this tab for speditors
		{
			label: "company",
			value: "/dashboard/settings/company",
		},
	];

	return (
		<div className="flex w-full flex-col gap-10 overflow-x-hidden ">
			<div className="sticky top-0 bg-sidebar-border/25 px-14 pb-3 backdrop-blur-md flex items-center w-full justify-between ">
				<div className="space-y-2">
					<LetterPullup className="w-fit" words="Settings" />
					<div className="w-fit rounded-full bg-accent p-1">
						<AnimatedTabs tabs={tabs} />
					</div>
				</div>
				<SaveButton />
			</div>
			<section className="w-full px-14 pb-6">{children}</section>
		</div>
	);
}
