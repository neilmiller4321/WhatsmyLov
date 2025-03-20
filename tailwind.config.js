/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
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
      colors: {
        sunset: {
          start: '#FF8C42',
          middle: '#FF5F6D',
          end: '#FF4B6A',
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        destructive: "hsl(var(--destructive))",
      },
      backgroundImage: {
        'sunset-gradient': 'linear-gradient(45deg, #FF8C42, #FF5F6D, #FF4B6A)',
      },
      textColor: {
        'sunset-text': '#FF8C42',
        'sunset-text-hover': '#FF5F6D',
      },
      borderColor: {
        'sunset-border': '#FF8C42',
      },
    },
  },
  safelist: [
    'bg-sunset-gradient',
    'text-sunset-text',
    'text-sunset-text-hover',
    'border-sunset-border',
    'from-sunset-start',
    'via-sunset-middle',
    'to-sunset-end',
  ],
  plugins: [],
};