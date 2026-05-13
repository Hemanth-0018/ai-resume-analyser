import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx,css}", "./public/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
