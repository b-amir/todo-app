/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        handwritten: ["var(--font-handwritten)", "cursive"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        ink: "var(--ink)",
        "ink-light": "var(--ink-light)",
        "ink-pale": "var(--ink-pale)",
        "item-unselected": "var(--item-unselected)",
        "item-selected": "var(--item-selected)",
        "item-focus": "var(--item-focus)",
        "item-hover": "var(--item-hover)",
        darker: "var(--darker)",
      },
      borderRadius: {
        radius: "var(--radius)",
      },
    },
  },
  plugins: [],
};
