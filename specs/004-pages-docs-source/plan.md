# 實作計畫：GitHub Pages `/docs` 發布修正

## 方案

1. 從 `main` 建立 `fix/pages-docs-source` 功能分支。
2. 以現有根目錄 `index.html`、`styles.css`、`game.js` 的同一組 Git blobs 建立 `docs/` 發布鏡像，避免複製時內容漂移。
3. 新增空白 `docs/.nojekyll`，讓 Pages 直接發布靜態內容。
4. 擴充 `tests/smoke-test.js`，驗證 `docs/` 三個檔案存在且與根目錄內容一致，並驗證 `.nojekyll` 存在。
5. 保留根目錄為開發來源；不修改遊戲邏輯。
6. 建立 Pull Request，等待驗證 workflow 通過後再合併。

## 風險與控制

- 風險：根目錄與 `docs/` 未來可能不同步。
- 控制：CI smoke test 直接比較檔案內容，任何漂移都會使 PR 驗證失敗。

## 回滾

若 Pages 發布策略改回 GitHub Actions，可刪除 `docs/` 與本次同步測試，不影響根目錄遊戲。
