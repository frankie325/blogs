import {Composition, Folder} from 'remotion';
import {ReferencePoints} from './animations/deformable-detr/reference-points/ReferencePoints';
import {TorchStack} from './animations/pytorch/torch-stack/TorchStack';
import {torchStackConfig} from './animations/pytorch/torch-stack/config';
import {referencePointsConfig} from './animations/deformable-detr/reference-points/config';
import {Overview} from './animations/deformable-detr/reference-points/scenes/Overview';
import {GridCenters} from './animations/deformable-detr/reference-points/scenes/GridCenters';
import {Normalize} from './animations/deformable-detr/reference-points/scenes/Normalize';
import {Broadcast} from './animations/deformable-detr/reference-points/scenes/Broadcast';
import {Summary} from './animations/deformable-detr/reference-points/scenes/Summary';
import {ReferencePointStyle} from './animations/deformable-detr/reference-points/ReferencePointStyle';
import {ScientificStylePreview} from './styles/scientific/ScientificStylePreview';

export const MyComposition = () => (
  <>
    <Composition id="TorchStack" component={TorchStack} {...torchStackConfig} />
    <Composition id="ScientificStylePreview" component={ScientificStylePreview} width={1280} height={720} fps={30} durationInFrames={150} />
    <Composition id="ReferencePointStyle" component={ReferencePointStyle} width={1280} height={720} fps={30} durationInFrames={420} />
    <Composition id="EncoderReferencePoints" component={ReferencePoints} {...referencePointsConfig} />
    <Folder name="Scenes">
      <Composition id="Overview" component={Overview} width={1920} height={1080} fps={30} durationInFrames={150} />
      <Composition id="GridCenters" component={GridCenters} width={1920} height={1080} fps={30} durationInFrames={240} />
      <Composition id="Normalize" component={Normalize} width={1920} height={1080} fps={30} durationInFrames={240} />
      <Composition id="Broadcast" component={Broadcast} width={1920} height={1080} fps={30} durationInFrames={600} />
      <Composition id="Summary" component={Summary} width={1920} height={1080} fps={30} durationInFrames={420} />
    </Folder>
  </>
);
