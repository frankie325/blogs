import {Easing, Freeze, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {scientificStyle as theme, ScientificCanvas, ScientificLabel} from '../../../../styles/scientific';
import {GridCenters} from './GridCenters';

const {colors: c, fonts} = theme;
const easing = Easing.bezier(0.22, 1, 0.36, 1);
const options = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing};

export const Normalize = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = (start: number, end: number) => interpolate(frame, [start * fps, end * fps], [0, 1], options);
  const transition = progress(0, 0.5);
  const inside = progress(0.7, 1.3);
  const padding = progress(2.1, 2.7);
  const cell = 62;
  const gridX = 774;
  const gridY = 405;

  return (
    <ScientificCanvas>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - transition}}><Freeze frame={8 * fps - 1}><GridCenters /></Freeze></div>
      <div style={{opacity: transition}}>
        <div style={{position: 'absolute', left: 96, right: 96, top: 56, display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${c.ink}`, paddingBottom: 20}}>
          <ScientificLabel style={{fontSize: 24}}>FIELD NOTES / DEFORMABLE DETR</ScientificLabel>
          <ScientificLabel color={c.muted} style={{fontSize: 24}}>ENCODER · 03 / 05</ScientificLabel>
        </div>
        <div style={{position: 'absolute', left: 96, top: 135, fontFamily: fonts.serif, fontSize: 62, fontWeight: 700}}>参考点坐标转化为图像区域的相对坐标</div>
        <div style={{position: 'absolute', left: 98, top: 225, color: c.result, fontSize: 29, fontWeight: 700}}>作用：后面使用相对值将参考点映射到其它特征图</div>
        <div style={{position: 'absolute', left: 108, top: 370, width: 510, opacity: inside}}>
          <ScientificLabel style={{fontSize: 23}}>01 / 图像区域中的点</ScientificLabel>
          <div style={{fontFamily: fonts.mono, fontSize: 33, lineHeight: 1.65, marginTop: 22}}>(2.5, 1.5) ÷ (5, 5)<br /><strong style={{color: c.focus}}>= (0.5, 0.3)</strong></div>
          <div style={{fontSize: 27, color: c.muted, marginTop: 18}}>相对宽 = 5/6，相对高 = 5/6</div>
        </div>
        <div style={{position: 'absolute', left: 1260, top: 370, width: 540, opacity: padding}}>
          <ScientificLabel color={c.result} style={{fontSize: 23}}>02 / PADDING 中的点</ScientificLabel>
          <div style={{fontFamily: fonts.mono, fontSize: 33, lineHeight: 1.65, marginTop: 22}}>(5.5, 1.5) ÷ (5, 5)<br /><strong style={{color: c.result}}>= (1.1, 0.3)</strong></div>
        </div>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} aria-label="特征图参考点相对图像区域归一化">
          <g>
            {Array.from({length: 36}, (_, i) => <rect key={i} x={gridX + i % 6 * cell} y={gridY + Math.floor(i / 6) * cell} width={cell} height={cell} fill={i % 6 === 5 || Math.floor(i / 6) === 5 ? '#e6e7de' : c.focusSoft} stroke={c.line} strokeWidth={2} />)}
            <rect x={gridX + 2} y={gridY + 2} width={5 * cell - 4} height={5 * cell - 4} fill="none" stroke={c.focus} strokeWidth={4} />
            <text x={gridX} y={gridY - 25} fill={c.focus} fontFamily={fonts.sans} fontSize={27}>F3 · 图像区域 5 × 5</text>
          </g>
          {Array.from({length: 36}, (_, i) => {
            const col = i % 6;
            const row = Math.floor(i / 6);
            const x = gridX + (col + 0.5) * cell;
            const y = gridY + (row + 0.5) * cell;
            const isInside = i === 8;
            const isPadding = i === 11;
            const color = isInside && inside > 0 ? c.focus : isPadding && padding > 0 ? c.result : c.ink;
            return <circle key={i} cx={x} cy={y} r={isInside || isPadding ? 10 : 6} fill={color} />;
          })}
        </svg>
        <div style={{position: 'absolute', left: 96, right: 96, bottom: 48, display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: 22, color: c.muted}}>
          <span>示意：单张图像 · F3</span><span>padding 方向的坐标可以大于 1</span>
        </div>
      </div>
    </ScientificCanvas>
  );
};
