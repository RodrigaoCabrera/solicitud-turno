import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import db from "@astrojs/db";
import tailwind from "@astrojs/tailwind";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  integrations: [db(), react(), tailwind()],
  adapter: netlify(),
  experimental: {
    serverIslands: true,
  },
  prefetch: true,
});
