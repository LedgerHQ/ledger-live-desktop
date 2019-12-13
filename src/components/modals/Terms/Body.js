// @flow
import React, { useState, useCallback } from 'react'
import { Trans } from 'react-i18next'
import { useTerms, url, acceptTerms } from 'helpers/terms'
import { openURL } from 'helpers/linking'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import Spinner from 'components/base/Spinner'
import Text from 'components/base/Text'
import CheckBox from 'components/base/CheckBox'
import LinkWithExternalIcon from 'components/base/LinkWithExternalIcon'
import TranslatedError from 'components/TranslatedError'
import TrackPage from 'analytics/TrackPage'
import Markdown, { Terms } from 'components/base/Markdown'
import ModalBody from 'components/base/Modal/ModalBody'

type Props = {
  onClose: () => void,
}

const Body = ({ onClose }: Props) => {
  const [markdown, error] = useTerms()
  const [accepted, setAccepted] = useState(false)
  const onSwitchAccept = useCallback(() => setAccepted(!accepted), [accepted])
  const onClick = useCallback(() => {
    acceptTerms()
    onClose()
  }, [onClose])

  return (
    <ModalBody
      title={<Trans i18nKey="Terms.title" />}
      render={() => (
        <>
          <TrackPage category="Modal" name="Terms" />

          {markdown ? (
            <Terms px={5} pb={8}>
              <Markdown>{markdown}</Markdown>
            </Terms>
          ) : error ? (
            <Box grow alignItems="center" justifyContent="space-around">
              <Text ff="Inter|SemiBold" fontSize={3}>
                <TranslatedError error={error} />
              </Text>

              <LinkWithExternalIcon onClick={() => openURL(url)}>
                <Trans i18nKey="Terms.read" />
              </LinkWithExternalIcon>
            </Box>
          ) : (
            <Box horizontal alignItems="center">
              <Spinner
                size={32}
                style={{
                  margin: 'auto',
                }}
              />
            </Box>
          )}
        </>
      )}
      renderFooter={() => (
        <Box flex={1} horizontal justifyContent="space-between" alignItems="center">
          <Box flex={1} horizontal align="center" onClick={onSwitchAccept}>
            <CheckBox isChecked={accepted} data-e2e="termsOfUse_checkbox" />
            <Text ff="Inter|SemiBold" fontSize={4} style={{ padding: '0 16px', flex: 1 }}>
              <Trans i18nKey="Terms.switchLabel" />
            </Text>
          </Box>
          <Button onClick={onClick} primary disabled={!accepted} data-e2e="continue_button">
            <Trans i18nKey="common.confirm" />
          </Button>
        </Box>
      )}
    />
  )
}

export default Body
