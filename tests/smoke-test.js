const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

const checks = [
  ['入口檔案存在 Canvas', html.includes('id="game-canvas"')],
  ['入口檔案載入遊戲腳本', html.includes('src="game.js"')],
  ['遊戲腳本使用 requestAnimationFrame', js.includes('requestAnimationFrame')],
  ['遊戲腳本包含電腦 AI', js.includes('predictCpuTarget') && js.includes('moveCpu')],
  ['遊戲腳本包含碰撞與得分', js.includes('scorePoint') && js.includes('bounce')],
  ['遊戲腳本包含三段難度', ['rookie', 'pro', 'elite'].every((level) => js.includes(level))],
  ['遊戲腳本支援鍵盤與指標操作', js.includes('keydown') && js.includes('pointermove')],
  ['樣式包含響應式版面', css.includes('@media')],
  ['沒有外部遊戲套件依賴', !html.includes('three.js') && !html.includes('phaser')],
];

let failed = 0;
for (const [label, passed] of checks) {
  console.log(`${passed ? '✓' : '✗'} ${label}`);
  if (!passed) failed += 1;
}
if (failed) process.exitCode = 1;
