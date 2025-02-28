/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme";

module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./node_modules/@heroui/theme/dist/components/(avatar|checkbox|dropdown|form|menu|divider|popover|button|ripple|spinner).js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(0.375rem)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        "zinc-900": "#09090b",
        "primary-red": "#FB0000",
        "primary-black": "#121212",
        "secondary-red": "#C70000",
        "secondary-white": "#F8F9FA",
        "secondary-black": "#1E1E1E",
        "neutral-dark-grey": "#7E7E7E",
        "neutral-neutral-grey": "#AAAAAA",
        "neutral-bright-grey": "#EBEBEB",
        "accent-white": "#94949440",
        "accent-white-form": "#FFFFFF4D",
        "accent-white-row": "#F4F4F499",
        "accent-black": "#1212121A",
        "accent-black-form": "#1212121A",
        "accent-black-row": "#1E1E1E4D",
        "interactive-dark-red": "#960101",
        "interactive-vivid-red": "#CE0303",
        "warning-color": "#F79009",
        "success-color": "#0FB420",
        "error-color": "#F04438",
        "info-color": "#007BFF",
        "body-background-color": "#09090b",
        red: {
          50: "#FFDCDC",
          100: "#FFC8C8",
          200: "#FF9F9F",
          300: "#FF7676",
          400: "#FF4E4E",
          500: "#FF2525",
          600: "#FB0000",
          700: "#C30000",
          800: "#8B0000",
          900: "#530000",
          950: "#370000",
          DEFAULT: "#FB0000",
        },
        zinc: {
          50: "#BFBFBF",
          100: "#B5B5B5",
          200: "#A1A1A1",
          300: "#8C8C8C",
          400: "#787878",
          500: "#646464",
          600: "#4F4F4F",
          700: "#3B3B3B",
          800: "#1E1E1E",
          900: "#121212",
          950: "#040404",
          DEFAULT: "#121212",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      keyframes: {
        shine: {
          from: {
            backgroundPosition: "200% 0",
          },
          to: {
            backgroundPosition: "-200% 0",
            "background-position": "0% 0%",
          },
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
        },
        rainbow: {
          "0%": {
            "background-position": "0%",
          },
          "100%": {
            "background-position": "200%",
          },
        },
        trail: {
          "0%": {
            "--angle": "0deg",
          },
          "100%": {
            "--angle": "360deg",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        ripple: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) scale(1)",
          },
          "50%": {
            transform: "translate(-50%, -50%) scale(0.9)",
          },
        },
      },
      animation: {
        shine: "shine var(--duration) infinite linear",
        rainbow: "rainbow var(--speed, 2s) infinite linear",
        trail: "trail var(--duration) linear infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        ripple: "ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
