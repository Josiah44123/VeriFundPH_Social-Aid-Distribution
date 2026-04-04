import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          red: "var(--red)",
          "red-dark": "var(--red-dark)",
          "red-light": "var(--red-light)",
          navy: "var(--navy)",
          "navy-dark": "var(--navy-dark)",
          "navy-light": "var(--navy-light)",
          blue: "var(--blue)",
          "blue-light": "var(--blue-light)",
          gray: "var(--gray)",
          "gray-light": "var(--gray-light)",
          "gray-dark": "var(--gray-dark)",
        },
        semantic: {
          success: "var(--success)",
          "success-light": "var(--success-light)",
          danger: "var(--danger)",
          "danger-light": "var(--danger-light)",
          warning: "var(--warning)",
          "warning-light": "var(--warning-light)",
        },
        surface: {
          DEFAULT: "#f9f9ff",
          page: "var(--surface-page)",
          card: "var(--surface-card)",
          input: "var(--surface-input)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          "on-dark": "var(--text-on-dark)",
        },
        "primary": "#003f89",
        "primary-container": "#1a56ad",
        "primary-fixed": "#d8e2ff",
        "primary-fixed-dim": "#adc6ff",
        "on-primary": "#ffffff",
        "secondary": "#7b5800",
        "secondary-container": "#ffc245",
        "secondary-fixed": "#ffdea6",
        "secondary-fixed-dim": "#f8bd3f",
        "on-secondary-container": "#715000",
        "tertiary": "#88000d",
        "tertiary-container": "#b0151b",
        "on-tertiary": "#ffffff",
        "tertiary-fixed": "#ffdad6",
        "surface-bright": "#f9f9ff",
        "surface-container-low": "#f3f3fb",
        "surface-container": "#ededf5",
        "surface-container-high": "#e7e7f0",
        "surface-container-highest": "#e2e2ea",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#191b21",
        "on-surface-variant": "#424752",
        "outline": "#737783",
        "outline-variant": "#c3c6d4",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        "xl": "1.5rem",
        "2xl": "2rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
