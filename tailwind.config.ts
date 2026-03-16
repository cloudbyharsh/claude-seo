import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          900: "#14532d",
        },
      },
      typography: {
        invert: {
          css: {
            "--tw-prose-body": "#d1d5db",
            "--tw-prose-headings": "#f9fafb",
            "--tw-prose-lead": "#9ca3af",
            "--tw-prose-links": "#34d399",
            "--tw-prose-bold": "#f9fafb",
            "--tw-prose-counters": "#6b7280",
            "--tw-prose-bullets": "#4b5563",
            "--tw-prose-hr": "#374151",
            "--tw-prose-quotes": "#f9fafb",
            "--tw-prose-quote-borders": "#374151",
            "--tw-prose-captions": "#6b7280",
            "--tw-prose-code": "#34d399",
            "--tw-prose-pre-code": "#d1d5db",
            "--tw-prose-pre-bg": "#1f2937",
            "--tw-prose-th-borders": "#4b5563",
            "--tw-prose-td-borders": "#374151",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
