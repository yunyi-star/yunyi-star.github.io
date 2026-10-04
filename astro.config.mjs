import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://yunyi-star.github.io',
  // 仓库名即 yunyi-star.github.io（GitHub 用户页），因此无需配置 base
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
