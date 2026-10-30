import {Series, useVideoConfig} from 'remotion';
import {Overview} from './scenes/Overview';
import {GridCenters} from './scenes/GridCenters';
import {Normalize} from './scenes/Normalize';
import {Broadcast} from './scenes/Broadcast';
import {Summary} from './scenes/Summary';

export const ReferencePoints = () => {
  const {fps} = useVideoConfig();
  return (
    <Series>
      <Series.Sequence name="输入：尺寸与图像比例" durationInFrames={150} premountFor={fps}><Overview /></Series.Sequence>
      <Series.Sequence name="网格中心" durationInFrames={240} premountFor={fps}><GridCenters /></Series.Sequence>
      <Series.Sequence name="图像区域归一化" durationInFrames={240} premountFor={fps}><Normalize /></Series.Sequence>
      <Series.Sequence name="拼接与跨尺度映射" durationInFrames={600} premountFor={fps}><Broadcast /></Series.Sequence>
      <Series.Sequence name="输出形状" durationInFrames={420} premountFor={fps}><Summary /></Series.Sequence>
    </Series>
  );
};
