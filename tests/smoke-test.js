const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

const docsDir = path.join(root, 'docs');
const docsHtmlPath = path.join(docsDir, 'index.html');
const docsJsPath = path.join(docsDir, 'game.js');
const docsCssPath = path.join(docsDir, 'styles.css');
const noJekyllPath = path.join(docsDir, '.nojekyll');
const docsHtml = fs.existsSync(docsHtmlPath) ? fs.readFileSync(docsHtmlPath, 'utf8') : '';
const docsJs = fs.existsSync(docsJsPath) ? fs.readFileSync(docsJsPath, 'utf8') : '';
const docsCss = fs.existsSync(docsCssPath) ? fs.readFileSync(docsCssPath, 'utf8') : '';

const checks = [
  ['入口檔案存在 Canvas', html.includes('id="game-canvas"')],
  ['入口檔案載入遊戲腳本', html.includes('src="game.js"')],
  ['遊戲腳本使用 requestAnimationFrame', js.includes('requestAnimationFrame')],
  ['遊戲腳本包含電腦 AI', js.includes('predictCpuTarget') && js.includes('moveCpu')],
  ['遊戲腳本包含碰撞與得分', js.includes('scorePoint') && js.includes('bounce')],
  ['遊戲腳本包含三段難度', ['rookie', 'pro', 'elite'].every((level) => js.includes(level))],
  ['遊戲腳本支援穩定鍵盤與指標操作', js.includes('keydown') && js.includes('event.code') && js.includes('KeyW') && js.includes('pointermove')],
  ['遊戲腳本支援畫面上下控制按鈕', html.includes('id="move-up"') && html.includes('id="move-down"') && js.includes('bindPaddleButton')],
  ['樣式包含響應式版面', css.includes('@media')],
  ['沒有外部遊戲套件依賴', !html.includes('three.js') && !html.includes('phaser')],
  ['Pages 發布目錄存在', fs.existsSync(docsDir)],
  ['Pages 發布入口與根目錄同步', docsHtml === html],
  ['Pages 發布腳本與根目錄同步', docsJs === js],
  ['Pages 發布樣式與根目錄同步', docsCss === css],
  ['Pages 使用純靜態發布標記', fs.existsSync(noJekyllPath)],
];

let failed = 0;
for (const [label, passed] of checks) {
  console.log(`${passed ? '✓' : '✗'} ${label}`);
  if (!passed) failed += 1;
}
if (failed) process.exitCode = 1;
