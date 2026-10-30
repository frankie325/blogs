import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const palette = {
  background: '#0b1321',
  panel: '#121f32',
  panelBorder: '#263b54',
  text: '#edf5ff',
  muted: '#a6b7cb',
  blue: '#69c9ff',
  purple: '#c49cff',
  orange: '#ffbf72',
  green: '#8be2bf',
  red: '#ff8585',
};

const font = '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';
const mono = '"SFMono-Regular", Consolas, "Liberation Mono", monospace';

export const SceneShell = ({
  chapter,
  title,
  subtitle,
  children,
}: {
  chapter: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: palette.background, color: palette.text, fontFamily: font}}>
      <div style={{position: 'absolute', left: 95, right: 95, top: 62, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 24, letterSpacing: 3.5, color: palette.blue, fontWeight: 700}}>DEFORMABLE DETR · ENCODER</div>
        <div style={{fontSize: 24, color: palette.muted, fontFamily: mono}}>{chapter} / 06</div>
      </div>
      <div style={{position: 'absolute', left: 95, right: 95, top: 124, opacity: interpolate(frame, [0, 0.45 * fps], [0.8, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <div style={{fontSize: 62, fontWeight: 750, lineHeight: 1.2}}>{title}</div>
        <div style={{fontSize: 29, color: palette.muted, marginTop: 17, lineHeight: 1.4}}>{subtitle}</div>
      </div>
      <div style={{position: 'absolute', left: 95, right: 95, top: 250, bottom: 105, display: 'flex', gap: 34}}>{children}</div>
      <div style={{position: 'absolute', left: 95, right: 95, bottom: 44, display: 'flex', justifyContent: 'space-between', fontSize: 23, color: palette.muted}}>
        <span>get_reference_points · 几何参考点示意</span>
        <span>坐标按 (x, y) 排列</span>
      </div>
    </AbsoluteFill>
  );
};

export const Panel = ({children, style}: {children: ReactNode; style?: CSSProperties}) => (
  <div style={{background: palette.panel, border: `2px solid ${palette.panelBorder}`, borderRadius: 28, padding: '36px 40px', boxSizing: 'border-box', ...style}}>{children}</div>
);

export const Heading = ({children, color = palette.text}: {children: ReactNode; color?: string}) => (
  <div style={{fontSize: 36, fontWeight: 700, color, lineHeight: 1.25}}>{children}</div>
);

export const Description = ({children, style}: {children: ReactNode; style?: CSSProperties}) => (
  <div style={{fontSize: 30, color: palette.muted, lineHeight: 1.5, ...style}}>{children}</div>
);

export const CodeBlock = ({lines, active}: {lines: readonly string[]; active?: number}) => (
  <div style={{background: '#0a1525', border: '1px solid #30425b', borderRadius: 20, padding: '20px 22px', fontFamily: mono, fontSize: 30, lineHeight: 1.55, color: '#c4d7eb'}}>
    {lines.map((line, index) => (
      <div key={`${index}-${line}`} style={{whiteSpace: 'pre', color: active === index ? palette.orange : '#c4d7eb', background: active === index ? '#293242' : 'transparent', borderRadius: 7, paddingLeft: 8}}>{line || ' '}</div>
    ))}
  </div>
);

export const fadeIn = (frame: number, start: number, duration = 12) => interpolate(frame, [start, start + duration], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** refX/refY are full-feature-map normalized coordinates, not array indices. */
export const FeatureGrid = ({
  size,
  valid,
  cell,
  reference,
  reveal = 1,
}: {
  size: number;
  valid: number;
  cell: number;
  reference?: {x: number; y: number; color?: string; reveal?: number};
  reveal?: number;
}) => {
  const origin = 34;
  const extent = size * cell;
  const width = extent + 125;
  const height = extent + 90;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible', display: 'block'}} aria-label={`${size} by ${size} feature grid`}>
      {Array.from({length: size * size}, (_, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
        const padded = row >= valid || col >= valid;
        return (
          <g key={index}>
            <rect x={origin + col * cell} y={origin + row * cell} width={cell - 3} height={cell - 3} rx={7} fill={padded ? '#243042' : '#173c56'} stroke={padded ? '#536171' : '#34667f'} strokeWidth={2} />
            <circle cx={origin + (col + 0.5) * cell} cy={origin + (row + 0.5) * cell} r={padded ? 3.5 : 4.5} fill={padded ? '#617080' : '#8bc8de'} opacity={Math.max(0, Math.min(1, reveal * size * size - index))} />
          </g>
        );
      })}
      <text x={origin + extent / 2} y={height - 13} textAnchor="middle" fontSize={23} fill={palette.muted} fontFamily={font}>宽 W = {size}</text>
      <text x={origin + extent + 10} y={origin + extent / 2} fontSize={23} fill={palette.muted} fontFamily={font}>H = {size}</text>
      {reference && (
        <g opacity={reference.reveal ?? 1}>
          <circle cx={origin + reference.x * extent} cy={origin + reference.y * extent} r={17} fill={reference.color ?? palette.orange} stroke="#ffffff" strokeWidth={4} />
          <circle cx={origin + reference.x * extent} cy={origin + reference.y * extent} r={29} fill="none" stroke={reference.color ?? palette.orange} strokeWidth={3} opacity={0.65} />
        </g>
      )}
    </svg>
  );
};

export const Legend = () => (
  <div style={{display: 'flex', gap: 30, alignItems: 'center', fontSize: 23, color: palette.muted}}>
    <span><span style={{display: 'inline-block', width: 16, height: 16, borderRadius: 4, background: '#34718f', marginRight: 9}} />图像区域</span>
    <span><span style={{display: 'inline-block', width: 16, height: 16, borderRadius: 4, background: '#536171', marginRight: 9}} />padding</span>
    <span><span style={{display: 'inline-block', width: 16, height: 16, borderRadius: 20, background: palette.orange, marginRight: 9}} />当前参考点</span>
  </div>
);
