# Handoff — Privacy Policy & Terms 更新:披露 On-Device Memory + MCP 连接器

**分支**: `docs/privacy-terms-memory-disclosure`
**日期**: 2026-06-21
**改动文件**: `components/PrivacyPageContent.tsx`, `components/TermsPageContent.tsx`
**状态**: 本地 commit,**未 push、未发布**。
**Rev 2 (2026-06-21)**: 已纳入同事 review(2×P1 + 1×P2)——见 §4 标注 *(rev2)* 的条目;核心是把"整库/媒体留本机 vs 文本+元数据摘要外传"讲准、删掉不实的 "read-only"、ToS 去掉 "optional" 歧义。
**性质**: 工程师起草的法律文案对照修订。**发布前需真人律师过一遍**——本文档只做"代码事实 ↔ 文案声明"的工程对照,不构成法律意见。

---

## 0. 这个分支干了什么(一句话)

把 Privacy / Terms 里**唯一一句被代码证伪的话**修正,并补上**两段本该有的披露**(本机 Memory 的存在 + 用户行权机制),全部用"数据在你设备上、你掌控、你导出"的准确措辞——**没有**把本机数据写成"我们(公司)收集/分享"。

---

## 1. 背景(给没跟进这条线的同事)

Fovea 近几个月在客户端 + 后端上线了 **Memory 层** 和 **MCP 连接器**,但网页端(本仓)的 Privacy / Terms 还是 **April 2026** 版,写在这些功能之前,所以两者出现了 gap。本次审查的问题是:**这两份文档要不要同步更新?**

涉及的两个新功能:
- **Memory(本机记忆)**:用户用 Fovea(Quick Answer / VoiceFlow)时,会把"这次问了什么 / 答案摘要 / 当时所在 App·网址·标题 / 截图 / gaze 注视点 / 衍生标签 / 本地向量"存进**本机** SQLite,供日后跨 AI 召回。默认开启(opt-out),onboarding 有披露。
- **MCP 连接器**(公开仓 `hellofovea/fovea-memory-mcp`):一个**本机只读** stdio server,用户**主动**把它装进自己的 AI 客户端(Claude Code / Codex / Claude Desktop)后,该客户端可读到标记为可见的记忆,并发给它自己的模型厂商。

---

## 2. 把审查范围收窄的那把尺子(也是这次最重要的认知)

最初的审查把问题评成"必须大改、有合规敞口"。后来在 founder review 中被纠正——根因是一个**系统性概念错误**:把下面三类混为一谈。正确的法律判断必须严格区分:

- **(a) 公司服务端收集/留存/分享** ← 隐私政策里"we collect / we share / we track"针对的就是这一类
- **(b) app 在用户设备本机存、用户完全掌控**(暂停/隐藏/黑名单/删除)
- **(c) 用户自己装连接器,把自己的本机数据导出到自己选的工具**

**关键事实(已核代码,见 §3):Fovea 服务端对 Memory 内容零接收、零留存;外泄只在用户主动装 MCP 后发生,且 Fovea 服务器全程不在链路里。** 因此 Memory 属于 (b),MCP 外泄属于 (c)——都**不是** (a)。一旦用 (a)/(b)/(c) 这把尺子复核,绝大多数"必须改"的结论都站不住,真正要动的收敛到很小。

> 例:"We do not track your browsing history" 一开始被判"假"。但来源 URL 是 (b) 本机、事件驱动、Fovea 从不接收——所以这句**可辩护,予以保留**。这就是这把尺子的作用。

---

## 3. 支撑本次改动的代码事实(可独立复核)

