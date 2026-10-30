import {Player} from '@remotion/player'
import {TorchStack} from './TorchStack'
import {torchStackConfig} from './config'

export default function TorchStackPlayer() {
  return (
    <Player
      component={TorchStack}
      durationInFrames={torchStackConfig.durationInFrames}
      compositionWidth={torchStackConfig.width}
      compositionHeight={torchStackConfig.height}
      fps={torchStackConfig.fps}
      controls
      showVolumeControls={false}
      style={{width: '100%', aspectRatio: '16 / 9', borderRadius: 12, overflow: 'hidden'}}
    />
  )
}
