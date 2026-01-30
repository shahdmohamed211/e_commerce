import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: ['selector', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                white: "var(--color-white)",
                alabaster: "var(--color-alabaster)",
                mercury: "var(--color-mercury)",
                "athens-gray": "var(--color-athens-gray)",
                "pale-sky": "var(--color-pale-sky)",
                "river-bed": "var(--color-river-bed)",
                "cod-gray": "var(--color-cod-gray)",
                "cod-gray-2": "var(--color-cod-gray-2)",
                black: "var(--color-black)",
                supernova: "var(--color-supernova)",
            },
            backgroundColor: {
                primary: "var(--bg-primary)",
                secondary: "var(--bg-secondary)",
                nav: "var(--bg-nav)",
            },
            textColor: {
                primary: "var(--text-primary)",
                secondary: "var(--text-secondary)",
                muted: "var(--text-muted)",
                inverse: "var(--text-inverse)",
            },
            borderColor: {
                default: "var(--border-default)",
                subtle: "var(--border-subtle)",
            },
            boxShadow: {
                sm: "var(--shadow-sm)",
                button: "var(--shadow-button)",
            },
            maxWidth: {
                container: "var(--max-width)",
            },
            fontFamily: {
                inter: ["var(--font-inter)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
