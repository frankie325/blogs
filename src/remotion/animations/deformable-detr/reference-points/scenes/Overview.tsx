import {scientificStyle as theme, ScientificCanvas, ScientificLabel, useScientificReveal} from '../../../../styles/scientific';

const {colors: c, fonts} = theme;

/** 方格位置是示意值，绿色代表对应原图的有效位置。 */
const FeatureMap = ({name, size, valid, reveal, highlight}: {name: string; size: number; valid: number; reveal: number; highlight: number}) => {
  const cell = 62;
  const extent = size * cell;
  return (
    <div style={{flex: 1, background: c.surface, border: `2px solid ${c.line}`, padding: '26px 38px', boxSizing: 'border-box'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <span style={{fontFamily: fonts.serif, fontSize: 42, fontWeight: 700}}>{name}</span>
        <span style={{fontFamily: fonts.mono, fontSize: 26, color: c.muted}}>特征图 {size} × {size}</span>
      </div>
      <div style={{height: 410, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <svg width={extent} height={extent} viewBox={`0 0 ${extent} ${extent}`} style={{overflow: 'visible'}} aria-label={`${name} 特征图 ${size} 乘 ${size}，图像区域 ${valid} 乘 ${valid}，其余为 padding`}>
          <g opacity={reveal}>
            {Array.from({length: size * size}, (_, i) => {
              const row = Math.floor(i / size);
              const col = i % size;
              const padded = row >= valid || col >= valid;
              return <rect key={i} x={col * cell} y={row * cell} width={cell} height={cell} fill={padded ? '#e6e7de' : c.focusSoft} stroke={c.line} strokeWidth={2} />;
            })}
          </g>
          <rect x={2} y={2} width={valid * cell - 4} height={valid * cell - 4} fill="none" stroke={c.focus} strokeWidth={4} opacity={highlight} />
          <g opacity={highlight}>
            <circle cx={extent - cell / 2} cy={cell / 2} r={5} fill={c.muted} />
            <path d={`M ${extent - cell / 2} ${cell / 2} H ${extent + 20}`} fill="none" stroke={c.muted} strokeWidth={2} />
            <text x={extent + 28} y={cell / 2 + 8} fill={c.muted} fontFamily={fonts.sans} fontSize={25}>padding</text>
          </g>
        </svg>
      </div>
      <div style={{borderTop: `1px solid ${c.line}`, paddingTop: 18, opacity: highlight}}>
        <div style={{fontSize: 30, fontWeight: 700, color: c.focus}}>图像区域 {valid} × {valid}</div>
        <div style={{fontSize: 25, color: c.muted, marginTop: 8}}>图像比例 (宽, 高) = ({valid}/{size}, {valid}/{size})</div>
      </div>
    </div>
  );
};

export const Overview = () => {
  const gridReveal = useScientificReveal(0.3, 0.7);
  const highlight = useScientificReveal(1.2, 0.6);
  const explanation = useScientificReveal(2.0, 0.6);

  return (
    <ScientificCanvas>
      <div style={{position: 'absolute', left: 96, right: 96, top: 56, display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${c.ink}`, paddingBottom: 20}}>
        <ScientificLabel style={{fontSize: 24}}>FIELD NOTES / DEFORMABLE DETR</ScientificLabel>
        <ScientificLabel color={c.muted} style={{fontSize: 24}}>ENCODER · 01 / 05</ScientificLabel>
      </div>
      <div style={{position: 'absolute', left: 96, top: 135, fontFamily: fonts.serif, fontSize: 62, fontWeight: 700}}>输入特征图</div>
      <div style={{position: 'absolute', left: 98, top: 230, color: c.muted, fontSize: 29}}>输入通常有 4 个尺度；这里用 F3、F4 两层示意。</div>
      <div style={{position: 'absolute', left: 96, right: 96, top: 310, height: 620, display: 'flex', gap: 30}}>
        <FeatureMap name="F3" size={6} valid={5} reveal={gridReveal} highlight={highlight} />
        <FeatureMap name="F4" size={4} valid={3} reveal={gridReveal} highlight={highlight} />
      </div>
      <div style={{position: 'absolute', left: 100, right: 100, top: 960, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: explanation, fontSize: 26, color: c.ink}}>
        <span><span style={{color: c.focus, fontWeight: 700}}>绿色：图像区域</span> · 与原图对应的特征位置</span>
        <span style={{color: c.muted}}>灰色：padding · 补齐尺寸的区域</span>
      </div>
      <div style={{position: 'absolute', left: 100, right: 100, bottom: 32, display: 'flex', justifyContent: 'space-between', fontFamily: fonts.mono, fontSize: 20, color: c.muted}}>
        <span>get_reference_points · 尺寸与图像区域均为示意</span><span>valid_ratios 按 (宽, 高) 排列</span>
      </div>
    </ScientificCanvas>
  );
};
