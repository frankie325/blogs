import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CodeBlock, Description, FeatureGrid, Heading, Panel, SceneShell, fadeIn, palette} from '../visuals';

export const Padding = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneShell chapter="05" title="边界情况：padding 位置不会被裁剪" subtitle="函数会为所有网格生成参考点；padding 对应的位置也会出现在输出中。">
      <Panel style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        <Heading color={palette.red}>来源层的 padding 网格</Heading>
        <FeatureGrid size={6} valid={5} cell={72} reference={{x: 5.5 / 6, y: 0.5 / 6, color: palette.red}} />
        <Description style={{fontSize: 25, textAlign: 'center'}}>第 0 行、第 5 列；中心是 (5.5, 0.5)</Description>
      </Panel>
      <Panel style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 22}}>
        <Heading>归一化结果可以大于 1</Heading>
        <CodeBlock lines={[
          'x = 5.5 / 5 = 1.1',
          'y = 0.5 / 5 = 0.1',
          'target_1 = (1.1, 0.1) * (1, 1)',
        ]} active={2} />
        <div style={{display: 'flex', alignItems: 'center', gap: 20, opacity: fadeIn(frame, 1.5 * fps)}}>
          <FeatureGrid size={3} valid={3} cell={70} reference={{x: 1.1, y: 0.1, color: palette.red}} />
          <div style={{fontSize: 30, lineHeight: 1.5}}>
            目标层 1<br /><strong style={{color: palette.red}}>x = 1.1 &gt; 1</strong><br />
            <span style={{fontSize: 24, color: palette.muted}}>点位落在完整特征图外</span>
          </div>
        </div>
        <Description style={{fontSize: 24}}>此函数不裁剪参考坐标；后续注意力会将 padding 位置的 Value 置零。</Description>
      </Panel>
    </SceneShell>
  );
};
