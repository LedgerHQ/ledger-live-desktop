// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'

import WarnBox from 'components/WarnBox'

const stories = storiesOf('Components', module)

stories.add('WarnBox', () => (
  <WarnBox>
    {text(
      'children',
      'Nulla ornare ligula nec velit fermentum accumsan. Mauris sagittis iaculis pretium. Maecenas tincidunt tortor ullamcorper neque scelerisque lacinia sit amet sit amet elit. Quisque vulputate at tellus ut fringilla. Sed varius neque accumsan nunc consequat semper. In interdum euismod velit, sed pulvinar justo finibus ac. Nullam euismod felis non pellentesque fermentum. Nullam sed libero eu ligula porta accumsan eget et neque. Sed varius lobortis vestibulum. Morbi efficitur leo at augue venenatis, vitae faucibus ante lobortis. Nunc tincidunt, sem eget ultricies convallis, dolor est gravida sem, non vestibulum urna lorem a justo. Quisque ultrices feugiat arcu, sit amet tristique tellus maximus in. Phasellus ultricies mattis erat vitae laoreet. Fusce ac dignissim dui. Etiam semper purus nisi, eu semper tortor mollis nec.',
    )}
  </WarnBox>
))
