// @flow

import React, { PureComponent } from 'react'

import Box from 'components/base/Box'
import InputPassword from 'components/base/InputPassword'
import Label from 'components/base/Label'

import { createCustomErrorClass } from 'helpers/errors'

import type { T } from 'types/common'

const PasswordsDontMatchError = createCustomErrorClass('PasswordsDontMatch')

type Props = {
  t: T,
  hasPassword: boolean,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  incorrectPassword?: ?Error,
  onSubmit: Function,
  isValid: () => boolean,
  onChange: Function,
}

class PasswordForm extends PureComponent<Props> {
  render() {
    const {
      t,
      hasPassword,
      currentPassword,
      newPassword,
      incorrectPassword,
      confirmPassword,
      isValid,
      onChange,
      onSubmit,
    } = this.props
    // TODO: adjust design to separate 3 fields
    return (
      <form onSubmit={onSubmit}>
        <Box px={7} mt={4} flow={3}>
          {hasPassword && (
            <Box flow={1} mb={5}>
              <Label htmlFor="currentPassword">
                {t('app:password.inputFields.currentPassword.label')}
              </Label>
              <InputPassword
                autoFocus
                id="currentPassword"
                onChange={onChange('currentPassword')}
                value={currentPassword}
                error={incorrectPassword}
              />
            </Box>
          )}
          <Box flow={1}>
            <Label htmlFor="newPassword">{t('app:password.inputFields.newPassword.label')}</Label>
            <InputPassword
              style={{ mt: 4, width: 240 }}
              autoFocus={!hasPassword}
              id="newPassword"
              onChange={onChange('newPassword')}
              value={newPassword}
            />
          </Box>
          <Box flow={1}>
            <Label htmlFor="confirmPassword">
              {t('app:password.inputFields.confirmPassword.label')}
            </Label>
            <InputPassword
              style={{ width: 240 }}
              id="confirmPassword"
              onChange={onChange('confirmPassword')}
              value={confirmPassword}
              error={!isValid() && confirmPassword.length > 0 && new PasswordsDontMatchError()}
            />
          </Box>
          <button hidden type="submit" />
        </Box>
      </form>
    )
  }
}

export default PasswordForm
