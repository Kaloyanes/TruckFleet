"use client";

import { MotionConfig, type MotionConfigProps } from "framer-motion";
import type React from "react";

export default function MotionConfigProvider({
	children,
	props,
}: { children: React.ReactNode; props: MotionConfigProps }) {
	return <MotionConfig {...props}>{children}</MotionConfig>;
}
