// @flow

import React from 'react'
import styled, { keyframes } from 'styled-components'

import { rgba } from 'styles/helpers'

import Box from 'components/base/Box'

import IconCheck from 'icons/Check'
import IconCross from 'icons/Cross'

const pulseAnimation = p => keyframes`
  0% {
    box-shadow: 0 0 0 1px ${rgba(p.theme.colors.wallet, 0.4)};
  }
  70% {
    box-shadow: 0 0 0 6px ${rgba(p.theme.colors.wallet, 0)};
  }
  100% {
    box-shadow: 0 0 0 0 ${rgba(p.theme.colors.wallet, 0)};
  }
`

const Wrapper = styled(Box).attrs({
  color: p => (p.notValid ? 'alertRed' : 'wallet'),
  relative: true,
})`
  padding-top: ${p => (p.notValid ? 0 : 30)}px;
  transition: all ease-in-out 0.1s;
`

const WrapperIcon = styled(Box)`
  color: ${p => (p.notValid ? p.theme.colors.alertRed : p.theme.colors.positiveGreen)};
  position: absolute;
  left: 193px;
  bottom: 16px;

  svg {
    transition: all ease-in-out 0.1s;
  }
`

const Check = ({ notValid }: { notValid: boolean }) => (
  <WrapperIcon notValid={notValid}>
    {notValid ? <IconCross size={11} /> : <IconCheck size={11} />}
  </WrapperIcon>
)

const PushButton = styled(Box)`
  background: linear-gradient(to bottom, #ffffff, ${p => p.theme.colors.wallet});
  bottom: 53px;
  height: 28px;
  left: 205px;
  position: absolute;
  width: 1px;

  &:before {
    animation: ${p => pulseAnimation(p)} 1s linear infinite;
    background-color: ${p => p.theme.colors.wallet};
    border-radius: 50%;
    bottom: 0;
    box-sizing: border-box;
    content: ' ';
    display: block;
    height: 9px;
    left: 50%;
    margin-bottom: -4px;
    margin-left: -4px;
    position: absolute;
    width: 9px;
    z-index: 1;
  }
`

type Props = {
  notValid: boolean,
}

const DeviceConfirm = (props: Props) => (
  <Wrapper {...props}>
    {!props.notValid && <PushButton />}
    <Check notValid={props.notValid} />
    <svg width="365" height="44">
      <defs>
        <rect id="a" width="41.7112299" height="238.383838" rx="4.00000006" />
        <rect
          id="b"
          width="21.1764706"
          height="62.0185596"
          x="10.2673797"
          y="20.6728532"
          rx="1.60000002"
        />
        <path
          id="c"
          d="M20.855615 94.9659194c11.5182381 0 20.8556149 9.3373766 20.8556149 20.8556146v118.562304c0 2.209139-1.790861 4-4 4H4.00000006c-2.20913903 0-4.00000006-1.790861-4.00000006-4V115.821534c0-11.518238 9.33737688-20.8556146 20.855615-20.8556146z"
        />
        <linearGradient id="d" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" />
          <stop offset="100%" stopColor="#FFF" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g transform="rotate(-90 85.0909095 -41.5252525)">
          <rect
            width="4.49197861"
            height="17.1197066"
            x="38.3363042"
            y="15.5046399"
            fill="#142533"
            rx="2"
          />
          <rect
            width="4.49197861"
            height="17.1197066"
            x="38.3363042"
            y="70.0938929"
            fill="#142533"
            rx="2"
          />
          <use fill="#FFF" xlinkHref="#a" />
          <use fill="currentColor" fillOpacity=".14999999" xlinkHref="#a" />
          <rect
            width="39.7112299"
            height="236.383838"
            x="1"
            y="1"
            stroke="#142533"
            strokeWidth="2"
            rx="4.00000006"
          />
          <use fill="#FFF" xlinkHref="#b" />
          <rect
            width="20.1764706"
            height="61.0185596"
            x="10.7673797"
            y="21.1728532"
            stroke="currentColor"
            rx="1.60000002"
          />
          <use fill="#FFF" xlinkHref="#c" />
          <path
            stroke="#142533"
            strokeWidth="2"
            d="M20.855615 95.9659194C9.88966163 95.9659194 1 104.855581 1 115.821534v118.562304c0 1.656855 1.34314578 3 3.00000006 3H37.7112299c1.6568543 0 3-1.343145 3-3V115.821534c0-10.965953-8.8896616-19.8556146-19.8556149-19.8556146z"
          />
          <ellipse
            cx="21.0160428"
            cy="116.123293"
            stroke="#142533"
            rx="10.5695187"
            ry="10.6439599"
          />
        </g>
        <path
          stroke="#1D2027"
          strokeWidth="2"
          d="M126.9617746 31.060606c0 .55228475-.4477153 1-1 1H99.7373741c-2.7614237 0-5-2.23857625-5-5v-8.4856683c0-2.7614238 2.2385763-5 5-5h26.2244005c.5522847 0 1 .4477152 1 1V31.060606z"
        />
        <path
          stroke="#142533"
          strokeWidth="2"
          d="M94.3535357 25.85229841H83.4242428V19.4170232h10.9292929v6.43527521z"
        />
        <path
          fill="url(#d)"
          d="M6.83618598 57.9245106h1.61616161v82.6510534H6.83618598V57.9245106zm5.65656562 0h1.6161617v82.6510534h-1.6161617V57.9245106z"
          transform="matrix(0 -1 -1 0 140.606061 33.060606)"
        />
      </g>
    </svg>
  </Wrapper>
)

DeviceConfirm.defaultProps = {
  notValid: false,
}

export default DeviceConfirm
