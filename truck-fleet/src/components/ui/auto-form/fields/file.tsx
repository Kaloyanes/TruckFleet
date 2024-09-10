import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import type { AutoFormInputComponentProps } from "../types";
import { IconTrash } from "@tabler/icons-react";
import { Button } from "../../button";
import { FileUpload } from "../../file-upload";
import { AnimatePresence, motion } from "framer-motion";
export default function AutoFormFile({
	label,
	isRequired,
	fieldConfigItem,
	fieldProps,
	field,
}: AutoFormInputComponentProps) {
	const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
	const showLabel = _showLabel === undefined ? true : _showLabel;
	const [file, setFile] = useState<File | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);

	const handleFileChange = (file: File | null) => {
		// const file = e.target.files?.[0];
		if (!file) return;

		if (file) {
			setFile(file);
			setFileName(file.name);
			field.onChange(file);
			// const reader = new FileReader();
			// reader.onloadend = () => {};
			// reader.readAsDataURL(file);
		}
	};

	const handleRemoveClick = () => {
		setFile(null);
	};

	return (
		<FormItem>
			{/* {showLabel && (
				<AutoFormLabel
					label={fieldConfigItem?.label || label}
					isRequired={isRequired}
				/>
			)}
			{!file && (
				<FormControl>
					<Input
						type="file"
						{...fieldPropsWithoutShowLabel}
						onChange={handleFileChange}
						value={""}
					/>
				</FormControl>
			)}
			{file && (
				<div className="flex h-[40px] w-full flex-row items-center justify-between space-x-2 rounded-sm border pl-2  focus-visible:ring-0 focus-visible:ring-offset-0  dark:focus-visible:ring-0 dark:focus-visible:ring-offset-0">
					<p>{fileName}</p>
					<Button
						variant="ghost"
						size={"icon"}
						className="h-10"
						onClick={handleRemoveClick}
						aria-label="Remove image"
					>
						<IconTrash size={14} />
					</Button>
				</div>
			)} */}
			<div className="relative">
				<FileUpload file={file} onChange={handleFileChange} />

				<AnimatePresence>
					{file && (
						<motion.div
							initial={{ opacity: 0, scale: 0.5, y: 20, filter: "blur(4px)" }}
							animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
							exit={{ opacity: 0, scale: 0.5, y: 20, filter: "blur(4px)" }}
							transition={{ duration: 0.6, type: "spring", bounce: 0.25 }}
							className="absolute -bottom-2 right-0"
						>
							<Button
								variant="destructive"
								size={"icon"}
								onClick={handleRemoveClick}
							>
								<IconTrash size={16} />
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<AutoFormTooltip fieldConfigItem={fieldConfigItem} />
			<FormMessage />
		</FormItem>
	);
}
