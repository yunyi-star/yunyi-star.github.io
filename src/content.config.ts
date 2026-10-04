import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 两类内容：blog（经验贴）+ projects（项目档案）
 *
 * 以 `_` 开头的 .md 文件当作模板存放，不会出现在站点上
 * —— 过滤统一在 src/lib/collections.ts 里做，
 * 因为 glob 的 [^_] 语法在 Astro loader 里不生效。
 */

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    subtitle: z.string().optional(),
    year: z.string(),
    role: z.string(),
    stack: z.array(z.string()).default([]),
    status: z.string().default('进行中'),
    repo: z.string().optional(),
    demo: z.string().optional(),
    weight: z.number().default(0),
  }),
});

export const collections = { blog, projects };
