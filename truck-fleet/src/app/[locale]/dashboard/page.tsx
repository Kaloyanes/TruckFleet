import SignOutButton from "@/app/[locale]/dashboard/components/SignOutButton";
import { setRequestLocale } from "next-intl/server";

export default async function DashboardPage(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale);
  return (
    <>
      <div className="flex h-20 w-20">
        <h1>Dashboard Page</h1>
        <SignOutButton />
      </div>
    </>
  );
}
