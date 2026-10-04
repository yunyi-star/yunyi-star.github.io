# yunyi-star.github.io

个人作品集 + 技术博客。Astro 7 + Content Collections。

## 本地运行

依赖已装好，直接起：

```bash
npm run dev      # http://localhost:4321
```

换机器或重新装依赖：

```bash
npm install
```

> 若 `npm install` 报 `esbuild ... EBUSY`（Windows 上偶发，postinstall 校验阶段），
> 用 `npm install --ignore-scripts` 即可 —— esbuild 二进制本来就在平台包里，跳过校验不影响构建。

## 构建

```bash
npm run build    # 产物在 dist/
npm run preview  # 本地预览构建产物
```

## 写内容

不用碰任何配置，只往这两个目录丢 Markdown：

| 目录 | 内容 | 模板 |
|---|---|---|
| `src/content/blog/` | 经验贴 | `_模板.md` |
| `src/content/projects/` | 项目档案 | `_模板.md` |

以 `_` 开头的文件会被忽略，当作模板存放。新文件复制模板、去掉下划线命名即可。

文章 frontmatter：`title` / `date` / `summary` / `tags` / `draft`
项目 frontmatter：`name` / `subtitle` / `year` / `role` / `stack` / `status` / `repo` / `demo` / `weight`

`weight` 越大越靠前（首页只显示前 4 个）。

## 部署

仓库名为 `yunyi-star.github.io`（GitHub 用户页），推送到 main 后 GitHub Actions 自动构建部署。

首次需要：仓库 Settings → Pages → Source 选 **GitHub Actions**。

## 结构

```
src/
├── content.config.ts    两类内容的定义（blog / projects）
├── content/             内容全在这里
├── layouts/             页面框架
├── pages/               首页 / 项目 / 文章 / 关于
└── styles/              全局样式
```
