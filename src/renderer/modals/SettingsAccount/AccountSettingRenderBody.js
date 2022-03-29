// @flow

import React, { PureComponent, memo } from "react";
import styled from "styled-components";
import get from "lodash/get";
import { compose } from "redux";
import { connect } from "react-redux";
import type { TFunction } from "react-i18next";
import { withTranslation, Trans } from "react-i18next";
import type { Account, Unit } from "@ledgerhq/live-common/lib/types";
import { validateNameEdition } from "@ledgerhq/live-common/lib/account";
import { AccountNameRequiredError } from "@ledgerhq/errors";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { urls } from "~/config/urls";
import { setDataModal } from "~/renderer/actions/modals";
import { removeAccount, updateAccount } from "~/renderer/actions/accounts";
import ModalBody from "~/renderer/components/Modal/ModalBody";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Alert from "~/renderer/components/Alert";
import Input from "~/renderer/components/Input";
import Select from "~/renderer/components/Select";
import Spoiler from "~/renderer/components/Spoiler";
import ConfirmModal from "~/renderer/modals/ConfirmModal";
import Space from "~/renderer/components/Space";
import Button from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type State = {
  accountName: ?string,
  accountUnit: ?Unit,
  endpointConfig: ?string,
  accountNameError: ?Error,
  endpointConfigError: ?Error,
  isRemoveAccountModalOpen: boolean,
};

type Props = {
  setDataModal: Function,
  updateAccount: Function,
  removeAccount: Function,
  t: TFunction,
  onClose: () => void,
  data: any,
};

const unitGetOptionValue = unit => unit.magnitude;
const renderUnitItemCode = item => item.data.code;

const mapDispatchToProps = {
  setDataModal,
  updateAccount,
  removeAccount,
};

const defaultState = {
  accountName: null,
  accountUnit: null,
  endpointConfig: null,
  accountNameError: null,
  endpointConfigError: null,
  isRemoveAccountModalOpen: false,
};

