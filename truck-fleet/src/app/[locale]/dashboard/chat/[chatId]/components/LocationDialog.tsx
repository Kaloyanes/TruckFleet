"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Map as GoogleMap,
	Marker,
	RenderingType,
} from "@vis.gl/react-google-maps";
import { useTheme } from "next-themes";
import { Label } from "../../../../../../components/ui/label";
import { useTranslations } from "next-intl";

interface LocationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onLocationSelect: (location: { lat: number; lng: number }) => void;
}

export default function LocationDialog({
	open,
	onOpenChange,
	onLocationSelect,
}: LocationDialogProps) {
	const [location, setLocation] = useState({
		lat: 47.69832613293271,
		lng: 14.213432647922234,
	});
	const [zoom, setZoom] = useState(4);
	const t = useTranslations("LocationDialog");
	const { resolvedTheme } = useTheme();
	const mapId =
		resolvedTheme === "dark" ? "71b489216afed105" : "41fca17a46fdb39e";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<Label>{t("latitude")}</Label>
							<Input
								type="number"
								placeholder={t("latitude")}
								value={location.lat}
								onChange={(e) =>
									setLocation((prev) => ({
										...prev,
										lat: Number.parseFloat(e.target.value) || 0,
									}))
								}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label>{t("longitude")}</Label>
							<Input
								type="number"
								placeholder={t("longitude")}
								value={location.lng}
								onChange={(e) =>
									setLocation((prev) => ({
										...prev,
										lng: Number.parseFloat(e.target.value) || 0,
									}))
								}
							/>
						</div>
					</div>
					<div className="h-[300px] w-full rounded-lg overflow-hidden">
						<GoogleMap
							zoom={zoom}
							minZoom={3}
							maxZoom={20}
							center={location}
							mapId={mapId}
							backgroundColor={"#0a0a0a"}
							disableDefaultUI={true}
							style={{ width: "100%", height: "100%" }}
							gestureHandling={"greedy"}
							keyboardShortcuts={false}
							onClick={(e) => {
								if (e.detail?.latLng) {
									setLocation({
										lat: e.detail.latLng.lat,
										lng: e.detail.latLng.lng,
									});
								}
							}}
							onZoomChanged={(e) => {
								if (e.detail) {
									setZoom(e.detail.zoom);
								}
							}}
							onCenterChanged={(e) => {
								if (e.detail?.center) {
									setLocation({
										lat: e.detail.center.lat,
										lng: e.detail.center.lng,
									});
								}
							}}
							renderingType={RenderingType.VECTOR}
						>
							<Marker position={location} />
						</GoogleMap>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={() => onLocationSelect(location)}>
						{t("send")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
