# AI 合并建议：全部应用测试现场

这是 `test-repo` 的独立 Git worktree，原目录中未完成的合并保持不动。

- 工作区：`D:\workspace\test-repo-ai-apply-all`
- 基线分支：`codex/ai-apply-all-base`
- 当前/左侧分支：`codex/ai-apply-all-left`
- 待合并/右侧分支：`codex/ai-apply-all-right`
- 打开冲突文件：`merge-lab/ai-apply-all/order.mjs`

## 场景

同一文件中准备四处相互隔开的冲突：客户名称规范化、运费规则、结账步骤、收据内容。
左右分支各有自己的契约测试，最终结果应同时保留两边需求。
结账步骤合并还需要同步更新冲突之外的 `EXPECTED_STEP_COUNT`。
左侧另外删除了不再使用的 `legacyReceiptLabel`，可用于观察删除块的建议行为。

## 稍后手动验证

1. 在 Git Agent 中打开本工作区，对 `order.mjs` 打开合并工具并运行 AI 分析。
2. 检查顶部 AI 分析按钮旁的“应用所有建议 (N)”与可执行建议数量一致。
3. 点击后确认所有可执行建议一起应用，纯人工说明保留；尚未自动保存文件。
4. 撤销一次应同时恢复整批结果和建议卡片；重做一次应恢复整批应用结果。
5. 也可先应用一条，再点击全部应用，确认共享的中间区修改不会重复执行。
6. 保存解决后的文件后，在此工作区运行：

   ```powershell
   node --test merge-lab/ai-apply-all/base.test.mjs merge-lab/ai-apply-all/left.test.mjs merge-lab/ai-apply-all/right.test.mjs
   ```

此现场特意停在未解决的合并状态，不要在测试前提交解决结果。
左右分支单独运行各自测试应通过；合并后全部测试应通过。
