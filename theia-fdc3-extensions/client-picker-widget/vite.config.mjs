import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";

export default defineConfig({
  clearScreen: false,
  plugins: [react(), tailwindcss(), libInjectCss()],
  build: {
    lib: {
      entry: [
        resolve(
          __dirname,
          "src/browser/client-picker-widget-frontend-module.ts"
        ),
      ],
      formats: ["cjs"],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    outDir: "lib",
    emptyOutDir: true,
    cssCodeSplit: true,
    sourcemap: true,
    target: "ES2022",
    rollupOptions: {
      external: (id) => {
        // Never externalize our entry or any source files
        const entryPath = resolve(
          __dirname,
          "src/browser/client-picker-widget-frontend-module.ts"
        );

        // Handle Windows absolute paths (e.g., D:\...)
        const isWinAbs = /^[A-Za-z]:[\\/]/.test(id);

        // Treat alias paths as internal
        if (id.startsWith("@/")) return false;

        // Entry by absolute path
        if (id === entryPath) return false;
        // Entry by relative path (as seen in the error)
        if (
          id === "src/browser/client-picker-widget-frontend-module.ts" ||
          id.endsWith("src/browser/client-picker-widget-frontend-module.ts")
        )
          return false;

        // Local/relative or absolute filesystem paths should be bundled
        if (id.startsWith(".")) return false;
        if (id.startsWith("/")) return false;
        if (isWinAbs) return false;

        // For bare imports, mark as external so consumers resolve them
        return true;
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        format: "cjs",
        exports: "named",
      },
    },
  },
  resolve: {
    alias: [
      //// This seems to break things. The below option works better.
      // {
      //   "@": path.resolve(__dirname, "./src"),
      // },
      {
        find: /^@\/(.*)/,
        replacement: `${resolve(__dirname, "src")}/$1`,
      },
    ],
    // preserveSymlinks: true,
  },
  // Add these options for better Windows compatibility
  server: {
    watch: {
      usePolling: true,
    },
  },
  optimizeDeps: {
    force: true,
  },
});
