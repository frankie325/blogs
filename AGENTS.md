# 仓库贡献指南

## 项目结构与模块组织

本项目是基于 Astro 的博客，使用 TypeScript、MDX、React 和 Remotion。博客文章放在 `src/content/blog/`，文档页面放在 `src/content/docs/`；内容格式由 `src/content.config.ts` 定义。普通文章使用 `.md`，需要嵌入组件时使用 `.mdx`。博客文章的 frontmatter 必须包含 `title`、`description` 和 `publishDate`。

页面、布局和通用界面组件分别位于 `src/pages/`、`src/layouts/` 和 `src/components/`。需要处理的资源放在 `src/assets/`，静态文件放在 `public/`。主题包和预设分别位于 `packages/pure/` 和 `preset/`。Remotion 动画按 `src/remotion/animations/<主题>/<动画名>/` 分类，动画专用的播放器和分镜放在对应目录；共享风格放在 `src/remotion/styles/`。详见 `src/remotion/README.md`。

## 开发、检查与构建命令

- `npm install`：安装依赖。
- `npm run dev`：启动 Astro 开发服务器。
- `npm run studio -- --port=3335`：启动 Remotion Studio，预览动画。
- `ASTRO_TELEMETRY_DISABLED=1 npm run check`：运行 Astro 和 TypeScript 检查。
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`：执行检查并将静态站点构建到 `dist/`。
- `npm run preview`：在本地预览生产构建。
- `npm run lint` 和 `npm run format`：分别应用 ESLint 修复和 Prettier 格式化；两者都会修改文件。

## 代码风格与命名

遵循 `prettier.config.ts`：两个空格缩进、单引号、不使用分号、LF 换行、每行建议不超过 100 个字符。React 组件使用 PascalCase，动画目录使用 kebab-case。修改时保持与周围代码一致。MDX 中需要交互的组件使用 `client:visible` 等 Astro 客户端指令。

## 验证指南

项目目前没有配置测试运行器或覆盖率门槛。运行 `npm run check`；修改站点或内容时还应运行 `npm run build`。预览改动后的页面，并在 Remotion Studio 中检查动画节奏和布局；类型检查通过不代表视觉效果正确。草稿文章可能不会出现在生产构建中。

## 提交与 Pull Request

当前工作目录无法读取 Git 历史，因此无法确认既有的提交信息规范。提交标题应简洁、准确。Pull Request 应说明改动内容、列出已执行的检查、关联相关 issue；涉及视觉变化时附上截图或录屏。

## Agent 注意事项

配置了 CodeGraph 时，查询符号关系应优先使用其结构化搜索和追踪工具；查找字面文本使用文本搜索。如果服务提示项目尚未初始化，运行 `codegraph init -i` 前先询问用户。
