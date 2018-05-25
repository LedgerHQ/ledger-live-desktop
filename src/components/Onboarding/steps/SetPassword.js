// UNTIL IS NEEDED SET PASSWORD STEP IS COMMENTED OUT

// // @flow
//
// import React, { PureComponent } from 'react'
// import bcrypt from 'bcryptjs'
//
// import { setEncryptionKey } from 'helpers/db'
//
// import Box from 'components/base/Box'
// import Button from 'components/base/Button'
//
// import IconSetPassword from 'icons/onboarding/SetPassword'
// import PasswordModal from 'components/SettingsPage/PasswordModal'
// import OnboardingFooter from '../OnboardingFooter'
//
// import type { StepProps } from '..'
//
// import { Title, Description } from '../helperComponents'
//
// type State = {
//   isPasswordModalOpened: boolean,
//   isPasswordEnabled: boolean,
// }
//
// class SetPassword extends PureComponent<StepProps, State> {
//   state = {
//     isPasswordModalOpened: false,
//     isPasswordEnabled: false,
//   }
//
//   handleOpenPasswordModal = () => {
//     this.setState({ isPasswordModalOpened: true })
//   }
//   handleClosePasswordModal = () => {
//     this.setState({ isPasswordModalOpened: false })
//   }
//   handleChangePassword = (password: string) => {
//     window.requestIdleCallback(() => {
//       setEncryptionKey('accounts', password)
//       const hash = password ? bcrypt.hashSync(password, 8) : undefined
//       this.props.savePassword(hash)
//     })
//   }
//
//   handleInputChange = (key: string) => (value: string) => {
//     this.setState({ [key]: value })
//   }
//
//   render() {
//     const { nextStep, prevStep, t } = this.props
//     const { isPasswordModalOpened, isPasswordEnabled } = this.state
//     return (
//       <Box sticky pt={150}>
//         <Box grow alignItems="center">
//           <Title>{t('onboarding:setPassword.title')}</Title>
//           <Description>{t('onboarding:setPassword.desc')}</Description>
//           <IconSetPassword />
//           <Box style={{ paddingTop: 35 }}>
//             <Button small primary onClick={() => this.handleOpenPasswordModal()}>
//               Set Password
//             </Button>
//           </Box>
//           {/* we might not be able to re-use what we have currently without modifications
//             the title and descriptions are not dynamic, we might need deffirent size as well */}
//           {isPasswordModalOpened && (
//             <PasswordModal
//               t={t}
//               isOpened={isPasswordModalOpened}
//               onClose={this.handleClosePasswordModal}
//               onChangePassword={this.handleChangePassword}
//               isPasswordEnabled={isPasswordEnabled}
//               currentPasswordHash=""
//             />
//           )}
//           <Box onClick={() => nextStep()} style={{ padding: 15 }}>
//             <Button>Skip this step</Button>
//           </Box>
//         </Box>
//         <OnboardingFooter
//           horizontal
//           align="center"
//           flow={2}
//           t={t}
//           nextStep={nextStep}
//           prevStep={prevStep}
//         />
//       </Box>
//     )
//   }
// }
//
// export default SetPassword
