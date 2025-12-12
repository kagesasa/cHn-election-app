/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-orange': '#F49E2F',
                'brand-green': '#3CB371',
                'brand-blue': '#4169E1',
                'brand-bg': '#FAF9F6',
            },
            fontFamily: {
                sans: ['"Noto Sans JP"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
