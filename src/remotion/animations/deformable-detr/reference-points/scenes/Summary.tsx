import {Easing, Freeze, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {scientificStyle as theme, ScientificCanvas, ScientificLabel} from '../../../../styles/scientific';
import {Broadcast} from './Broadcast';

const {colors: c, fonts} = theme;
const options = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.bezier(0.22, 1, 0.36, 1)};
const levels = [
  {name: 'F3', size: '6 × 6', count: 36, fill: c.focusSoft, stroke: c.focus},
  {name: 'F4', size: '4 × 4', count: 16, fill: '#e7ecdb', stroke: '#68824f'},
  {name: 'F5', size: '2 × 2', count: 4, fill: '#f3e7c9', stroke: c.context},
  {name: 'F6', size: '1 × 1', count: 1, fill: c.resultSoft, stroke: c.result},
];

export const Summary = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = (a: number, b: number) => interpolate(frame, [a * fps, b * fps], [0, 1], options);
  const transition = progress(0, 0.5);
  const flatten = progress(0.8, 2.8);
  const intoBlocks = progress(3.3, 4.2);
  const merge = progress(5.2, 7.2);
  const joined = progress(7, 7.5);
  const expanded = progress(9.1, 9.8);
  const perLevel = progress(9.8, 11.1);
  const pair = progress(11, 11.6);

  return (
    <ScientificCanvas>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - transition}}><Freeze frame={20 * fps - 1}><Broadcast /></Freeze></div>
      <div style={{opacity: transition}}>
        <div style={{position: 'absolute', left: 96, right: 96, top: 56, display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${c.ink}`, paddingBottom: 20}}>
          <ScientificLabel style={{fontSize: 24}}>FIELD NOTES / DEFORMABLE DETR</ScientificLabel>
          <ScientificLabel color={c.muted} style={{fontSize: 24}}>ENCODER · 05 / 05</ScientificLabel>
        </div>
        <div style={{position: 'absolute', left: 96, top: 135, fontFamily: fonts.serif, fontSize: 62, fontWeight: 700}}>参考点的输出形状</div>
        <div style={{position: 'absolute', left: 98, top: 225, color: c.muted, fontSize: 29}}>切换为四尺度示例：1 张图像，所有网格位置参与拼接。</div>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-label="四层参考点拼接为 57 个位置，再映射到四个尺度，每个坐标由 x 和 y 构成">
          <g opacity={1 - intoBlocks}>
            {levels.map((level, i) => {
              const size = [6, 4, 2, 1][i];
              const cell = 17;
              const originX = 270;
              const originY = 340 + i * 120;
              return <g key={level.name}>
                <text x="135" y={originY + 45} fill={level.stroke} fontFamily={fonts.sans} fontSize="27">{level.name} · {level.size}</text>
                <g opacity={1 - flatten}>
                  {Array.from({length: level.count}, (_, j) => <rect key={j} x={originX + j % size * cell} y={originY + Math.floor(j / size) * cell} width={cell} height={cell} fill={level.fill} stroke={level.stroke} strokeWidth="1" />)}
                </g>
                {Array.from({length: level.count}, (_, j) => {
                  const x = originX + (j % size + 0.5) * cell;
                  const y = originY + (Math.floor(j / size) + 0.5) * cell;
                  const targetX = 470 + j * 31;
                  const targetY = originY + 42;
                  return <circle key={j} cx={x + (targetX - x) * flatten} cy={y + (targetY - y) * flatten} r="5" fill={level.stroke} />;
                })}
                <text x="1630" y={originY + 50} fill={c.muted} fontFamily={fonts.sans} fontSize="24" opacity={flatten}>{level.count} 个位置</text>
              </g>;
            })}
            <text x="960" y="875" textAnchor="middle" fill={c.muted} fontFamily={fonts.sans} fontSize="27" opacity={flatten}>按行展平：从左到右，再从上到下；每个位置对应一对参考点坐标</text>
          </g>
          <g opacity={intoBlocks * (1 - expanded)}>
            {levels.map((level, i) => {
              const x = 200 + (330 + i * 250 - 200) * merge;
              const y = 330 + i * 105 + (500 - (330 + i * 105)) * merge;
              return <g key={level.name}>
                <rect x={x} y={y} width="250" height="78" rx="8" fill={level.fill} stroke={level.stroke} strokeWidth="3" />
                <text x={x + 125} y={y + 49} fill={c.ink} textAnchor="middle" fontSize="25" fontFamily={fonts.sans}>{level.name} · {level.count} 个位置</text>
                <text x={x - 22} y={y + 50} fill={c.muted} textAnchor="end" fontSize="23" fontFamily={fonts.mono} opacity={1 - merge}>{level.size}</text>
              </g>;
            })}
          </g>
          <g opacity={expanded}>
            {/* 四张平行切片分别表示同一批来源点在四个目标尺度上的坐标。 */}
            {[3, 2, 1, 0].map((layer) => {
              const x = 680 + layer * 110 * perLevel;
              const y = 365 - layer * 30 * perLevel;
              const h = 330;
              const w = 230;
              const level = levels[layer];
              return <g key={level.name} opacity={layer === 0 ? 1 : perLevel}>
                <rect x={x} y={y} width={w} height={h} rx="4" fill={level.fill} fillOpacity="0.93" stroke={level.stroke} strokeWidth="3" />
                <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={level.stroke} strokeWidth="2" />
                {[1, 2, 3, 4, 5].map(i => <line key={i} x1={x} y1={y + i * 55} x2={x + w} y2={y + i * 55} stroke={level.stroke} strokeWidth="1.5" opacity="0.55" />)}
                <text x={x + w / 2} y={y - 14} textAnchor="middle" fill={level.stroke} fontFamily={fonts.sans} fontSize="23">目标 {level.name}</text>
              </g>;
            })}
            <g opacity={pair}>
              <text x="737" y="403" textAnchor="middle" fill={c.focus} fontFamily={fonts.mono} fontSize="32" fontWeight="700">x</text>
              <text x="852" y="403" textAnchor="middle" fill={c.result} fontFamily={fonts.mono} fontSize="32" fontWeight="700">y</text>
              <text x="795" y="575" textAnchor="middle" fill={c.muted} fontFamily={fonts.sans} fontSize="30">⋮</text>
              <path d="M 680 440 H 565" stroke={c.muted} strokeWidth="2" />
              <text x="550" y="436" textAnchor="end" fill={c.ink} fontFamily={fonts.sans} fontSize="27">57 个来源位置</text>
              <text x="550" y="471" textAnchor="end" fill={c.muted} fontFamily={fonts.sans} fontSize="21">行数压缩示意</text>
              <path d="M 1120 350 H 1280" stroke={c.muted} strokeWidth="2" />
              <text x="1295" y="345" fill={c.ink} fontFamily={fonts.sans} fontSize="27">4 个目标尺度</text>
              <text x="1295" y="380" fill={c.muted} fontFamily={fonts.sans} fontSize="21">每层是一组映射坐标</text>
              <text x="1295" y="480" fill={c.ink} fontFamily={fonts.sans} fontSize="27">每个位置一对 (x, y)</text>
              <text x="1295" y="515" fill={c.muted} fontFamily={fonts.sans} fontSize="21">最后一维长度为 2</text>
            </g>
          </g>
        </svg>
        <div style={{position: 'absolute', top: 690, left: 160, right: 160, textAlign: 'center', opacity: joined * (1 - expanded)}}>
          <div style={{fontSize: 30}}>按位置拼接：36 + 16 + 4 + 1 = <strong>57</strong>（色块长度为示意）</div>
          <div style={{fontFamily: fonts.mono, fontSize: 48, fontWeight: 700, marginTop: 18}}>[1, 57, 2]</div>
          <div style={{fontSize: 26, color: c.muted, marginTop: 16}}>批次 · 所有来源位置 · (x, y) 坐标</div>
        </div>
        <div style={{position: 'absolute', top: 775, left: 160, right: 160, textAlign: 'center', opacity: pair}}>
          <div style={{fontSize: 30}}>每个来源位置映射到四个目标尺度</div>
          <div style={{fontFamily: fonts.mono, fontSize: 48, fontWeight: 700, marginTop: 15}}>[1, 57, 4, 2]</div>
          <div style={{fontSize: 26, color: c.muted, marginTop: 12}}>批次 · 所有来源位置 · 目标尺度 · (x, y) 坐标</div>
        </div>
        <div style={{position: 'absolute', left: 96, right: 96, bottom: 48, display: 'flex', justifyContent: 'space-between', fontSize: 22, color: c.muted}}>
          <span>F3 6×6 · F4 4×4 · F5 2×2 · F6 1×1，尺寸均为示意</span><span>四层切片为示意图，行数经过压缩</span>
        </div>
      </div>
    </ScientificCanvas>
  );
};
