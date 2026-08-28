# 技術計畫：畫面球拍控制按鈕

- 在 `index.html` 的球桌說明區加入具備 aria-label 的上下按鈕。
- 在 `game.js` 以 `virtualKeys` 表示按鈕按住狀態，與鍵盤輸入合併到同一個 `movePlayer` 更新路徑。
- 使用 Pointer Events 統一滑鼠與觸控，於 pointerup、pointercancel、pointerleave 清除狀態。
- 以 `touch-action: none` 阻止觸控按鈕引起頁面捲動，並以 `.is-pressed` 提供按壓回饋。
- 以靜態 smoke test 驗證兩個按鈕與綁定函式存在。
- 鍵盤事件使用 `event.code`，並在鍵盤輸入時暫停指標位置覆蓋；視窗失焦時清除殘留按鍵狀態。
