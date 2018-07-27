// @flow

import React, { Component } from 'react'
import { openURL } from 'helpers/linking'
import styled from 'styled-components'
import { i } from 'helpers/staticPath'
import { urls } from 'config/urls'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import ConfettiParty from 'components/ConfettiParty'
import LedgerLiveLogo from 'components/base/LedgerLiveLogo'
import TrackPage from 'analytics/TrackPage'

import IconCheckFull from 'icons/CheckFull'
import IconSocialTwitter from 'icons/Twitter'
import IconSocialReddit from 'icons/Reddit'
import IconSocialGithub from 'icons/Github'

import { lighten } from 'styles/helpers'

import type { StepProps } from '..'
import { Title, Description } from '../helperComponents'

const ConfettiLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
`

const socialMedia = [
  // FIXME it should just be vdom in place
  {
    key: 'twitter',
    url: urls.twitter,
    icon: <IconSocialTwitter size={24} />,
    onClick: url => openURL(url),
  },
  {
    key: 'github',
    url: urls.github,
    icon: <IconSocialGithub size={24} />,
    onClick: url => openURL(url),
  },
  {
    key: 'reddit',
    url: urls.reddit,
    icon: <IconSocialReddit size={24} />,
    onClick: url => openURL(url),
  },
]

export default class Finish extends Component<StepProps, *> {
  state = { emit: false }
  onMouseUp = () => this.setState({ emit: false })
  onMouseDown = () => {
    this.setState({ emit: true })
  }
  onMouseLeave = () => {
    this.setState({ emit: false })
  }
  render() {
    const { finish, t, onboarding } = this.props
    const { emit } = this.state
    return (
      <Box sticky justifyContent="center">
        <TrackPage
          category="Onboarding"
          name="Finish"
          flowType={onboarding.flowType}
          deviceType={onboarding.isLedgerNano ? 'Nano S' : 'Blue'}
        />
        <ConfettiLayer>
          <ConfettiParty emit={emit} />
        </ConfettiLayer>
        <Box alignItems="center">
          <Box
            style={{ position: 'relative' }}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onMouseLeave={this.onMouseLeave}
          >
            <LedgerLiveLogo
              width="64px"
              height="64px"
              icon={
                <img
                  src={i('ledgerlive-logo.svg')}
                  alt=""
                  draggable="false"
                  width={40}
                  height={40}
                />
              }
            />
            <Box color="positiveGreen" style={{ position: 'absolute', right: 0, bottom: 0 }}>
              <IconCheckFull size={18} />
            </Box>
          </Box>

          <Box pt={5} align="center">
            <Title>{t('onboarding:finish.title')}</Title>
            <Description>{t('onboarding:finish.desc')}</Description>
          </Box>
          <Box p={5}>
            <Button primary onClick={() => finish()}>
              {t('onboarding:finish.openAppButton')}
            </Button>
          </Box>
          <Box horizontal mt={3} flow={5} color="grey">
            {socialMedia.map(socMed => <SocialMediaBox key={socMed.key} socMed={socMed} />)}
          </Box>
        </Box>
      </Box>
    )
  }
}

type SocMed = {
  icon: any,
  url: string,
  onClick: string => void,
}

const StyledBox = styled(Box)`
  cursor: default; // this here needs reset because it inherits from cursor: text from parent
  &:hover {
    color: ${p => lighten(p.theme.colors.grey, 0.1)};
  }
`

export function SocialMediaBox({ socMed }: { socMed: SocMed }) {
  const { icon, url, onClick } = socMed
  return (
    <StyledBox horizontal onClick={() => onClick(url)}>
      {icon}
    </StyledBox>
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
