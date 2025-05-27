import * as React from "react";
import {
	TextInput,
	type TextInputProps,
	View,
	TouchableOpacity,
} from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";

interface InputProps extends TextInputProps {
	icon?: React.ReactNode;
	iconClassName?: string;
	trailingIcon?: React.ReactNode;
	trailingIconOnPress?: () => void;
	trailingIconClassName?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
	(
		{
			className,
			placeholderClassName,
			icon,
			iconClassName,
			trailingIcon,
			trailingIconOnPress,
			trailingIconClassName,
			...props
		},
		ref,
	) => {
		const { isDarkColorScheme } = useColorScheme();

		return (
			<View className="flex flex-row items-center relative">
				{icon && (
					<View className={cn("absolute z-10 left-3", iconClassName)}>
						{icon}
					</View>
				)}
				<TextInput
					ref={ref}
					cursorColor={isDarkColorScheme ? "#fff" : "#000"}
					selectionColor={isDarkColorScheme ? "#fff" : "#000"}
					className={cn(
						"web:flex h-10 native:h-12 web:w-full rounded-2xl border border-input bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
						props.editable === false && "opacity-50 web:cursor-not-allowed",
						icon && "pl-10", // Left padding if there's an icon
						trailingIcon && "pr-10", // Right padding if there's a trailing icon
						className,
					)}
					placeholderClassName={cn(
						"text-muted-foreground",
						placeholderClassName,
					)}
					{...props}
				/>
				{trailingIcon && (
					<TouchableOpacity
						onPress={trailingIconOnPress}
						className={cn("absolute z-10 right-2", trailingIconClassName)}
					>
						{trailingIcon}
					</TouchableOpacity>
				)}
			</View>
		);
	},
);

Input.displayName = "Input";

export { Input };
