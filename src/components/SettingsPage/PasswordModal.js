// @flow

import React, { PureComponent } from 'react'
import bcrypt from 'bcryptjs'

import type { T } from 'types/common'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import { Modal, ModalContent, ModalBody, ModalTitle, ModalFooter } from 'components/base/Modal'

import PasswordForm from './PasswordForm'

type Props = {
  t: T,
  onClose: () => void,
  onChangePassword: (?string) => void,
  isPasswordEnabled: boolean,
  currentPasswordHash: string,
}

type State = {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  incorrectPassword: boolean,
}

const INITIAL_STATE = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  incorrectPassword: false,
}

class PasswordModal extends PureComponent<Props, State> {
  state = INITIAL_STATE

  handleSave = (e: SyntheticEvent<HTMLFormElement>) => {
    const { currentPassword, newPassword } = this.state

    if (e) {
      e.preventDefault()
    }
    if (!this.isValid()) {
      return
    }

    const { isPasswordEnabled, currentPasswordHash, onChangePassword } = this.props
    if (isPasswordEnabled) {
      if (!bcrypt.compareSync(currentPassword, currentPasswordHash)) {
        this.setState({ incorrectPassword: true })
        return
      }
      onChangePassword(newPassword)
    } else {
      onChangePassword(newPassword)
    }
  }

  handleInputChange = (key: string) => (value: string) => {
    if (this.state.incorrectPassword) {
      this.setState({ incorrectPassword: false })
    }
    this.setState({ [key]: value })
  }

  handleReset = () => this.setState(INITIAL_STATE)

  isValid = () => {
    const { newPassword, confirmPassword } = this.state
    return newPassword === confirmPassword
  }

  render() {
    const { t, isPasswordEnabled, onClose, ...props } = this.props
    const { currentPassword, newPassword, incorrectPassword, confirmPassword } = this.state
    return (
      <Modal
        {...props}
        onHide={this.handleReset}
        onClose={onClose}
        render={({ onClose }) => (
          <ModalBody onClose={onClose}>
            {isPasswordEnabled ? (
              <ModalTitle>{t('app:password.changePassword.title')}</ModalTitle>
            ) : (
              <ModalTitle>{t('app:password.setPassword.title')}</ModalTitle>
            )}
            <ModalContent>
              <Box ff="Museo Sans|Regular" color="dark" textAlign="center" mb={2} mt={3}>
                {isPasswordEnabled
                  ? t('app:password.changePassword.subTitle')
                  : t('app:password.setPassword.subTitle')}
              </Box>
              <Box ff="Open Sans" color="smoke" fontSize={4} textAlign="center" px={4}>
                {isPasswordEnabled
                  ? t('app:password.changePassword.desc')
                  : t('app:password.setPassword.desc')}
              </Box>
              <PasswordForm
                onSubmit={this.handleSave}
                isPasswordEnabled={isPasswordEnabled}
                newPassword={newPassword}
                currentPassword={currentPassword}
                confirmPassword={confirmPassword}
                incorrectPassword={incorrectPassword}
                isValid={this.isValid}
                onChange={this.handleInputChange}
                t={t}
              />
            </ModalContent>
            <ModalFooter horizontal align="center" justify="flex-end" flow={2}>
              <Button small type="Button small" onClick={onClose}>
                {t('app:common.cancel')}
              </Button>
              <Button
                small
                primary
                onClick={this.handleSave}
                disabled={!this.isValid() || !newPassword.length || !confirmPassword.length}
              >
                {t('app:common.save')}
              </Button>
            </ModalFooter>
          </ModalBody>
        )}
      />
    )
  }
}

export default PasswordModal
