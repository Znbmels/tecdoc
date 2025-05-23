/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          darkBackground: "#1F2937",
          darkCard: "#374151",
          darkText: "#D1D5DB",
          accent: "#10B981",
        },
      },
    },
    plugins: [],
  };
export default function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            "nativewind/babel",
            "expo-router/babel",
            "react-native-reanimated/plugin", // Всегда должен быть последним
        ],
    };
}
;