| 事实 | 证据(file:line) |
|---|---|
| 后端对 memory 内容**零持久化**(只记 token 计量) | `fovea-backend-legacy/handler/memory_organizer_handler.go:65`、`memory_embed_handler.go`(仅 `supabase.LogLLMUsage`,无 content INSERT) |
| 服务端 profile 表已**删除**("The server persists nothing") | `fovea-backend-legacy/supabase/migrations/20260613_drop_user_profile.sql` |
| Memory **本机** SQLite,含 question/answer/source url·domain·title/截图 ref/gaze/标签 | `fovea-mac/FoveaMac/Models/HistoryStore.swift:1780`(recent_memory)、`:2685`(memory_vectors) |
| Memory 捕获**默认开**(opt-out),但 onboarding 有披露 | `AppDelegate.swift:24`(默认 true)、`HistoryStore.swift:854`、`OnboardingView.swift:141`(末页披露)、`MemoryLinkIntroSheet` |
| **唯一被证伪的声明**:开 Memory 页会**自动**把衍生文本 POST 后端(organize/embed),非"重新提交" | `fovea-mac/FoveaMac/MainWindow/MemoryView.swift:228`(`.onAppear { autoOrganizeIfNeeded(); backfillVectorsIfNeeded() }`)、`:815`、`:829` |
| organize 送**文本+元数据摘要**(问题/精炼问题/答案摘要/来源 app·url·title/证据文字/gaze),**不送**截图/音频/`file://` 路径(脱敏) | `HistoryItem.swift:264-296`(Event = source + content{userQuestion,refinedQuestion,answer} + evidence;`redactedSource`/`redactedEvidence` 仅 null 掉 `file://`)、`BackendMessages.swift`(MemoryEmbedRequest = `texts:[String]`) |
| MCP 连接器**不是 read-only**:含 `forget_fovea_memory`(本地 soft-delete)+ 每次调用写 `audit.sqlite` | `fovea-memory-mcp/fovea-memory-mcp.js:697,731`(forget 工具)、`:520,525`(UPDATE soft-delete)、`:70,798`(writeAudit) |
| MCP 外泄链路:本机 DB → 本机 node 进程 → 用户自己的 AI 客户端,**Fovea 服务器不在其中**;用户手动安装 | `fovea-memory-mcp/fovea-memory-mcp.js:30-50, 743-764`;`fovea-mac/.../MCPIntegrationInstaller.swift:9-10`(`npx -y github:hellofovea/fovea-memory-mcp`,公开仓,直装可用) |

> 复核建议:上面每条都给了 file:line,可在对应仓库直接核。后端"零留存"是整个判断的支点——grep 各 handler 确认只有 `LogLLMUsage`、无任何 content 落库即可。

---

## 4. 逐条改动 + 原因

### Privacy Policy(`components/PrivacyPageContent.tsx`)

1. **`Last updated: April 2026` → `June 2026`**
   因为本次有实质文字改动,按文档自己的 "Changes" 条款须更日期。
   *(注:本次改动**不削减**任何用户权利,故**不触发**"通知用户"那一支——该支只对"reduce your rights"的变更适用。)*

