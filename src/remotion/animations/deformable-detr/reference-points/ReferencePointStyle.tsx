import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

const purple = '#9b79ff';
const orange = '#ff9d70';
const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** One source position: row 1, column 2 of a 6×6 map with a 5×5 valid region. */
export const ReferencePointStyle = () => {
  const frame = useCurrentFrame();
  const stage = frame < 120 ? 0 : frame < 250 ? 1 : 2;
  const x = 275;
  const y = 205;
  const cell = 61;
  const cx = x + 2.5 * cell;
  const cy = y + 1.5 * cell;
  const glow = fade(frame, 45, 60);
  const gridReveal = fade(frame, 12, 70);
  const showFormula = fade(frame, stage === 0 ? 30 : stage === 1 ? 125 : 255, stage === 0 ? 45 : stage === 1 ? 145 : 275);

  return (
    <AbsoluteFill style={{backgroundColor: '#080910', color: 'white', fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif', overflow: 'hidden'}}>
      <svg width="1280" height="720" style={{position: 'absolute', inset: 0}} aria-hidden="true">
        {Array.from({length: 27 * 15}, (_, i) => {
          const dx = i % 27;
          const dy = Math.floor(i / 27);
          const wave = 0.12 + 0.12 * Math.sin(frame / 55 - dx / 4 - dy / 5);
          return <circle key={i} cx={dx * 50 + 12} cy={dy * 50 + 12} r="1.3" fill="#a89aff" opacity={wave} />;
        })}
        <defs><radialGradient id="pointGlow"><stop stopColor={purple} stopOpacity=".48" /><stop offset="1" stopColor={purple} stopOpacity="0" /></radialGradient></defs>
        <circle cx={cx} cy={cy} r="104" fill="url(#pointGlow)" opacity={glow} />
        {Array.from({length: 36}, (_, i) => {
          const row = Math.floor(i / 6);
          const col = i % 6;
          const padded = row === 5 || col === 5;
          return <rect key={i} x={x + col * cell} y={y + row * cell} width={cell} height={cell} fill={padded ? '#22212d' : '#11101d'} stroke={padded ? '#51505f' : '#aba5c3'} strokeWidth="1.5" opacity={Math.min(1, gridReveal * 40 - i * 0.35) < 0 ? 0 : Math.min(1, gridReveal * 40 - i * 0.35)} />;
        })}
        <rect x={x} y={y} width={5 * cell} height={5 * cell} fill="none" stroke={purple} strokeWidth="3" opacity={fade(frame, 75, 100)} />
        <circle cx={cx} cy={cy} r="13" fill={purple} stroke="white" strokeWidth="3" opacity={glow} />
        <circle cx={cx} cy={cy} r={19 + 4 * Math.sin(frame / 12)} fill="none" stroke={purple} strokeWidth="2" opacity={glow * 0.8} />
        <line x1={cx + 24} y1={cy} x2="715" y2={cy} stroke={purple} strokeWidth="2" strokeDasharray="6 7" opacity={fade(frame, 95, 115) * .65} />
        <text x={x + 183} y={y + 395} fill="#a4a0b2" fontSize="19" textAnchor="middle">完整特征图 6 × 6</text>
        <text x={x + 152} y={y + 419} fill="#bbaaff" fontSize="19" textAnchor="middle" opacity={fade(frame, 75, 100)}>紫框：图像区域 5 × 5</text>
      </svg>
      <div style={{position: 'absolute', left: 64, top: 42, background: '#6630f8', border: '2px solid #f4f0ff', borderRadius: 24, padding: '7px 22px', fontSize: 23, fontWeight: 800}}>ENCODER · 参考点</div>
      <div style={{position: 'absolute', top: 51, right: 68, color: '#96909f', fontSize: 17, letterSpacing: 2}}>GET REFERENCE POINTS</div>
      <div style={{position: 'absolute', left: 90, top: 110, fontWeight: 900, fontSize: 45, lineHeight: 1.15}}>一个网格中心，如何变成<span style={{color: purple}}>参考点</span>？</div>
      <div style={{position: 'absolute', left: 90, top: 175, color: '#a3a0ae', fontSize: 19}}>示意输入：B = 1，来源层 6 × 6；右侧和底部有 padding</div>
      <div style={{position: 'absolute', left: 714, top: 223, width: 490, opacity: showFormula}}>
        <div style={{color: purple, fontWeight: 800, letterSpacing: 2, fontSize: 19}}>{stage === 0 ? '01 · MESHGRID' : stage === 1 ? '02 · NORMALIZE' : '03 · MAP TO LEVEL 0'}</div>
        <div style={{fontSize: 33, fontWeight: 850, marginTop: 19}}>{stage === 0 ? '选中一个网格中心' : stage === 1 ? '除以图像区域宽、高' : '映射到目标尺度 0'}</div>
        <div style={{fontFamily: 'Menlo, monospace', fontSize: 31, lineHeight: 1.65, marginTop: 24, whiteSpace: 'pre-line'}}>
          {stage === 0 ? '行 1，列 2\n(x, y) = (2.5, 1.5)' : stage === 1 ? '(2.5 / 5, 1.5 / 5)\n= (0.5, 0.3)' : '(0.5, 0.3) × (5/6, 5/6)\n≈ (0.4167, 0.25)'}
        </div>
        <div style={{marginTop: 22, fontSize: 22, lineHeight: 1.5, color: stage === 2 ? orange : '#aba6b7'}}>{stage === 0 ? '索引从 0 开始；坐标位于格子中心' : stage === 1 ? '得到相对图像区域的坐标' : '结果使用完整特征图的归一化坐标'}</div>
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, bottom: 28, textAlign: 'center', fontSize: 24, fontWeight: 700}}>{stage === 0 ? '每个网格位置先生成一个中心坐标' : stage === 1 ? '按来源层的图像区域宽、高分别归一化' : '再乘目标层图像比例，得到该尺度的参考点'}</div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, background: '#292632'}}><div style={{height: '100%', width: `${frame / 419 * 100}%`, background: purple}} /></div>
    </AbsoluteFill>
  );
};
