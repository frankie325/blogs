import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ScientificCanvas, scientificStyle as theme} from '../../../styles/scientific';

const {colors: c, fonts} = theme;
const inputs = [
  {name: 'a', values: [[1, 2, 3], [4, 5, 6]], color: c.focus, background: c.focusSoft},
  {name: 'b', values: [[7, 8, 9], [10, 11, 12]], color: c.result, background: c.resultSoft},
];

const examples = [
  {dim: 0, shape: '[2, 2, 3]', caption: '新维度放在最前：先选择 a 或 b', slices: [
    {label: 'result[0] = a', rows: [[1, 2, 3], [4, 5, 6]], sources: [[0, 0, 0], [0, 0, 0]]},
    {label: 'result[1] = b', rows: [[7, 8, 9], [10, 11, 12]], sources: [[1, 1, 1], [1, 1, 1]]},
  ]},
  {dim: 1, shape: '[2, 2, 3]', caption: '新维度插在中间：每一行依次取自 a、b', slices: [
    {label: 'result[0]', rows: [[1, 2, 3], [7, 8, 9]], sources: [[0, 0, 0], [1, 1, 1]]},
    {label: 'result[1]', rows: [[4, 5, 6], [10, 11, 12]], sources: [[0, 0, 0], [1, 1, 1]]},
  ]},
  {dim: 2, shape: '[2, 3, 2]', caption: '新维度放在最后：每个位置配对 a、b', slices: [
    {label: 'result[0]', rows: [[1, 7], [2, 8], [3, 9]], sources: [[0, 1], [0, 1], [0, 1]]},
    {label: 'result[1]', rows: [[4, 10], [5, 11], [6, 12]], sources: [[0, 1], [0, 1], [0, 1]]},
  ]},
] as const;

function Matrix({rows, sources, cell = 58}: {rows: readonly (readonly number[])[]; sources: readonly (readonly number[])[]; cell?: number}) {
  return <div style={{display: 'grid', gridTemplateColumns: `repeat(${rows[0].length}, ${cell}px)`, gap: 5}}>
    {rows.flatMap((row, i) => row.map((value, j) => <div key={`${i}-${j}`} style={{width: cell, height: 48, display: 'grid', placeItems: 'center', background: inputs[sources[i][j]].background, color: inputs[sources[i][j]].color, fontFamily: fonts.mono, fontSize: 24, fontWeight: 700, borderRadius: 4}}>{value}</div>))}
  </div>;
}

export const TorchStack = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scene = Math.min(2, Math.floor(frame / (8 * fps)));
  const example = examples[scene];
  const local = frame - scene * 8 * fps;
  const reveal = interpolate(local, [0, fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const outputReveal = interpolate(local, [fps, 2 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <ScientificCanvas>
    <div style={{position: 'absolute', left: 64, right: 64, top: 40, display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${c.ink}`, paddingBottom: 15, fontFamily: fonts.mono, fontSize: 17, fontWeight: 700, color: c.focus}}><span>PYTORCH / TENSOR OPERATIONS</span><span style={{color: c.muted}}>STACK · 0{scene + 1} / 03</span></div>
    <div style={{position: 'absolute', left: 64, top: 100, fontFamily: fonts.serif, fontSize: 48, fontWeight: 700}}>在新维度上堆叠</div>
    <div style={{position: 'absolute', left: 66, top: 170, fontSize: 24, color: c.muted}}>两个形状相同的矩阵，按 dim 的位置插入一个新维度</div>
    <div style={{position: 'absolute', left: 64, top: 235, width: 350}}>
      <div style={{fontFamily: fonts.mono, fontSize: 18, color: c.muted, marginBottom: 20}}>INPUTS · shape [2, 3]</div>
      {inputs.map((input, index) => <div key={input.name} style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20}}><span style={{fontFamily: fonts.mono, fontSize: 30, fontWeight: 700, width: 25, color: input.color}}>{input.name}</span><Matrix rows={input.values} sources={input.values.map(row => row.map(() => index))} /></div>)}
    </div>
    <div style={{position: 'absolute', left: 430, top: 305, fontSize: 48, color: c.faint, opacity: reveal}}>→</div>
    <div style={{position: 'absolute', left: 520, top: 235, right: 64, opacity: reveal}}>
      <div style={{fontFamily: fonts.mono, fontSize: 24, fontWeight: 700, color: c.focus}}>torch.stack((a, b), dim={example.dim})</div>
      <div style={{marginTop: 14, fontSize: 23, color: c.ink}}>{example.caption}</div>
      <div style={{display: 'flex', gap: 38, marginTop: 35, opacity: outputReveal}}>{example.slices.map(slice => <div key={slice.label}><div style={{fontFamily: fonts.mono, fontSize: 18, color: c.muted, marginBottom: 12}}>{slice.label}</div><Matrix rows={slice.rows} sources={slice.sources} /></div>)}</div>
      <div style={{marginTop: 22, fontFamily: fonts.mono, fontSize: 24, color: c.ink, opacity: outputReveal}}>shape: <span style={{color: c.result, fontWeight: 700}}>{example.shape}</span></div>
    </div>
    <div style={{position: 'absolute', left: 64, right: 64, bottom: 43, borderTop: `1px solid ${c.line}`, paddingTop: 18, display: 'flex', justifyContent: 'space-between', fontSize: 19, color: c.muted}}><span>颜色表示元素来源：<span style={{color: c.focus}}>a</span> / <span style={{color: c.result}}>b</span></span><span>输出展示为沿第 0 维取出的切片</span></div>
  </ScientificCanvas>;
};