2. **修正 "Customer Content You Provide" 第 2 段(唯一的真·错句)**
   原文绝对句:"This local data is **not automatically uploaded** to our servers **unless you explicitly re-submit** a previous request." 被代码证伪——开 Memory 页/建记忆时会**自动**把文本+元数据摘要发去后端 organize/embed(见 §3)。
   修法 *(rev2 已修准)*:强承诺**重新划界到"整个 Memory 库 + 媒体(音频/截图/文件)留在本机、服务器不留存"**(而不是"prompts",因为问题文本本身会被外传——这正是同事 P1#1 指出的冲突);外传的是 "**short text and metadata excerpts**",并据 §3 显式列出包含 **来源 app·url·title 与 gaze**,不再只写"问题/摘要/标签"。On-Device Memory 段首句也同步从"never uploaded"改为"库与媒体留本机、摘要可实时中转但不入服务器",消除两处自相矛盾。

3. **新增 `On-Device Memory` 段**(放在 "Information We Collect" 之后,独立成节,**不**放进"我们收集"里)
   为什么不是"零披露所以必须补":本机存储其实已被旧 para 2 + Retention 行以 "local session history" 覆盖过。但旧文案只列了"audio/screenshots/prompts",**漏了** source URL/gaze/选区/标签/embeddings,且没讲它是**默认开、持久、可控**。所以这是**完整性/清晰度**补充,框定为 (b) 本机+用户掌控,并把 **Memory Connector** 作为 (c) 用户自助导出在此中性说明。
   *(rev2 已修)* 连接器**不写 "read-only"**(同事 P1#2:`forget_fovea_memory` 会本地 soft-delete、且写 `audit.sqlite`);改为"runs locally、只暴露你标记可见的、可执行本地动作(如被调用时 soft-delete 一条记忆)、在本机留访问日志、Fovea 服务器不在链路"。
   **红线**:全段不得出现 "we collect Memory" / "we store your Memory",也不得进 "Sharing With Others"——否则反把准确文档改成不准确。

4. **新增 `Your Rights and Choices` 段**(放在 "Permissions We Request" 之后)
   这是**真正缺失的标准条款**,且与 Memory **无关**:Fovea 服务端确实持有账号 PII(邮箱 + 用量),而原文档**没有任何行权机制**,却在 "Changes" 段自引用了未定义的 "your rights"。补一个标准 access/deletion + GDPR/CCPA 指向。
   分两层写:① **本机 Memory 控制**——明确"数据在你设备上、你直接掌控,Fovea 没有服务端副本可代你取/删";② **账号数据**——access/deletion/停止处理 + 不出售。**红线**:不写"opt-out of sharing / 数据可携"那种暗示 Fovea 持有/能导出 Memory 内容的话。

### Terms of Service(`components/TermsPageContent.tsx`)

5. **`Last updated` 同步 → `June 2026`**

6. **§4 "Our Services" 补一句**:承认 Fovea 维护本机 Memory + 可选本机连接器,指向 Privacy。
   §4 原本只说"capture context and assembles it into prompts",没提持久 Memory/连接器——补一句中性说明对齐现实即可。**§3 / §7 保持原样**(已核为准确,见 §5)。
   *(rev2 已修)* Memory 不再写 "optional"(同事 P2:默认开,写 optional 会被读成 opt-in);改为 "**user-controlled on-device Memory ... on by default ... you can disable or delete**"。连接器仍是 optional(确属用户主动安装)。

---

## 5. 刻意**没**改的地方(及原因)

| 没动 | 为什么 |
|---|---|
| "We do not track your browsing history" | (b) 本机、事件驱动、Fovea 不接收 → 可辩护。新增的 On-Device Memory 段已讲清"本机/你掌控",二者不冲突。删它=无谓退让。 |
| 服务端各项声明("immediately discarded / on our servers" 等) | 代码核实属实(后端零留存)。`on our servers` 限定词是 load-bearing 的,动它会削弱准确声明。 |
| ToS §3(license "solely for providing the Services")、§7(第三方 AI) | 复核为不虚假:§3 是窄授权、未声称服务端存内容;§7 描述 Fovea 自己发的中转。连接器是 (c) 用户导出,§7 没否认它。 |
| Retention 表新增"公司留存"行 | 全是 (b) 本机数据;加进"公司留存"反而误导成 Fovea 持有。顶多可微调现有本机行(本次未做,留待文案统一)。 |

---

## 6. 这次结论是怎么来的(过程,便于你判断可信度)

两轮对抗式多 agent 复核(代码 grounded):
1. **第一轮**:5 个仓并行 fact-find → 三视角法律 lens(逐条事实核对 / GDPR·CCPA·AppStore 合规 / 唱反调最小改动)+ 产品决策 lens。初稿偏"必须大改"。
2. **第二轮(founder 质疑后)**:用 §2 的 (a)/(b)/(c) 尺子,对每条 finding 做"dissolve-or-survive",故意往枪毙方向判。结果:多数"必须改"被**降级或溶解**;只有 §4 的两件(修错句 + 补行权段)在对抗下**幸存**为真问题。本分支只落地幸存项 + 准确措辞的透明性补充。

---

## 7. 复核 / 验证方法

```bash
cd foveafrontend
npx tsc --noEmit                      # 通过(JSX/类型)
npx eslint components/PrivacyPageContent.tsx components/TermsPageContent.tsx   # 无报错
git diff main...docs/privacy-terms-memory-disclosure -- components/   # 看纯文案 diff
```
- 本次只改 JSX 文本内容,无逻辑/组件结构变化。
- §3 的每条 file:line 可在对应仓库独立核对。

---

## 8. 待办 / 范围外(本分支**不**含)

- [ ] **真人律师过一遍**再发布。
- [ ] **`fovea-web` 镜像仓**(`hellofovea/fovea-web`,org 与域名一致,带 `/zh`):它的 Privacy 文案与本仓**已 diverged**(更旧)。若它也在 hellofovea.com 线上提供 /privacy、/terms,需把同等修订**镜像**过去。本分支只改了 `foveafrontend`(其文案与线上截图逐字一致)。
- [ ] **App Store 隐私营养标签**复核(User Content/截图/音频/浏览/gaze):属 app 侧,不在本网页仓范围。
- [ ] `/zh` 中文版 Privacy/Terms(若有)同步。
- [ ] **App 自身文案也把 MCP 叫 "read-only"**(`fovea-mac/.../Loc.swift:288` 安装提示词 + 公开仓 README),但 `forget_fovea_memory` 会 soft-delete——同 P1#2,属 app/仓侧 copy 不一致,需另行修正(本网页分支已改准)。
- [ ] 产品侧(另议,非本分支):下载页 "Add to Chrome" 卡片建议移除(扩展 release 关着、`debugger` 权限 CWS-hostile);MCP 安装暂留 app 内 + 独立 docs 页;公开仓 README 仍写 `npx -y fovea-memory-mcp@1`(npm 未发布会 404),需改 `github:` 形式或 npm publish。

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
