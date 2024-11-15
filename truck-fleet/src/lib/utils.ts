import { type ClassValue, clsx } from "clsx";
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

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function focusNextElement(e: React.KeyboardEvent, tabIndex: number) {
  if (e.key !== "Tab") return;
  e.preventDefault();

  let i = 1;
  let nextTabIndex = tabIndex + i;
  let nextElement = document.querySelector(
    `[tabindex="${nextTabIndex}"]`,
  ) as HTMLElement;

  while (nextElement === null || nextElement === undefined) {
    i++;
    nextTabIndex = tabIndex + i;
    nextElement = document.querySelector(
      `[tabindex="${nextTabIndex}"]`,
    ) as HTMLElement;
  }

  if (nextElement) {
    nextElement.focus();
  }
}
