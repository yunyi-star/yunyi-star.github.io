import test from 'node:test';
import assert from 'node:assert/strict';
import { createMission, transition, demoTasks, allowedEvents } from '../public/examples/mission-machine.mjs';
import { normalizeBlocks, demoMessages, demoExtract } from '../public/examples/message-normalizer.mjs';

test('mission completes only after navigation, observations and signal release', () => {
  let m = createMission();
  for (const event of ['start', 'arrived', 'observed', 'arrived']) m = transition(m, event);
  assert.equal(m.state, 'waiting_signal');
  assert.equal(m.index, 1);
  assert.equal(transition(m, 'observed'), m);
  for (const event of ['green', 'arrived', 'observed']) m = transition(m, event);
  assert.equal(m.state, 'complete');
  assert.equal(m.index, demoTasks.length);
  assert.deepEqual(allowedEvents(m), []);
});

test('timeout allows one explicit recovery, then stops without skipping a task', () => {
  let m = transition(createMission(), 'start');
  m = transition(m, 'timeout');
  assert.equal(m.state, 'recovering');
  assert.equal(transition(m, 'arrived'), m);
  m = transition(transition(m, 'retry'), 'timeout');
  assert.equal(m.state, 'stopped');
  assert.equal(m.index, 0);
  assert.equal(m.retries, 1);
});

test('emergency stops every active state; stopped state cannot restart by event', () => {
  for (const state of ['idle', 'navigating', 'observing', 'waiting_signal', 'recovering']) {
    const m = transition({ ...createMission(), state }, 'emergency');
    assert.equal(m.state, 'stopped');
    assert.equal(transition(m, 'start'), m);
  }
});

test('mission validation rejects malformed or duplicate tasks and owns its copy', () => {
  assert.throws(() => createMission([]), TypeError);
  assert.throws(() => createMission([demoTasks[0], demoTasks[0]]), TypeError);
  const tasks = [{ id: 'demo', label: '示例', kind: 'observation' }];
  const m = createMission(tasks);
  tasks[0].label = 'Changed';
  assert.equal(m.tasks[0].label, '示例');
  assert.equal(m.state, 'idle');
  assert.equal(transition(m, 'start').state, 'navigating');
});

test('normalizer handles nested blocks and emits only text without mutating inputs', async () => {
  const original = structuredClone(demoMessages.nested);
  const result = await normalizeBlocks(original, demoExtract);
  assert.ok(result.every(b => b.type === 'text' && typeof b.text === 'string'));
  assert.match(result.map(b => b.text).join('\n'), /蓝色方块/);
  assert.match(result.map(b => b.text).join('\n'), /观察点 A/);
  assert.deepEqual(original, demoMessages.nested);
  assert.equal(JSON.stringify(result).includes('demoText'), false);
});

test('extraction failures are explicit and do not reveal callback error contents', async () => {
  const result = await normalizeBlocks(demoMessages.failure, async () => { throw new Error('private-error-detail'); });
  assert.match(result[0].text, /内容未获取/);
  assert.equal(JSON.stringify(result).includes('private-error-detail'), false);
  const empty = await normalizeBlocks([{ type: 'image' }], async () => ' ');
  assert.match(empty[0].text, /提取失败/);
});

test('text passes through and unsupported blocks, malformed content and deep nesting reject', async () => {
  assert.deepEqual(await normalizeBlocks(demoMessages.text, demoExtract), demoMessages.text);
  await assert.rejects(normalizeBlocks([{ type: 'unknown' }], demoExtract), TypeError);
  await assert.rejects(normalizeBlocks([{ type: 'text', text: 1 }], demoExtract), TypeError);
  await assert.rejects(normalizeBlocks(null, demoExtract), TypeError);
  let nested = demoMessages.text;
  for (let i = 0; i < 14; i++) nested = [{ type: 'tool_result', content: nested }];
  await assert.rejects(normalizeBlocks(nested, demoExtract), RangeError);
});
