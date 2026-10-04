import { getCollection } from 'astro:content';

/**
 * 以 `_` 开头的 .md 当作模板，不出现在站点上。
 * glob 的 [^_] 语法在 Astro loader 里不生效，所以过滤放在这里。
 */
const isTemplate = (id: string) => id.startsWith('_');

export async function getPosts() {
  const all = await getCollection('blog');
  return all
    .filter((p) => !isTemplate(p.id) && !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getProjects() {
  const all = await getCollection('projects');
  return all
    .filter((p) => !isTemplate(p.id))
    .sort((a, b) => b.data.weight - a.data.weight);
}

export function fmtDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
