import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import icon from 'astro-icon';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [icon(), react()],
  output: "server",
  adapter: vercel(),
});