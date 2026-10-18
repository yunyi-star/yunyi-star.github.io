// Independent teaching example. No robot connection or real route data.
export const demoTasks = Object.freeze([
  Object.freeze({ id: 'sample-observation-a', label: '观察点 A', kind: 'observation' }),
  Object.freeze({ id: 'sample-signal', label: '信号灯', kind: 'signal' }),
  Object.freeze({ id: 'sample-observation-b', label: '观察点 B', kind: 'observation' }),
]);

export function createMission(tasks = demoTasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) throw new TypeError('任务不能为空');
  const ids = new Set();
  for (const task of tasks) {
    if (!task || typeof task.id !== 'string' || !task.id || ids.has(task.id)
      || typeof task.label !== 'string' || !task.label
      || !['observation', 'signal'].includes(task.kind)) {
      throw new TypeError('任务需要唯一标识、名称和有效类型');
    }
    ids.add(task.id);
  }
  return { state: 'idle', index: 0, retries: 0, reason: '', tasks: tasks.map(t => ({ ...t })) };
}

export function allowedEvents(mission) {
  const events = {
    idle: ['start'], navigating: ['arrived', 'timeout'],
    observing: ['observed'], waiting_signal: ['green'], recovering: ['retry'],
    complete: [], stopped: [],
  }[mission.state] ?? [];
  if (mission.state !== 'complete' && mission.state !== 'stopped') return [...events, 'emergency'];
  return events;
}

function advance(mission) {
  const index = mission.index + 1;
  return { ...mission, index, retries: 0, state: index === mission.tasks.length ? 'complete' : 'navigating' };
}

export function transition(mission, event) {
  if (!allowedEvents(mission).includes(event)) return mission;
  switch (event) {
    case 'start': return { ...mission, state: 'navigating' };
    case 'arrived': return {
      ...mission,
      state: mission.tasks[mission.index].kind === 'signal' ? 'waiting_signal' : 'observing',
    };
    case 'observed':
    case 'green': return advance(mission);
    case 'timeout':
      if (mission.retries >= 1) return { ...mission, state: 'stopped', reason: '重试后仍超时' };
      return { ...mission, state: 'recovering', reason: '导航超时，等待恢复' };
    case 'retry': return { ...mission, state: 'navigating', retries: mission.retries + 1, reason: '' };
    case 'emergency': return { ...mission, state: 'stopped', reason: '收到急停事件' };
    default: return mission;
  }
}
