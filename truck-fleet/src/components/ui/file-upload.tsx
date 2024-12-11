import { cn } from "@/lib/Utils";
import { IconUpload } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
	initial: {
		x: 0,
		y: 0,
	},
	animate: {
		x: 20,
		y: -20,
		opacity: 0.9,
	},
};

const secondaryVariant = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
	},
};

export const FileUpload = ({
	onChange,
	file,
}: {
	onChange?: (file: File | null) => void;
	file: File | null;
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (newFiles: File[]) => {
		const selectedFile = newFiles[0] || null;
		// setFile(selectedFile);
		onChange?.(selectedFile);
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const { getRootProps, isDragActive } = useDropzone({
		multiple: false,
		accept: { "application/pdf": [] }, // Only accept PDF files
		noClick: true,
		onDrop: handleFileChange,
		onDropRejected: (error) => {
			console.log(error);
		},
	});

	const t = useTranslations("FileUpload");

	return (
		<div className="w-full" {...getRootProps()}>
			<motion.div
				onClick={handleClick}
				whileHover="animate"
				className="py-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
			>
				<input
					ref={fileInputRef}
					id="file-upload-handle"
					type="file"
					accept="application/pdf" // Restrict to PDF files
					onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
					className="hidden"
				/>
				<div className="flex flex-col items-start justify-center">
					<p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
						{t("uploadFile")}
					</p>
					<p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
						{t("uploadFileDescription")}
					</p>
					<div className="relative w-full mt-10 max-w-xl mx-auto">
						{file ? (
							<motion.div
								layoutId="file-upload"
								className={cn(
									"relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
									"shadow-sm",
								)}
							>
								<div className="flex justify-between w-full items-center gap-4">
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										layout
										className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
									>
										{file.name}
									</motion.p>
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										layout
										className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
									>
										{(file.size / (1024 * 1024)).toFixed(2)} MB
									</motion.p>
								</div>

								<div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										layout
										className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
									>
										{file.type}
									</motion.p>

									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										layout
									>
										modified {new Date(file.lastModified).toLocaleDateString()}
									</motion.p>
								</div>
							</motion.div>
						) : (
							<motion.div
								layoutId="file-upload"
								variants={mainVariant}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 20,
								}}
								className={cn(
									"relative group-hover/file:shadow-2xl z-40 bg-primary text-primary-foreground dark:bg-accent  flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
									"shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
								)}
							>
								{isDragActive ? (
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className=" flex flex-col items-center"
									>
										Drop it
										<IconUpload className="h-4 w-4  dark:text-neutral-400" />
									</motion.p>
								) : (
									<IconUpload className="h-4 w-4  dark:text-neutral-300" />
								)}
							</motion.div>
						)}

						{!file && (
							<motion.div
								variants={secondaryVariant}
								className="absolute opacity-0 border border-dashed border-primary inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
							/>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export function GridPattern() {
	const columns = 41;
	const rows = 11;
	return (
		<div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
			{Array.from({ length: rows }).map((_, row) =>
				Array.from({ length: columns }).map((_, col) => {
					const index = row * columns + col;
					return (
						<div
							key={`${col}-${row}`}
							className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
								index % 2 === 0
									? "bg-gray-50 dark:bg-neutral-950"
									: "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
							}`}
						/>
					);
				}),
			)}
		</div>
	);
}
