import {
	Canvas,
	Fill,
	Image,
	BackdropBlur,
	useImage,
	LinearGradient,
	Group,
	Mask,
	Rect,
	BackdropFilter,
	Paint,
	Blur,
} from "@shopify/react-native-skia";
import { Dimensions } from "react-native";

export default function BlurredImage() {
	const image = useImage(require("~/assets/images/landing.jpg"));
	const { width, height } = Dimensions.get("screen");

	if (!image) return null;

	return (
		<Canvas style={{ width, height }}>
			<Image
				image={image}
				x={0}
				y={0}
				width={width}
				height={height}
				fit="cover"
			/>

			<Mask
				mask={
					<Group>
						<LinearGradient
							start={{ x: 0, y: 0 }}
							end={{ x: 0, y: height * 0.7 }}
							colors={["transparent", "white"]}
						/>
						<Rect x={0} y={0} width={width} height={height} />
					</Group>
				}
			>
				<Image
					image={image}
					x={0}
					y={0}
					width={width}
					height={height}
					fit="cover"
				>
					<Blur blur={10} mode={"clamp"} />
				</Image>
			</Mask>
		</Canvas>
	);
}
