/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#5C4033", // Dark Brown
                accent: "#D2B48C", // Light Brown / Beige
                background: "#F5F5F3", // Soft Warm Gray
            },
        },
    },
    plugins: [],
}
