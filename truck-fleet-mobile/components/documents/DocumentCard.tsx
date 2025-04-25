import type React from "react";
import { Image, View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Doc } from "~/stores/document-store";
import { IconFile } from "@tabler/icons-react-native";
import { Text } from "../ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { colors } from "~/lib/colors";

interface DocumentCardProps {
	item: Doc;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ item }) => {
	const { isDarkColorScheme } = useColorScheme();
	const iconColor = isDarkColorScheme ? colors.gray[400] : colors.gray[500];
	// Check if the type starts with 'image/' and there is a URL
	const hasImage =
		item.type?.startsWith("image/") && item.url && item.url.length > 0;

	return (
		<Card className="m-2 flex-1 shadow-md shadow-foreground/5">
			<CardContent className="p-0 overflow-hidden rounded-t-xl h-40">
				{hasImage ? (
					<Image
						source={{ uri: item.url[0] }} // Use first url if it's an image
						className="w-full h-full"
						resizeMode="cover"
					/>
				) : (
					// Show icon if not an image or no URL
					<View className="flex-1 items-center justify-center bg-muted/30">
						<IconFile size={48} color={iconColor} />
						{item.type && (
							<Text className="text-xs text-muted-foreground mt-1">
								{/* Display the type, converting common image types for brevity */}
								{item.type.startsWith("image/")
									? item.type.split("/")[1].toUpperCase()
									: item.type.toUpperCase()}
							</Text>
						)}
					</View>
				)}
			</CardContent>
			<CardHeader className="p-3">
				<CardTitle className="text-base font-semibold" numberOfLines={1}>
					{item.name}
				</CardTitle>
			</CardHeader>
		</Card>
	);
};

export default DocumentCard;
