import { normalizeBlocks, demoMessages, demoExtract } from './message-normalizer.mjs';

const buttons = [...document.querySelectorAll('[data-scenario]')];
const input = document.querySelector('#message-input');
const output = document.querySelector('#message-output');
const status = document.querySelector('#message-status');
const run = document.querySelector('#normalize');
let scenario = 'nested';

function renderInput() {
  input.textContent = JSON.stringify(demoMessages[scenario], null, 2);
  output.textContent = '点击转换，查看结果。';
  status.textContent = '';
  for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.scenario === scenario));
}
for (const button of buttons) {
  button.disabled = false;
  button.addEventListener('click', () => {
    scenario = button.dataset.scenario;
    renderInput();
  });
}
run.disabled = false;
run.addEventListener('click', async () => {
  const result = await normalizeBlocks(demoMessages[scenario], demoExtract);
  output.textContent = JSON.stringify(result, null, 2);
  status.textContent = '转换完成：所有输出均为文本块。';
});
renderInput();