class AccountSettingRenderBody extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  };

  getAccount(data: Object): Account {
    const { accountName } = this.state;
    const account = get(data, "account", {});

    return {
      ...account,
      ...(accountName !== null
        ? {
            name: accountName,
          }
        : {}),
    };
  }

  handleChangeName = (value: string) =>
    this.setState({
      accountName: value,
    });

  handleSubmit = (account: Account, onClose: () => void) => (
    e: SyntheticEvent<HTMLFormElement | HTMLInputElement>,
  ) => {
    e.preventDefault();
    const { updateAccount, setDataModal } = this.props;
    const { accountName, accountUnit, endpointConfig, endpointConfigError } = this.state;

    if (!account.name.length) {
      this.setState({ accountNameError: new AccountNameRequiredError() });
    } else if (!endpointConfigError) {
      const name = validateNameEdition(account, accountName);

      account = {
        ...account,
        unit: accountUnit || account.unit,
        name,
      };
      if (endpointConfig && !endpointConfigError) {
        account.endpointConfig = endpointConfig;
      }
      updateAccount(account);
      setDataModal("MODAL_SETTINGS_ACCOUNT", { account });
      onClose();
    }
  };

  handleFocus = (e: any, name: string) => {
    e.target.select();

    switch (name) {
      case "accountName":
        this.setState({ accountNameError: null });
        break;
      case "endpointConfig":
        this.setState({ endpointConfigError: null });
        break;
      default:
        break;
    }
  };

  handleChangeUnit = (value: Unit) => {
    this.setState({ accountUnit: value });
  };

  handleOpenRemoveAccountModal = () => this.setState({ isRemoveAccountModalOpen: true });

  handleCloseRemoveAccountModal = () => this.setState({ isRemoveAccountModalOpen: false });

  handleRemoveAccount = (account: Account) => {
    const { removeAccount, onClose } = this.props;
    removeAccount(account);
    this.setState({ isRemoveAccountModalOpen: false });
    onClose();
  };

  render() {
    const { accountUnit, accountNameError, isRemoveAccountModalOpen } = this.state;
    const { t, onClose, data } = this.props;
    if (!data) return null;

    const account = this.getAccount(data);

    const usefulData = {
      xpub: account.xpub || undefined,
      index: account.index,
      freshAddressPath: account.freshAddressPath,
      id: account.id,
      blockHeight: account.blockHeight,
    };

    const onSubmit = this.handleSubmit(account, onClose);

    return (
      <ModalBody
        onClose={onClose}
        title={t("account.settings.title")}
        render={() => (
          <>
            <TrackPage category="Modal" name="AccountSettings" />
            <Container>
              <Box>
                <OptionRowTitle>{t("account.settings.accountName.title")}</OptionRowTitle>
                <OptionRowDesc>{t("account.settings.accountName.desc")}</OptionRowDesc>
              </Box>
              <Box>
                <Input
                  autoFocus
                  containerProps={{ style: { width: 230 } }}
                  value={account.name}
                  maxLength={getEnv("MAX_ACCOUNT_NAME_SIZE")}
                  onChange={this.handleChangeName}
                  onEnter={onSubmit}
                  onFocus={e => this.handleFocus(e, "accountName")}
                  error={accountNameError}
                  id="input-edit-name"
                />
              </Box>
            </Container>
            <Container>
              <Box>
                <OptionRowTitle>{t("account.settings.unit.title")}</OptionRowTitle>
                <OptionRowDesc>{t("account.settings.unit.desc")}</OptionRowDesc>
              </Box>
              <Box style={{ width: 230 }}>
                <Select
                  isSearchable={false}
                  onChange={this.handleChangeUnit}
                  getOptionValue={unitGetOptionValue}
                  renderValue={renderUnitItemCode}
                  renderOption={renderUnitItemCode}
                  value={accountUnit || account.unit}
                  options={account.currency.units}
                />
              </Box>
            </Container>
            <Spoiler textTransform title={t("account.settings.advancedLogs")}>
              {account.currency.family === "bitcoin" ? <Tips /> : null}
              <AdvancedLogsContainer>{JSON.stringify(usefulData, null, 2)}</AdvancedLogsContainer>
            </Spoiler>
            <ConfirmModal
              analyticsName="RemoveAccount"
              isDanger
              centered
              isOpened={isRemoveAccountModalOpen}
              onClose={this.handleCloseRemoveAccountModal}
              onReject={this.handleCloseRemoveAccountModal}
              onConfirm={() => this.handleRemoveAccount(account)}
              title={t("settings.removeAccountModal.title")}
              subTitle={t("common.areYouSure")}
              desc={
                <Box>
                  {t("settings.removeAccountModal.desc")}
                  <Alert type="warning" mt={4}>
                    {t("settings.removeAccountModal.warning")}
                  </Alert>
                </Box>
              }
            />
            <Space of={20} />
          </>
        )}
        renderFooter={() => (
          <>
            <Button
              event="OpenAccountDelete"
              danger
              type="button"
              onClick={this.handleOpenRemoveAccountModal}
              id="account-settings-delete"
            >
              {t("settings.removeAccountModal.delete")}
            </Button>
            <Button
              id="account-settings-apply"
              event="DoneEditingAccount"
              ml="auto"
              onClick={onSubmit}
              primary
            >
              {t("common.apply")}
            </Button>
          </>
        )}
      />
    );
  }
}

const AdvancedLogsContainer: ThemedComponent<{}> = styled.div`
  border: 1px dashed ${p => p.theme.colors.palette.background.default};
  background-color: ${p => p.theme.colors.palette.background.default};
  color: ${p => p.theme.colors.palette.text.shade100};
  font-family: monospace;
  font-size: 11px;
  outline: none;
  padding: 20px;
  margin-top: 15px;
  width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  ${p => p.theme.overflow.xy};
  user-select: text;
`;

const ConnectedAccountSettingRenderBody: React$ComponentType<{}> = compose(
  connect(null, mapDispatchToProps),
  withTranslation(),
)(AccountSettingRenderBody);

export default ConnectedAccountSettingRenderBody;

export const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  flow: 2,
  horizontal: true,
  mb: 3,
  pb: 4,
}))`
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  justify-content: space-between;
`;

export const OptionRowDesc: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 3,
  textAlign: "left",
  lineHeight: 1.69,
  color: "palette.text.shade60",
  shrink: 1,
}))``;

export const OptionRowTitle: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
  fontSize: 4,
  textAlign: "left",
  lineHeight: 1.69,
}))``;

const Tips = memo(function Tips() {
  return (
    <Alert type="primary" learnMoreUrl={urls.xpubLearnMore}>
      <Trans i18nKey="account.settings.advancedTips" />
    </Alert>
  );
});
