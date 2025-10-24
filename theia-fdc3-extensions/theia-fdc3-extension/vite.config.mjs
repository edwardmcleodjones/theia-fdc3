// import react from '@vitejs/plugin-react';
import { resolve, sep } from "path";
import { defineConfig } from "vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";

const entryPoints = [
  resolve(__dirname, "src/browser/theia-fdc3-extension-frontend-module.ts"),
  resolve(__dirname, "src/browser/fdc3-frontend-module.ts"),
  resolve(__dirname, "src/browser/fdc3-frontend-proxy.ts"),
  resolve(__dirname, "src/node/fdc3-backend-module.ts"),
  resolve(__dirname, "src/node/fdc3-backend-service.ts"),
  resolve(__dirname, "src/electron-browser/fdc3-preload.ts"),
];

export default defineConfig({
  clearScreen: false,
  plugins: [
    // react(),
    libInjectCss(),
  ],
  build: {
    lib: {
      entry: entryPoints,
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
        // Never externalize entry modules or internal source files
        const normalisedEntries = new Set(
          entryPoints.flatMap((entry) => {
            const withoutDrive = entry.replace(/^[A-Za-z]:/, "");
            const relativeToRoot = entry.replace(`${__dirname}${sep}`, "");
            return [entry, withoutDrive, relativeToRoot];
          })
        );

        if (id.startsWith("@/")) {
          return false;
        }

        if (id.startsWith("@theia-fdc3/")) {
          return false;
        }

        if (
          normalisedEntries.has(id) ||
          Array.from(normalisedEntries).some((candidate) => id.endsWith(candidate))
        ) {
          return false;
        }

        if (id.startsWith(".")) return false;
        if (id.startsWith("/")) return false;
        if (/^[A-Za-z]:[\\/]/.test(id)) return false;

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
      {
        find: /^@\/(.*)/,
        replacement: `${resolve(__dirname, "src")}/$1`,
      },
      {
        find: /^@theia-fdc3\/(.*)/,
        replacement: `${resolve(__dirname, "src")}/$1`,
      },
    ],
    // preserveSymlinks: true,
  },
});
