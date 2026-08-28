# 任務清單：NEON ARENA｜Cyber Pong

## Phase 1：規格與基礎

- [X] T001 建立功能規格與四個使用者故事：`specs/001-neon-arena/spec.md`
- [X] T002 建立技術計畫、驗證策略與 GitHub Pages 部署方向：`specs/001-neon-arena/plan.md`
- [X] T003 建立研究、資料模型與快速驗收文件：`specs/001-neon-arena/research.md`、`data-model.md`、`quickstart.md`

## Phase 2：遊戲介面

- [X] T004 建立 NEON ARENA 語意化頁面、比分板、控制面板與遊戲入口：`index.html`
- [X] T005 建立霓虹電競舞台、響應式版面、按鈕與狀態動畫：`styles.css`

## Phase 3：核心遊戲

- [X] T006 實作 Canvas 遊戲迴圈、時間差更新、球桌背景、球拍、球與粒子：`game.js`
- [X] T007 實作玩家鍵盤／指標輸入、邊界反彈、球拍碰撞與角度反射：`game.js`
- [X] T008 實作 CPU 預測追蹤、三段難度、得分、發球與 7 分勝負：`game.js`
- [X] T009 實作暫停、音效切換、本地紀錄與重新開局：`game.js`

## Phase 4：品質閘門與交付

- [X] T010 建立不依賴瀏覽器的 Node.js 煙霧測試：`tests/smoke-test.js`
- [X] T011 建立 GitHub Actions 靜態檢查 workflow：`.github/workflows/validate.yml`
- [X] T012 完成 `README.md`、執行說明與手動驗收清單：`README.md`、`specs/001-neon-arena/quickstart.md`
- [X] T013 執行自動測試、語法檢查與本地 HTTP smoke test；同步更新任務狀態：本文件
