# 研究紀錄：NEON ARENA｜Cyber Pong

查證日期：2026-08-28

## 決策一：使用 Canvas 與 requestAnimationFrame

- 決策：以原生 Canvas 2D 繪製球桌與遊戲物件，使用 `window.requestAnimationFrame` 驅動動畫。
- 影響：不需遊戲引擎與建置工具，單一靜態網站即可執行；遊戲迴圈必須使用回呼提供的時間戳計算進度。
- 採用理由：MDN 說明 `requestAnimationFrame` 會在下一次重繪前呼叫回呼，通常跟隨顯示器刷新率；同時提醒動畫應使用時間參數，避免高刷新率裝置跑得更快。
- 來源：MDN，〈Window: requestAnimationFrame() method〉，<https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame>，查證日期 2026-08-28。
- 補充來源：MDN，〈Basic animations - Canvas API〉，<https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations>，查證日期 2026-08-28。
- 限制：分頁隱藏時瀏覽器可能暫停回呼，因此程式使用 `dt` 上限避免恢復時物件瞬移。

## 決策二：以靜態檔案部署至 GitHub Pages

- 決策：保留 `index.html` 在專案根目錄，附上 GitHub Actions 驗證 workflow；完成 repository 綁定後可選擇根目錄分支或 Actions 發布。
- 影響：不使用 PHP、Python 後端或需要常駐伺服器的架構；遊戲狀態限定在瀏覽器本地。
- 採用理由：GitHub 文件指出 Pages 可發布 repository 中的靜態檔案，且入口可使用 `index.html`；也支援以 Actions workflow 上傳與部署靜態 artifact。
- 來源：GitHub Docs，〈Creating a GitHub Pages site〉，<https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site>，查證日期 2026-08-28。
- 補充來源：GitHub Docs，〈Configuring a publishing source for your GitHub Pages site〉，<https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>，查證日期 2026-08-28。
- 限制：Pages 發布前仍需要一個已存在的 GitHub repository；本次工作區沒有對應遠端 repository。

## 資產與授權

- 未重用第三方程式碼、圖片或音訊資產。
- 介面字型以 Google Fonts CSS 參考載入；若離線，會回退至系統字型。遊戲核心不依賴該字型服務。
