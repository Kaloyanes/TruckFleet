import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config";
const fullConfig = resolveConfig(tailwindConfig);
// Function to extract CSS variable value using computed styles
export const getCssVariableValue = (variableName: string) => {
  if (typeof document !== "undefined") {
    const rootStyles = getComputedStyle(document.documentElement);
    return rootStyles.getPropertyValue(variableName);
  }
  return null;
};
