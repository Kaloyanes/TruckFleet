import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "~/tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);
export const colors = fullConfig.theme.colors;
