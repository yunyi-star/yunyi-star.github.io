# 可运行的通用示例

这些示例于 2026-10-19 为作品集独立编写，用来解释项目中的工程思路。它们不是私有项目源码的拷贝，也不包含实机接口、现场参数、模型、个人数据或服务凭据。

| 示例 | 模块 | 在线体验 |
| --- | --- | --- |
| 任务状态机 | `public/examples/mission-machine.mjs` | [任务状态机](https://yunyi-star.github.io/lab/mission/) |
| 消息归一化 | `public/examples/message-normalizer.mjs` | [消息归一化](https://yunyi-star.github.io/lab/messages/) |

Node.js 22 下，无需安装依赖即可运行测试：

```sh
node --test tests/examples.test.mjs
```

任务示例支持信号灯等待、一次显式重试与急停；消息示例支持嵌套工具结果、提取失败标记与深度限制。消息提取器由调用方注入，在线演示只使用写在代码里的虚构文字，不读取本地文件、不下载链接、不调用模型。

这些是教学模型，不能直接用作机器人控制或生产服务。各原项目的实际性能、部署状态和测试覆盖不能从这些示例的测试结果推出。
