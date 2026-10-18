// Structure-only example. The extractor is injected; this module does no I/O.
export async function normalizeBlocks(blocks, extract, depth = 0) {
  if (depth > 12) throw new RangeError('消息嵌套过深');
  if (!Array.isArray(blocks)) throw new TypeError('内容必须是数组');
  if (typeof extract !== 'function') throw new TypeError('需要内容提取函数');
  const output = [];
  for (const block of blocks) {
    if (!block || typeof block !== 'object') throw new TypeError('内容块格式错误');
    switch (block.type) {
      case 'text':
        if (typeof block.text !== 'string') throw new TypeError('文本内容必须是字符串');
        output.push({ type: 'text', text: block.text });
        break;
      case 'tool_result': {
        const content = typeof block.content === 'string'
          ? [{ type: 'text', text: block.content }] : block.content;
        const nested = await normalizeBlocks(content, extract, depth + 1);
        output.push({ type: 'text', text: '[工具结果]' }, ...nested);
        break;
      }
      case 'image':
      case 'document': {
        const label = block.type === 'image' ? '图片' : '文档';
        try {
          const text = await extract(block);
          if (typeof text !== 'string' || !text.trim()) throw new Error('No content');
          output.push({ type: 'text', text: `[${label}内容] ${text}` });
        } catch {
          // Do not include callback errors: they may contain paths or credentials.
          output.push({ type: 'text', text: `[${label}提取失败：内容未获取，请勿猜测]` });
        }
        break;
      }
      default: throw new TypeError('不支持的内容块类型');
    }
  }
  return output;
}

export const demoMessages = {
  nested: [
    { type: 'text', text: '请整理这次虚构巡检的观察结果。' },
    { type: 'tool_result', content: [
      { type: 'image', demoText: '示例画面中有一个蓝色方块。' },
      { type: 'document', demoText: '示例记录：观察点 A 已检查。' },
    ] },
  ],
  failure: [{ type: 'document', unavailable: true }],
  text: [{ type: 'text', text: '这是一条纯文本示例。' }],
};

export async function demoExtract(block) {
  if (block.unavailable) throw new Error('Synthetic failure');
  return block.demoText;
}
