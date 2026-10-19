# yunyi-star · 工程项目作品集

[访问作品集](https://yunyi-star.github.io/) · [项目档案](https://yunyi-star.github.io/projects/) · [交互演示](https://yunyi-star.github.io/lab/)

这里展示机器人与软件系统实践。每份档案区分已有实现、关键取舍与公开范围；公开说明不代表原项目的全部材料可以再分发。

| 项目 | 可查看的成果 |
| --- | --- |
| [移动机器人侦察与抓取](src/content/projects/robot-mission.md) | 导航、视觉与机械臂的任务编排；独立状态机示例 |
| [社区巡检机器人仿真](src/content/projects/community-navigation.md) | 路线配置、导航与感知接口、边界检查方法 |
| [工控通信与防护原型](src/content/projects/industrial-guard.md) | 两端实现对齐、分层排障与安全认识复盘 |
| [视觉与文档消息路由](src/content/projects/vision-router.md) | 递归消息处理、本地提取与降级；独立归一化示例 |
| [英语词汇学习应用](src/content/projects/vocabulary-trainer.md) | 学习队列、间隔复习、本地进度；已有公开代码链接 |

可运行示例说明见 [examples/README.md](examples/README.md)。示例为本站独立编写，使用虚构数据，不连接真实设备、读取个人文件或调用外部模型。

## 我面对问题时，具体怎样解决

| 复盘 | 问题与排查主线 |
| --- | --- |
| [机械臂投放后扫飞物块](src/content/blog/arm-release-ik.md) | 从落点误差追到 IK 分支跳变，再检查驱动返回与实际停稳的时序 |
| [地图假墙与雷达自打](src/content/blog/simulation-phantom-obstacles.md) | 位姿、材质、地图生成与雷达观测分开做对照，避免只调规划器 |
| [路线漂移的多轮迭代](src/content/blog/navigation-drift-iterations.md) | 门架误判、控制死锁、定位与视觉互相带偏，以及失败试验的回退 |
| [检测框存在但计数为零](src/content/blog/recognition-counting-debug.md) | 检测、后处理、时间窗口、数据标注分别取证，保留实际边界错误 |
| [PLC 通信与提交写尾延迟](src/content/blog/plc-link-and-tail-latency.md) | 从物理链路查到写后回读、状态窗口和延迟尖峰 |
| [视觉路由输入兼容](src/content/blog/vision-router-normalization.md) | 嵌套内容、文档本地提取、透明转发、SSE 与缓存语义的取舍 |

以上依据当时的工作记录、补丁与实现整理。历史实验数字注明环境和版本，不冒充本次重测；失败尝试与未完成的改进也保留下来。

## 开发与检查

使用 Node.js 22.12+ 和 npm 9.6.5+。站点保留 Astro 与 Markdown 内容集合，无额外运行时服务或分析追踪。

```sh
npm ci
npm run dev
npm run check:public
npm test
npm run build
npm run preview
```

不安装依赖也可以运行通用示例测试：

```sh
node --test tests/examples.test.mjs
```

## 维护内容

项目放在 `src/content/projects/`，文章放在 `src/content/blog/`。以 `_` 开头的文件为模板，站点会忽略。新增公开文件后，审查其内容并更新 `publication-manifest.json`。

公开边界与发布流程见 [docs/publishing-policy.md](docs/publishing-policy.md)。私有评估记录不进入此仓库。更改当前页面不会清除既有 Git 历史或外部副本。

## 部署

保留现有 GitHub Pages 工作流。推送到 `main` 后，GitHub Actions 安装依赖、检查公开文件清单、执行示例测试，再构建和部署 `dist/`。仓库 Pages 来源应为 GitHub Actions。

第三方框架和词汇数据的许可由其原始项目决定，本仓库不重新授权第三方材料。
