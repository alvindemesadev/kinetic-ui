import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const external = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "lucide-react",
  "@base-ui/react",
  "class-variance-authority",
  "clsx",
  "cmdk",
  "date-fns",
  "embla-carousel-react",
  "input-otp",
  "react-day-picker",
  "react-resizable-panels",
  "sonner",
  "tailwind-merge",
  "vaul",
];

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    outDir: "dist-library",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(import.meta.dirname, "./src/library.ts"),
      name: "KineticUI",
      formats: ["es"],
      fileName: "kinetic-ui",
    },
    rollupOptions: {
      external,
    },
  },
});
