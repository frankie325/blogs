import {Easing, Freeze, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {scientificStyle as theme, ScientificCanvas, ScientificLabel} from '../../../../styles/scientific';
import {Normalize} from './Normalize';

const {colors: c, fonts} = theme;
const options = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.bezier(0.22, 1, 0.36, 1)};
const source = {x: 280, y: 405, cell: 70, size: 6, valid: 5};
const targets = [
  {name: 'F3', x: 1190, y: 335, cell: 39, size: 6, valid: 5},
  {name: 'F4', x: 1190, y: 660, cell: 39, size: 4, valid: 3},
];
const points = [
  {label: '图像区域', x: 2.5, y: 1.5, relative: [0.5, 0.3] as const, color: c.focus},
  {label: 'padding 区域', x: 5.5, y: 1.5, relative: [1.1, 0.3] as const, color: c.result},
];

const Grid = ({x, y, cell, size, valid}: {x: number; y: number; cell: number; size: number; valid: number}) => (
  <g>
    {Array.from({length: size * size}, (_, i) => <rect key={i} x={x + i % size * cell} y={y + Math.floor(i / size) * cell} width={cell} height={cell} fill={i % size >= valid || Math.floor(i / size) >= valid ? '#e6e7de' : c.focusSoft} stroke={c.line} strokeWidth="2" />)}
    <rect x={x + 1} y={y + 1} width={valid * cell - 2} height={valid * cell - 2} fill="none" stroke={c.focus} strokeWidth="3" />
  </g>
);

export const Broadcast = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = (start: number, end: number) => interpolate(frame, [start * fps, end * fps], [0, 1], options);
  const transition = progress(0, 0.6);
  const movements = [progress(1.5, 3.4), progress(8, 9.9)];
  const shows = [progress(3.2, 3.7), progress(9.7, 10.2)];

  return (
    <ScientificCanvas>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - transition}}><Freeze frame={8 * fps - 1}><Normalize /></Freeze></div>
      <div style={{opacity: transition}}>
        <div style={{position: 'absolute', left: 96, right: 96, top: 56, display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${c.ink}`, paddingBottom: 20}}>
          <ScientificLabel style={{fontSize: 24}}>FIELD NOTES / DEFORMABLE DETR</ScientificLabel>
          <ScientificLabel color={c.muted} style={{fontSize: 24}}>ENCODER · 04 / 05</ScientificLabel>
        </div>
        <div style={{position: 'absolute', left: 96, top: 135, fontFamily: fonts.serif, fontSize: 62, fontWeight: 700}}>参考点映射到不同尺度</div>
        <div style={{position: 'absolute', left: 98, top: 225, color: c.muted, fontSize: 29}}>从来源层 F3 选择两个点，分别映射到目标层 F3 和 F4。</div>
        <div style={{position: 'absolute', left: 280, top: 340, fontSize: 32, fontWeight: 700}}>来源 F3 · 6 × 6</div>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} aria-label="来源 F3 的有效点和 padding 点分别映射到目标 F3 和 F4">
          <Grid {...source} />
          {targets.map(target => <Grid key={target.name} {...target} />)}
          {points.map((point, i) => {
            const sx = source.x + point.x * source.cell;
            const sy = source.y + point.y * source.cell;
            return <g key={point.label}>
              <circle cx={sx} cy={sy} r="12" fill={point.color} stroke={c.surface} strokeWidth="3" opacity={i === 0 ? 1 : progress(7.4, 8)} />
              {targets.map(target => {
                const tx = target.x + point.relative[0] * target.valid * target.cell;
                const ty = target.y + point.relative[1] * target.valid * target.cell;
                return <g key={target.name}>
                  <path d={`M ${sx} ${sy} L ${tx} ${ty}`} stroke={point.color} strokeWidth="2" strokeDasharray="8 8" opacity={shows[i] * 0.55} />
                  <circle cx={sx + (tx - sx) * movements[i]} cy={sy + (ty - sy) * movements[i]} r="10" fill={point.color} stroke={c.surface} strokeWidth="3" opacity={i === 0 ? progress(1.5, 1.8) : progress(8, 8.3)} />
                </g>;
              })}
            </g>;
          })}
        </svg>
        <div style={{position: 'absolute', left: 810, top: 605, width: 360, background: c.surface, padding: '10px 14px', border: `1px solid ${c.line}`, fontFamily: fonts.mono, fontSize: 22, lineHeight: 1.5, color: c.focus, opacity: shows[0]}}>x: 0.5 × 3/4 = 0.375<br />y: 0.3 × 3/4 = 0.225</div>
        <div style={{position: 'absolute', left: 280, top: 850, fontSize: 26, lineHeight: 1.65}}>
          <span style={{color: c.focus, fontWeight: 700}}>● 图像区域点</span> (2.5, 1.5) → (0.5, 0.3)<br />
          <span style={{color: c.result, fontWeight: 700, opacity: progress(7.4, 8)}}>● padding 点 (5.5, 1.5) → (1.1, 0.3)</span>
        </div>
        <div style={{position: 'absolute', left: 1470, top: 330, width: 350}}>
          <div style={{fontSize: 31, fontWeight: 700}}>目标 F3 · 6 × 6</div>
          <div style={{fontSize: 24, color: c.muted, marginTop: 14}}>图像比例 (5/6, 5/6)</div>
          <div style={{fontFamily: fonts.mono, fontSize: 25, color: c.focus, marginTop: 22, opacity: shows[0]}}>(0.4167, 0.25)</div>
          <div style={{fontFamily: fonts.mono, fontSize: 25, color: c.result, marginTop: 14, opacity: shows[1]}}>(0.9167, 0.25)</div>
        </div>
        <div style={{position: 'absolute', left: 1470, top: 555, width: 390, fontSize: 22, lineHeight: 1.4, color: c.muted}}>映射回自身：网格中的位置不变</div>
        <div style={{position: 'absolute', left: 1470, top: 655, width: 350}}>
          <div style={{fontSize: 31, fontWeight: 700}}>目标 F4 · 4 × 4</div>
          <div style={{fontSize: 24, color: c.muted, marginTop: 14}}>图像比例 (3/4, 3/4)</div>
          <div style={{fontFamily: fonts.mono, fontSize: 25, color: c.focus, marginTop: 22, opacity: shows[0]}}>(0.375, 0.225)</div>
          <div style={{fontFamily: fonts.mono, fontSize: 25, color: c.result, marginTop: 14, opacity: shows[1]}}>(0.825, 0.225)</div>
        </div>
        <div style={{position: 'absolute', left: 820, top: 920, width: 980, fontSize: 26, color: c.muted}}>得到的坐标是相对于整个特征图的归一化坐标</div>
        <div style={{position: 'absolute', left: 96, right: 96, bottom: 48, display: 'flex', justifyContent: 'space-between', fontSize: 22, color: c.muted}}>
          <span>单张图像 · 两个尺度 · 示意</span>
        </div>
      </div>
    </ScientificCanvas>
  );
};
