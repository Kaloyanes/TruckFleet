import type { StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import type { StorageValue } from "zustand/middleware";

const storage = new MMKV();

export const mmkvStorage: StateStorage = {
	setItem: (name, value) => {
		return storage.set(name, value);
	},
	getItem: (name) => {
		const value = storage.getString(name);
		return value ?? null;
	},
	removeItem: (name) => {
		return storage.delete(name);
	},
};

export function createJSONStorage<T>() {
	return {
		getItem: (
			name: string,
		): StorageValue<T> | Promise<StorageValue<T> | null> | null => {
			const value = storage.getString(name);
			return value ? (JSON.parse(value) as StorageValue<T>) : null;
		},
		setItem: (name: string, value: StorageValue<T>): void | Promise<void> => {
			storage.set(name, JSON.stringify(value));
		},
		removeItem: (name: string): void | Promise<void> => {
			storage.delete(name);
		},
	};
}
