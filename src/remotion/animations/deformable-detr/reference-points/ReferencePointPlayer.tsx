import {Player} from '@remotion/player'
import {ReferencePoints} from './ReferencePoints'
import {referencePointsConfig} from './config'

export default function ReferencePointPlayer() {
  return (
    <Player
      component={ReferencePoints}
      durationInFrames={referencePointsConfig.durationInFrames}
      compositionWidth={referencePointsConfig.width}
      compositionHeight={referencePointsConfig.height}
      fps={referencePointsConfig.fps}
      controls
      showVolumeControls={false}
      style={{width: '100%', aspectRatio: '16 / 9', borderRadius: 12, overflow: 'hidden'}}
    />
  )
}
