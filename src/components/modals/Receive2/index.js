import React from 'react'
import Modal from 'components/base/Modal'
import { MODAL_RECEIVE } from 'config/constants'
import { useMachine } from '@xstate/react';
import { machine, components } from './receiveFlow'

const Receive = () => {
  const [current, send] = useMachine(machine);

  const CurrentStep = components[current.value]

  console.log(current)

  return (
    <Modal
      name={MODAL_RECEIVE}
      centered
      render={() => (
        <CurrentStep
          send={send}
          context={current.context}
        />
      )}
    />
  )
}

export default Receive