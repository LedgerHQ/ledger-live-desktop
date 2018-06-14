// @flow

import React from 'react'
import { shell } from 'electron'
import styled from 'styled-components'

import Box from 'components/base/Box'
import Button from 'components/base/Button'

import IconCheckCircle from 'icons/CheckCircle'
import IconSocialTwitter from 'icons/Twitter'
import IconSocialReddit from 'icons/Reddit'
import IconSocialGithub from 'icons/Github'

import type { StepProps } from '..'
import { Title, Description } from '../helperComponents'

const socialMedia = [
  {
    key: 'twitter',
    url: 'https://twitter.com/LedgerHQ',
    icon: <IconSocialTwitter size={24} />,
    onClick: url => shell.openExternal(url),
  },
  {
    key: 'github',
    url: 'https://github.com/LedgerHQ',
    icon: <IconSocialGithub size={24} />,
    onClick: url => shell.openExternal(url),
  },
  {
    key: 'reddit',
    url: 'https://www.reddit.com/r/ledgerwallet/',
    icon: <IconSocialReddit size={24} />,
    onClick: url => shell.openExternal(url),
  },
]

export default (props: StepProps) => {
  const { finish, t } = props
  return (
    <Box sticky justifyContent="center">
      <Box alignItems="center">
        <Box color="positiveGreen">
          <IconCheckCircle size={44} />
        </Box>
        <Box pt={5} align="center" mb={5}>
          <Title>{t('onboarding:finish.title')}</Title>
          <Description>{t('onboarding:finish.desc')}</Description>
        </Box>
        <Button primary padded onClick={() => finish()}>
          {t('onboarding:finish.openAppButton')}
        </Button>
        <Box alignItems="center" mt={7}>
          <FollowUsDesc>{t('onboarding:finish.followUsLabel')}</FollowUsDesc>
        </Box>
        <Box horizontal mt={3} flow={5} color="grey">
          {socialMedia.map(socMed => <SocialMediaBox key={socMed.key} socMed={socMed} />)}
        </Box>
      </Box>
    </Box>
  )
}

type SocMed = {
  icon: any,
  url: string,
  onClick: string => void,
}

export function SocialMediaBox({ socMed }: { socMed: SocMed }) {
  const { icon, url, onClick } = socMed
  return (
    <Box
      horizontal
      style={{
        cursor: 'pointer',
      }}
      onClick={() => onClick(url)}
    >
      {icon}
    </Box>
  )
}

export const FollowUsDesc = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 4,
  textAlign: 'center',
  color: 'grey',
})`
  margin: 10px auto;
`
