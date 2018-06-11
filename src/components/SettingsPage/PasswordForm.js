// @flow

import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import bcrypt from 'bcryptjs'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import InputPassword from 'components/base/InputPassword'
import Label from 'components/base/Label'
import { ErrorMessageInput } from 'components/base/Input'

import type { T } from 'types/common'

type Props = {
  t: T,
  isPasswordEnabled: boolean,

  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  incorrectPassword: boolean,
  onSubmit: Function,
  onChange: Function,
}

class PasswordForm extends PureComponent<Props> {
  render() {
    const {
      t,
      isPasswordEnabled,
      currentPassword,
      newPassword,
      incorrectPassword,
      confirmPassword,
      onChange,
      onSubmit,
    } = this.props

    return (
      <form onSubmit={onSubmit}>
        <Box px={7} mt={4} flow={3}>
          {isPasswordEnabled && (
            <Box flow={1}>
              <Label htmlFor="currentPassword">{t('password:currentPassword.label')}</Label>
              <InputPassword
                autoFocus
                type="password"
                placeholder={t('password:currentPassword.placeholder')}
                id="currentPassword"
                onChange={onChange('currentPassword')}
                value={currentPassword}
              />
              {incorrectPassword && (
                <ErrorMessageInput>{t('password:errorMessageIncorrectPassword')}</ErrorMessageInput>
              )}
            </Box>
          )}
          <Box flow={1}>
            {isPasswordEnabled && (
              <Label htmlFor="newPassword">{t('password:newPassword.label')}</Label>
            )}
            <InputPassword
              style={{ mt: 4, width: 240 }}
              autoFocus
              placeholder={t('password:newPassword.placeholder')}
              id="newPassword"
              onChange={onChange('newPassword')}
              value={newPassword}
              // withStrength
            />
          </Box>
          <Box flow={1}>
            {isPasswordEnabled && (
              <Label htmlFor="confirmPassword">{t('password:confirmPassword.label')}</Label>
            )}
            <InputPassword
              style={{ width: 240 }}
              placeholder={t('password:confirmPassword.placeholder')}
              id="confirmPassword"
              onChange={onChange('confirmPassword')}
              value={confirmPassword}
              // withStrength
            />
          </Box>
        </Box>
      </form>
    )
  }
}

export default PasswordForm
