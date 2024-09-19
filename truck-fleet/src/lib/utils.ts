import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCssVariableValue(variableName: string): string {
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();

    if (!value) {
      console.warn(`CSS variable ${variableName} is empty or not found`);
    }

    return value;
  } catch (error) {
    console.error(`Error getting CSS variable ${variableName}:`, error);
    return "";
  }
}
