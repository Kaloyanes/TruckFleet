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
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";
import Problem from "./components/Problem";
import Solution from "./components/Solution";
import { OptimizationText } from "./components/OptimizationText";

export default function HomePage() {
	const t = useTranslations("Home");

	return (
		<main className="flex h-full w-full flex-col gap-20 ">
			<Header />
			<div className="px-6">
				<Hero />
			</div>
			<OptimizationText />
			<div className="px-6">
				<Problem />
				<Solution />
			</div>
			<Footer />
		</main>
	);
}
