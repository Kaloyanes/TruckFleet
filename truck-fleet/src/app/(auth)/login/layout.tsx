import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Login",
  description: "Login page for the app.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
