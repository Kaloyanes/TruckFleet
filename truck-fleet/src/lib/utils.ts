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

export function convertMillions(
  num: number,
  t: (key: string) => string,
): string {
  if (num >= 1000000) {
    return `${convertMillions(Math.floor(num / 1000000), t)} ${t(
      "Numbers.million",
    )} ${convertThousands(num % 1000000, t)}`;
  }
  return convertThousands(num, t);
}

export function convertThousands(
  num: number,
  t: (key: string) => string,
): string {
  if (num >= 1000) {
    return `${convertHundreds(Math.floor(num / 1000), t)} ${t(
      "Numbers.thousand",
    )} ${convertHundreds(num % 1000, t)}`;
  }
  return convertHundreds(num, t);
}

export function convertHundreds(
  num: number,
  t: (key: string) => string,
): string {
  if (num > 99) {
    return `${t(`Numbers.${getNumberWord(Math.floor(num / 100))}`)} ${t(
      "Numbers.hundred",
    )} ${convertTens(num % 100, t)}`;
  }
  return convertTens(num, t);
}

export function convertTens(num: number, t: (key: string) => string): string {
  if (num < 10) return t(`Numbers.${getNumberWord(num)}`);
  if (num >= 10 && num < 20) return t(`Numbers.${getNumberWord(num)}`);

  const tensWord = Math.floor(num / 10) * 10;
  const onesWord = num % 10;

  return `${t(`Numbers.${getNumberWord(tensWord)}`)}${
    onesWord > 0 ? " " + t(`Numbers.${getNumberWord(onesWord)}`) : ""
  }`;
}

function getNumberWord(num: number): string {
  const numbers = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen",
    20: "twenty",
    30: "thirty",
    40: "forty",
    50: "fifty",
    60: "sixty",
    70: "seventy",
    80: "eighty",
    90: "ninety",
  };
  return numbers[num as keyof typeof numbers] || "";
}

export function convert(num: number, t: (key: string) => string): string {
  if (num === 0) return t("Numbers.zero");
  return convertMillions(num, t);
}
