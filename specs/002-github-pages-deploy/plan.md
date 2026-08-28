# 技術計畫：GitHub Pages 發布

- 以 GitHub 官方 `actions/configure-pages`、`actions/upload-pages-artifact` 與 `actions/deploy-pages` 組成發布流程。
- workflow 只在 `main` 推送或手動觸發時發布，避免任意 Pull Request 取得 Pages 寫入權限。
- `upload-pages-artifact` 直接上傳 repository 根目錄，讓 `index.html` 位於 artifact 頂層。
- 設定 `contents: read`、`pages: write` 與 `id-token: write`，並使用 `github-pages` environment。
