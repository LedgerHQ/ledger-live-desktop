// @flow

import React from 'react'
import styled from 'styled-components'

import { MODAL_OPERATION_DETAILS } from 'constants'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Bar from 'components/base/Bar'
import Modal, { ModalBody, ModalTitle, ModalFooter, ModalContent } from 'components/base/Modal'

const ColLeft = styled(Box)`
  width: 95px;
`

const OperationDetails = () => (
  <Modal
    name={MODAL_OPERATION_DETAILS}
    render={({ data, onClose }) => {
      const { operation, account } = data

      return (
        <ModalBody onClose={onClose}>
          <ModalTitle>Operation details</ModalTitle>
          <ModalContent flow={4}>
            <Box>
              <Box>{operation.amount}</Box>
            </Box>
            <Box>
              <ColLeft>Acccount</ColLeft>
              <Box>{account.name}</Box>
            </Box>
            <Bar />
            <Box>
              <ColLeft>Date</ColLeft>
              <Box>{operation.receivedAt}</Box>
            </Box>
            <Bar />
            <Box>
              <ColLeft>Status</ColLeft>
              <Box>{operation.confirmations}</Box>
            </Box>
            <Bar />
            <Box>
              <ColLeft>From</ColLeft>
              <Box>{operation.from.join(',')}</Box>
            </Box>
            <Box>
              <ColLeft>To</ColLeft>
              <Box>{operation.to.join(',')}</Box>
            </Box>
            <Box>
              <ColLeft>Identifier</ColLeft>
              <Box>{operation.id}</Box>
            </Box>
          </ModalContent>
          <ModalFooter horizontal justify="flex-end" flow={2}>
            <Button>Cancel</Button>
            <Button primary>View operation</Button>
          </ModalFooter>
        </ModalBody>
      )
    }}
  />
)

export default OperationDetails
