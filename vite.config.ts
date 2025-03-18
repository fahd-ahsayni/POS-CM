import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";
import svgr from "vite-plugin-svgr";
import dynamicImport from 'vite-plugin-dynamic-import'
// import MillionLint from "@million/lint";



export default defineConfig({
  plugins: [react(), svgr(), compression(), dynamicImport()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
