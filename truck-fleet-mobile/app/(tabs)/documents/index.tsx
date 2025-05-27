import { View, Dimensions, ActivityIndicator } from "react-native";
import React, { useEffect } from "react"; // Import useEffect
import { IconFilePlus } from "@tabler/icons-react-native";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import FabButton from "~/components/FabButton";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { MasonryFlashList } from "@shopify/flash-list";
import DocumentCard from "~/components/documents/DocumentCard"; // Import the new component
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"; // Import the custom hook
import { useDocumentStore } from "~/stores/document-store"; // Import the document store

export default function DocumentsPage() {
	const { isDarkColorScheme } = useColorScheme();
	const { t } = useTranslation();
	const { documents, loadDocuments, isLoading } = useDocumentStore(); // Use the document store

	useEffect(() => {
		loadDocuments(); // Load documents on mount
	}, [loadDocuments]);

	const numColumns = 2;
	const bottomTabHeight = useBottomTabBarHeight();

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<View className="flex-1 relative pt-2">
			{documents.length > 0 ? (
				<MasonryFlashList
					data={documents} // Use real documents data
					numColumns={numColumns}
					automaticallyAdjustsScrollIndicatorInsets
					contentInsetAdjustmentBehavior="automatic"
					contentInset={{ bottom: 0 }}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<DocumentCard item={item} /> // Use the new DocumentCard component
					)}
					estimatedItemSize={250} // Adjust estimated size slightly due to padding/title changes
					contentContainerClassName="p-2" // Increased padding around the list container
					ListFooterComponent={<View style={{ height: bottomTabHeight }} />} // Adjusted for bottom tab bar
				/>
			) : (
				<View className="flex-1 items-center justify-center">
					<Text>No documents found</Text>
				</View>
			)}

			<FabButton
				path="documents"
				icon={() => (
					<IconFilePlus size={28} color={isDarkColorScheme ? "#000" : "#fff"} />
				)}
				onPress={() => {
					router.push("/(tabs)/documents/new-document"); // Keep navigation
				}}
			/>
		</View>
	);
}
