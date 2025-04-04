"use client";
import LanguageSelector from "@/components/settings/LanguageSelector";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Header from "./components/Header";
import { Particles } from "@/components/magicui/particles";
import { color, motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Hero from "./components/sections/Hero";
import Pricing from "./components/sections/Pricing";
import Footer from "./components/Footer";
import Problem from "./components/sections/Problem";
import Solution from "./components/sections/Solution";
import { OptimizationText } from "./components/sections/OptimizationText";
import Team from "./components/sections/Team";

export default function HomePage() {
	const t = useTranslations("Home");

	return (
		<main className="flex h-full w-full flex-col gap-20 ">
			<Header />

			<div className="space-y-20 px-6">
				<Hero />
			</div>

			<OptimizationText />

			<div className="space-y-20 px-6">
				<Problem />
				<Solution />
				{/* <Team /> */}
			</div>
			<Pricing />

			<Footer />
		</main>
	);
}
