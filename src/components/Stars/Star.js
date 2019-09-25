// @flow

import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { toggleStarAction } from '../../actions/settings'
import { isStarredAccountSelector } from '../../reducers/accounts'
import { i } from '../../helpers/staticPath'
import { rgba } from '../../styles/helpers'

const ButtonWrapper = styled.div`
  height: 34px;
  width: 34px;
  border: 1px solid
    ${p => (p.filled ? p.theme.colors.starYellow : p.theme.colors.palette.text.shade60)};
  border-radius: 4px;
  padding: 8px;
  text-align: center;
  background: ${p => (p.filled ? p.theme.colors.starYellow : 'transparent')};
  &:hover {
    background: ${p =>
      p.filled ? p.theme.colors.starYellow : rgba(p.theme.colors.palette.divider, 0.2)};
    border-color: ${p =>
      p.filled ? p.theme.colors.starYellow : p.theme.colors.palette.text.shade100};
  }
`
const FloatingWrapper = styled.div``

// NB negative margin to allow the burst to overflow
const StarWrapper = styled.div`
  margin: -17px;
`

const StarIcon = styled.div`
  & {
    height: 50px;
    width: 50px;
    background-image: url("${p => i(p.yellow ? 'starAnim2.png' : 'starAnim.png')}");
    background-position: ${p => (p.filled ? 'right' : 'left')};
    background-repeat: no-repeat;
    background-size: 3000%;
  }

  &:hover {
    ${p => (!p.filled ? `background-position: -50px;` : '')}
  }

  @keyframes star-burst {
    from {
      background-position: left;
    }
    to {
      background-position: right;
    }
  }

  ${p =>
    p.showAnimation &&
    `
    background-position:right;
    animation: star-burst .8s steps(29) 1;
 `}
`

const mapStateToProps = createStructuredSelector({
  isAccountStared: isStarredAccountSelector,
})

const mapDispatchToProps = {
  toggleStarAction,
}

type Props = {
  accountId: string,
  isAccountStared: boolean,
  toggleStarAction: Function,
  yellow: boolean,
}

const Star = ({ accountId, isAccountStared, toggleStarAction, yellow }: Props) => {
  const [showAnimation, setShowAnimation] = useState(false)
  const toggleStar = useCallback(
    e => {
      e.stopPropagation()
      setShowAnimation(!isAccountStared)
      toggleStarAction(accountId)
    },
    [accountId, toggleStarAction, isAccountStared],
  )
  const MaybeButtonWrapper = yellow ? ButtonWrapper : FloatingWrapper

  return (
    <MaybeButtonWrapper filled={isAccountStared}>
      <StarWrapper onClick={toggleStar}>
        <StarIcon yellow={yellow} filled={isAccountStared} showAnimation={showAnimation} />
      </StarWrapper>
    </MaybeButtonWrapper>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Star)
