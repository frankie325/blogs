import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

/** Field Notes：以 1280 × 720 为设计基准的科研叙事视觉语言。 */
export const scientificStyle = {
  colors: {
    background: '#f1f0e9', surface: '#faf9f4', ink: '#172d2c',
    muted: '#506563', faint: '#a8b5ab', line: '#c5cfc4',
    focus: '#076f64', result: '#c44b30', context: '#bd8b31',
    focusSoft: '#d5e7d9', resultSoft: '#f4dfd4',
  },
  fonts: {
    sans: '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif',
    mono: '"SFMono-Regular", Menlo, Consolas, monospace',
    serif: '"Songti SC", "Noto Serif CJK SC", Georgia, serif',
  },
  canvas: {width: 1280, height: 720, safe: 64},
} as const;

const {colors, fonts} = scientificStyle;

/** 暖纸色与细网格构成的静态背景，不依赖外部纹理。 */
export const ScientificCanvas = ({children}: {children: ReactNode}) => (
  <AbsoluteFill
    style={{background: colors.background, color: colors.ink, fontFamily: fonts.sans, overflow: 'hidden'}}
  >
    <AbsoluteFill
      style={{backgroundImage: `linear-gradient(${colors.line} 1px, transparent 1px), linear-gradient(90deg, ${colors.line} 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.24}}
    />
    {children}
  </AbsoluteFill>
);

export const ScientificLabel = ({children, color = colors.focus, style}: {children: ReactNode; color?: string; style?: CSSProperties}) => (
  <div style={{color, fontFamily: fonts.mono, fontSize: 19, fontWeight: 700, letterSpacing: 1.5, ...style}}>{children}</div>
);

/** 基于帧而非 CSS 动画，拖动和渲染时结果一致。 */
export const useScientificReveal = (startSeconds: number, durationSeconds = 0.5) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return interpolate(frame, [startSeconds * fps, (startSeconds + durationSeconds) * fps], [0, 1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
};
