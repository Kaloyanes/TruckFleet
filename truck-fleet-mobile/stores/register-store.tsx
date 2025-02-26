import {
	Easing,
	type SharedValue,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { create } from "zustand";

interface RegisterStore {
	currentIndex: number;
	data: string[];
	progress: number;
	setProgress: (progress: number) => void;
	setCurrentIndex: (index: number) => void;
	reset: () => void;
}

export const useRegisterStore = create<RegisterStore>((set) => ({
	currentIndex: 0,
	data: ["a", "b", "c", "d"],
	progress: 0,
	setProgress: (progress: number) => set({ progress }),
	setCurrentIndex: (index: number) => set({ currentIndex: index }),
	reset: () => set({ currentIndex: 0, progress: 0 }),
}));
