// vite.config.ts
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [
      vue(),
      vueDevTools(),
      Components({
        resolvers: [
          IconsResolver({
            prefix: "icon",
            enabledCollections: ["lucide", "mdi", "heroicons"],
          }),
        ],
      }),
      Icons({
        autoInstall: true,
      }),
    ],

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:9000",
          changeOrigin: true,
        },
      },
    },

    // ⭐ 关键改动在这里
    base: isProd ? "/yalhardware-frontend/" : "/",
  };
});
