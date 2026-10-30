import {Easing, Freeze, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {scientificStyle as theme, ScientificCanvas, ScientificLabel} from '../../../../styles/scientific';
import {Overview} from './Overview';

const {colors: c, fonts} = theme;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: ease};

export const GridCenters = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = (start: number, end: number) => interpolate(frame, [start * fps, end * fps], [0, 1], clamp);
  const transition = progress(0, 0.6);
  const exit = progress(0.3, 1.1);
  const center = progress(1.1, 2.0);
  const yAxis = progress(2.1, 2.7);
  const xAxis = progress(2.8, 3.4);
  const points = progress(3.6, 5.6);
  const example = progress(5.7, 6.2);
  const cell = 62;
  const left = 520 + 440 * center - 3 * cell;
  const top = 405;
  const values = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5];

  return (
    <ScientificCanvas>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - transition}}><Freeze frame={5 * fps - 1}><Overview /></Freeze></div>
      <div style={{position: 'absolute', left: 96, right: 96, top: 56, display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${c.ink}`, paddingBottom: 20, opacity: transition}}>
        <ScientificLabel style={{fontSize: 24}}>FIELD NOTES / DEFORMABLE DETR</ScientificLabel>
        <ScientificLabel color={c.muted} style={{fontSize: 24}}>ENCODER · 02 / 05</ScientificLabel>
      </div>
      <div style={{position: 'absolute', left: 96, top: 135, fontFamily: fonts.serif, fontSize: 62, fontWeight: 700, opacity: transition}}>从网格生成参考点</div>
      <div style={{position: 'absolute', left: 98, top: 225, color: c.muted, fontSize: 29, opacity: transition}}>以 F3 的 6 × 6 特征图为例；padding 位置也生成网格中心。</div>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-label="6 乘 6 特征图的 x 和 y 网格中心与 meshgrid 生成的坐标">
        <g opacity={transition * (1 - exit)} transform={`translate(${1397 + exit * 520 - 124}, ${top + 62})`}>
          {Array.from({length: 16}, (_, i) => <rect key={i} x={(i % 4) * cell} y={Math.floor(i / 4) * cell} width={cell} height={cell} fill={i % 4 === 3 || Math.floor(i / 4) === 3 ? '#e6e7de' : c.focusSoft} stroke={c.line} strokeWidth={2} />)}
          <text x="0" y="-20" fill={c.muted} fontFamily={fonts.sans} fontSize="26">F4 · 4 × 4</text>
        </g>
        <g transform={`translate(${left}, ${top})`} opacity={transition}>
          {Array.from({length: 36}, (_, i) => <rect key={i} x={(i % 6) * cell} y={Math.floor(i / 6) * cell} width={cell} height={cell} fill={i % 6 === 5 || Math.floor(i / 6) === 5 ? '#e6e7de' : c.focusSoft} stroke={c.line} strokeWidth={2} />)}
          <text x="0" y="-58" fill={c.focus} fontFamily={fonts.sans} fontSize="27">F3 · 6 × 6</text>
          {values.map((v, i) => <text key={`x${v}`} x={(i + 0.5) * cell} y="-14" textAnchor="middle" fill={c.result} fontFamily={fonts.mono} fontSize="23" opacity={xAxis}>{v}</text>)}
          {values.map((v, i) => <text key={`y${v}`} x="-18" y={(i + 0.5) * cell + 8} textAnchor="end" fill={c.focus} fontFamily={fonts.mono} fontSize="23" opacity={yAxis}>{v}</text>)}
          {Array.from({length: 36}, (_, i) => {
            const opacity = Math.max(0, Math.min(1, points * 36 - i));
            return <circle key={i} cx={(i % 6 + 0.5) * cell} cy={(Math.floor(i / 6) + 0.5) * cell} r={6} fill={c.ink} opacity={opacity} />;
          })}
          <circle cx={2.5 * cell} cy={1.5 * cell} r="13" fill={c.result} stroke={c.surface} strokeWidth="4" opacity={example} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 110, top: 390, width: 450, opacity: yAxis, fontFamily: fonts.mono, fontSize: 26, lineHeight: 1.7}}>
        <ScientificLabel style={{fontSize: 23}}>01 / Y 方向</ScientificLabel>
        <div style={{marginTop: 18, fontFamily: fonts.sans}}>从上到下，取每行的中心</div>
        <div style={{color: c.muted, fontSize: 24}}>0.5, 1.5, 2.5, …, 5.5</div>
      </div>
      <div style={{position: 'absolute', left: 110, top: 575, width: 470, opacity: xAxis, fontFamily: fonts.mono, fontSize: 26, lineHeight: 1.7}}>
        <ScientificLabel color={c.result} style={{fontSize: 23}}>02 / X 方向</ScientificLabel>
        <div style={{marginTop: 18, fontFamily: fonts.sans}}>从左到右，取每列的中心</div>
        <div style={{color: c.muted, fontSize: 24}}>0.5, 1.5, 2.5, …, 5.5</div>
      </div>
      <div style={{position: 'absolute', left: 1280, top: 410, width: 540, opacity: points}}>
        <ScientificLabel color={c.ink} style={{fontSize: 23}}>03 / 组合坐标</ScientificLabel>
        <div style={{fontSize: 28, lineHeight: 1.5, marginTop: 25}}>组合横纵坐标，得到 36 个网格中心。</div>
        <div style={{fontSize: 27, lineHeight: 1.5, marginTop: 25, color: c.result, opacity: example}}>例如第 1 行、第 2 列<br />(x, y) = (2.5, 1.5)</div>
      </div>
      <div style={{position: 'absolute', left: 96, right: 96, bottom: 48, display: 'flex', justifyContent: 'space-between', fontFamily: fonts.mono, fontSize: 22, color: c.muted, opacity: transition}}>
        <span>索引从 0 开始 · 尺寸为示意</span><span>参考点尚未归一化</span>
      </div>
    </ScientificCanvas>
  );
};
