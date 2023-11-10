import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // gridTemplateColumns: {
            //     "10": "repeat(10, minmax(0, 1fr))",
            //     "15": "repeat(15, minmax(0, 1fr))",
            //     "20": "repeat(20, minmax(0, 1fr))",
            // },
        },
    },
    darkMode: "class",
    plugins: [],
};
export default config;
