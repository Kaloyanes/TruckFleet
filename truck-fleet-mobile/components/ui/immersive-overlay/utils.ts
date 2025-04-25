import color from "tinycolor2";
import type { ImmersiveOverlayState } from "./store";

/**Utility function that helps us render the proper colors for the overlay */
/**Note, i think this is a bit ugly, please be my guest to refactor it! */

export const generateColors = (colors: ImmersiveOverlayState["colors"]) => {
	//The last color will be our transparent color (alpha of (0.2)), so we seperate this from the others
	// The reason for this is because we want this color to be our new background color, you could also opt to just completely setting it to 0.
	const darkColors = colors?.expanding?.dark?.slice(0, -1);
	const lastDarkColor =
		colors?.expanding?.dark?.[colors?.expanding?.dark?.length - 1];

	const lightColors = colors?.expanding?.light?.slice(0, -1);
	const lastLightColor =
		colors?.expanding?.light?.[colors?.expanding?.light?.length - 1];

	return {
		primary: colors?.primary || "#5465ff",
		secondary: colors?.secondary || "#5465ff",
		expanding: {
			dark: [
				// All other colors are 95% opacity, the last one is 100% opacity
				...(darkColors || []).map((c) => color(c).setAlpha(0.95).toRgbString()),
				// Also add the last color with 100% opacity
				color(lastDarkColor || "#5465ff")
					.setAlpha(0.95)
					.toRgbString(),
				// Also add the last color with 20% opacity
				color(lastDarkColor || "#5465ff")
					.setAlpha(0.2)
					.toRgbString(),
			],
			light: [
				...(lightColors || []).map((c) =>
					color(c).setAlpha(0.95).toRgbString(),
				),
				color(lastLightColor || "#0077b6")
					.setAlpha(0.95)
					.toRgbString(),
				color(lastLightColor || "#0077b6")
					.setAlpha(0.2)
					.toRgbString(),
			],
		},
	};
};
