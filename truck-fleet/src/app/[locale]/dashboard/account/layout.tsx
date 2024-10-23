import { unstable_setRequestLocale } from "next-intl/server";

export default async function ProfileLayout(
    props: {
        children: React.ReactNode;
        params: Promise<{ locale: string }>;
    }
) {
    const params = await props.params;

    const {
        locale
    } = params;

    const {
        children
    } = props;

    unstable_setRequestLocale(locale);
    return <section>{children}</section>;
}
