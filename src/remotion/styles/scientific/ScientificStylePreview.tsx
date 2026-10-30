import {scientificStyle as theme, ScientificCanvas, ScientificLabel, useScientificReveal} from './index';

/** Field Notes 视觉样张：图形和数值均为示意。 */
export const ScientificStylePreview = () => {
  const diagram = useScientificReveal(0.3);
  const focus = useScientificReveal(1.2);
  const result = useScientificReveal(2.3);
  const c = theme.colors;
  return (
    <ScientificCanvas>
      <div style={{position: 'absolute', left: 68, right: 68, top: 42, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${c.ink}`, paddingBottom: 16}}>
        <ScientificLabel color={c.ink}>FIELD NOTES <span style={{color: c.focus}}> / </span> SCIENCE IN MOTION</ScientificLabel>
        <ScientificLabel color={c.muted}>FIG. 01　·　概念示意</ScientificLabel>
      </div>
      <div style={{position: 'absolute', left: 68, top: 108, width: 520}}>
        <ScientificLabel>01 / THE QUESTION</ScientificLabel>
        <div style={{fontFamily: theme.fonts.serif, fontSize: 48, fontWeight: 700, lineHeight: 1.3, marginTop: 20}}>如何从整体中<br />发现<span style={{color: c.focus}}>关键位置</span>？</div>
        <div style={{fontSize: 23, color: c.muted, lineHeight: 1.6, marginTop: 20}}>从观察区域出发，逐步缩小范围，<br />再解释局部与整体的关系。</div>
      </div>
      <div style={{position: 'absolute', left: 68, bottom: 92, width: 430, opacity: result, borderTop: `1px solid ${c.ink}`, paddingTop: 19}}>
        <ScientificLabel color={c.result}>OBSERVATION / 观察</ScientificLabel>
        <div style={{fontFamily: theme.fonts.serif, fontSize: 29, lineHeight: 1.4, marginTop: 12}}>让每一个强调都有理由。</div>
        <div style={{fontSize: 20, color: c.muted, marginTop: 10}}>图形、标注与运动一起说明关系。</div>
      </div>
      <svg viewBox="0 0 1280 720" width="1280" height="720" style={{position: 'absolute', inset: 0}} aria-label="在观察网格中选择一个位置，并放大展示的示意图">
        <g opacity={diagram}>
          <rect x="650" y="147" width="524" height="463" rx="3" fill={c.surface} stroke={c.line} strokeWidth="2" />
          <text x="680" y="185" fill={c.muted} fontSize="18" fontFamily={theme.fonts.mono}>A / OBSERVATION FIELD</text>
          {Array.from({length: 36}, (_, i) => <rect key={i} x={694 + (i % 6) * 52} y={222 + Math.floor(i / 6) * 52} width="52" height="52" fill="none" stroke={c.line} strokeWidth="1.5" />)}
          <text x="694" y="572" fill={c.muted} fontSize="20" fontFamily={theme.fonts.sans}>观察区域 / 示意</text>
        </g>
        <g opacity={focus}>
          <rect x="798" y="326" width="52" height="52" fill={c.focusSoft} stroke={c.focus} strokeWidth="3" />
          <circle cx="824" cy="352" r="7" fill={c.focus} />
          <path d="M 854 352 L 1045 264" fill="none" stroke={c.focus} strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="1086" cy="245" r="58" fill={c.focusSoft} stroke={c.focus} strokeWidth="2" />
          <path d="M 1056 245 H 1116 M 1086 215 V 275" stroke={c.focus} strokeWidth="1.5" />
          <circle cx="1086" cy="245" r="8" fill={c.focus} />
          <text x="1034" y="333" fill={c.focus} fontSize="19" fontFamily={theme.fonts.sans}>局部放大</text>
        </g>
        <g opacity={result}>
          <path d="M 854 352 L 1020 449" fill="none" stroke={c.result} strokeWidth="2" />
          <circle cx="1020" cy="449" r="4" fill={c.result} />
          <text x="1032" y="455" fill={c.result} fontSize="21" fontFamily={theme.fonts.sans}>关注位置</text>
        </g>
      </svg>
      <div style={{position: 'absolute', left: 68, right: 68, bottom: 37, display: 'flex', justifyContent: 'space-between', color: c.muted, fontSize: 17, fontFamily: theme.fonts.mono}}><span>OBSERVE → FOCUS → EXPLAIN</span><span>FIELD NOTES / 01</span></div>
    </ScientificCanvas>
  );
};
