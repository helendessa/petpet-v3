import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
			"primary": "#4764fd",
			"primary-content": "#d7e2ff",
			"secondary": "#a855f7",
			"secondary-content": "#0a0215",
			"accent": "#fd8547",
			"accent-content": "#1c1917",
			"neutral": "#f3f4f6",
			"neutral-content": "#151e4b",
			"base-100": "#fde047",
			"base-200": "#d3d4d6",
			"base-300": "#f3f4f6",
			"base-content": "#151e4b",
			"info": "#2dd4bf",
			"info-content": "#01100d",
			"success": "#16a34a",
			"success-content": "#000a02",
			"warning": "#f59e0b",
			"warning-content": "#150900",
			"error": "#ff0000",
			"error-content": "#160000",
        },
      },
    ],
  },
};