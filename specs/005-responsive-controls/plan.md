# 實作計畫

## 版面

- 新增 `responsive-fix.css` 作為現有視覺設計之上的覆寫層，不破壞原本主題。
- 將桌面最大寬度由 1400px 收斂，並依 900px、800px 以下視窗高度逐級壓縮。
- 720px 以下沿用手機版，再進一步縮短間距。
- 600px 以下橫向畫面使用極簡競技版面，保留遊戲場與操作按鈕。

## 控制

- 新增 `controls-fix.js`，在 capture phase 攔截 Canvas pointermove。
- 僅在 pointerdown 後的拖曳期間允許既有 pointermove 控制邏輯執行。
- pointerup、pointercancel、blur 與鍵盤移動輸入時清除舊 pointer target，避免球拍跳回舊位置。
- 不修改既有 `game.js` 的 AI、物理、音效和計分核心。

## 發布與測試

- 根目錄及 `docs/` 同步新增兩個修正檔案。
- `index.html` 同時載入新 CSS 與 JS。
- 擴充 smoke test 驗證載入、控制策略、響應式 breakpoint 以及 Pages 同步。
