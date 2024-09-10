"use client";
import useMediaQuery from "@/hooks/useMediaQuery";
import React, { useEffect } from "react";
import { useFavicon } from "react-use";

export default function Favicon() {
	// const favicon = useFavicon("/packages.svg");

	const mediaQuery = useMediaQuery("(prefers-color-scheme: dark)");
	useEffect(() => {
		const favicon = document.querySelector(
			'link[rel="icon"]',
		) as HTMLLinkElement;

		if (mediaQuery) {
			favicon.href = "/packages_dark.png";
		} else {
			favicon.href = "/packages_light.png";
		}
	}, [mediaQuery]);

	return null;
}
