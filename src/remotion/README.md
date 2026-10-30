# Remotion 动画

这个目录存放博客动画、播放器和共享视觉风格。动画源码由 Remotion Studio 和 Astro 文章共同使用。

## 目录与分类规则

```text
src/remotion/
├── index.ts、Root.tsx、Composition.tsx  # Studio 入口及 Composition 注册
├── animations/                         # 按知识主题和具体动画分类
│   ├── deformable-detr/
│   │   └── reference-points/
│   │       ├── ReferencePoints.tsx      # 动画主体
│   │       ├── ReferencePointPlayer.tsx # 文章播放器
│   │       ├── config.ts                # Studio / 播放器共同使用的参数
│   │       ├── ReferencePointStyle.tsx  # 该主题的风格样片
│   │       ├── visuals.tsx              # 该动画使用的图元
│   │       └── scenes/                  # 分镜
│   └── pytorch/
│       └── torch-stack/
│           ├── TorchStack.tsx
│           ├── TorchStackPlayer.tsx
│           └── config.ts
└── styles/
    └── scientific/                     # 跨主题复用的风格和预览
```

- 新动画放在 `animations/<主题>/<动画名>/`，目录名使用小写字母和连字符。动画组件、专用播放器、专用图元及数据放在一起。
- 一个动画有多个独立分镜时，在其目录下建立 `scenes/`；单文件动画不必提前创建空目录。
- 仅服务一个动画的代码保留在该动画目录。确实被多个动画复用的图元或工具，可以提取到 `remotion/shared/`；跨主题的视觉风格放在 `styles/<风格名>/`。
- 在 `Composition.tsx` 注册需要在 Studio 中预览或渲染的动画。文章在 MDX 中引用对应播放器，并使用 `client:visible` 等 Astro 客户端指令。
- 一个动画的 Studio 和播放器应共用其 `config.ts` 中的宽、高、帧率及总帧数。改变时长或帧率后，还需检查分镜的实际时长与帧计算是否匹配；共享配置不会自动重排分镜。
- 目录迁移时同步更新 Studio、动画、播放器和 MDX 的导入路径。保留已有 Composition ID，以免影响现有预览和渲染命令。

## 风格模板

- [Field Notes · 科研观察手记](./styles/scientific/README.md)：暖纸色、科学图解和逐步推理的科研科普风格。
- [可复用样式组件与动效](./styles/scientific/index.tsx)；在 Studio 选择 `ScientificStylePreview` 查看样片。

## 使用

从博客项目根目录启动本机 Studio：

```sh
npm run studio -- --port=3335
```

博客开发服务器使用 `npm run dev`。文章播放器由 Astro 构建，无需单独构建 iframe 播放器。
