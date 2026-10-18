import { createMission, transition, allowedEvents } from './mission-machine.mjs';

const labels = {
  idle: '等待开始', navigating: '前往目标', observing: '等待观察完成',
  waiting_signal: '等待绿灯', recovering: '等待恢复', complete: '任务完成', stopped: '已停止',
};
const buttons = [...document.querySelectorAll('[data-event]')];
const state = document.querySelector('#mission-state');
const detail = document.querySelector('#mission-detail');
const log = document.querySelector('#mission-log');
const reset = document.querySelector('#mission-reset');
const steps = [...document.querySelectorAll('.task-track li')];
let mission = createMission();

function render() {
  state.textContent = labels[mission.state];
  const task = mission.tasks[mission.index];
  let text = task ? `当前目标：${task.label}。` : '全部示例任务已完成。';
  if (mission.reason) text += ` ${mission.reason}。`;
  detail.textContent = text;
  for (const button of buttons) button.disabled = !allowedEvents(mission).includes(button.dataset.event);
  for (const [index, step] of steps.entries()) {
    step.dataset.progress = index < mission.index ? 'done' : 'pending';
    step.removeAttribute('aria-current');
    if (index === mission.index) {
      step.dataset.progress = 'current';
      step.setAttribute('aria-current', 'step');
    }
  }
}

for (const button of buttons) {
  button.addEventListener('click', () => {
    const next = transition(mission, button.dataset.event);
    if (next === mission) return;
    const entry = document.createElement('li');
    entry.textContent = `${button.textContent}：${labels[mission.state]} → ${labels[next.state]}`;
    log.append(entry);
    mission = next;
    render();
    const nextButton = buttons.find(b => !b.disabled && b.dataset.event !== 'emergency');
    (nextButton ?? reset).focus();
  });
}
reset.disabled = false;
reset.addEventListener('click', () => {
  mission = createMission();
  log.replaceChildren();
  const entry = document.createElement('li');
  entry.textContent = '演示已重置，等待开始';
  log.append(entry);
  render();
  buttons[0].focus();
});
render();
