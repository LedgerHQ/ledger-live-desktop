import React, { PureComponent, memo, Component } from "react";
import styled from "styled-components";
import get from "lodash/get";
import { compose } from "redux";
import { connect } from "react-redux";
import { TFunction, withTranslation, Trans } from "react-i18next";
import { Account, Unit } from "@ledgerhq/live-common/lib/types";
import { validateNameEdition } from "@ledgerhq/live-common/lib/account";
import { AccountNameRequiredError } from "@ledgerhq/errors";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { Text, Flex } from "@ledgerhq/react-ui";
import { urls } from "~/config/urls";
import { setDataModal } from "~/renderer/actions/modals";
import { removeAccount, updateAccount } from "~/renderer/actions/accounts";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Alert from "~/renderer/components/Alert";
import Input from "~/renderer/components/Input";
import Select from "~/renderer/components/Select";
import Spoiler from "~/renderer/components/Spoiler";
import ConfirmModal from "~/renderer/modals/ConfirmModal";
import Button from "~/renderer/components/Button";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Container = styled(Flex).attrs(() => ({
  flexDirection: "column",
  justifyContent: "space-between",
  flex: 1,
  padding: 12,
  height: "100%",
  backgroundColor: "palette.neutral.c00",
}))``;

const BodyContainer = styled(Flex).attrs(() => ({
  flexDirection: "column",
  justifyContent: "flex-start",
  flexShrink: 1,
}))`
  height: 100%;
  overflow-y: scroll;
`;

const FooterContainer = styled(Flex).attrs(() => ({
  flexDirection: "row",
  justifyContent: "space-between",
}))``;

const InputZoneContainer = styled(Flex).attrs(() => ({
  flexDirection: "column",
  mb: 11,
}))``;

const Subtitle = styled(Text).attrs(() => ({
  color: "palette.neutral.c100",
  variant: "subtitle",
  fontWeight: "semiBold",
  mb: 3,
}))``;

const Description = styled(Text).attrs(() => ({
  color: "palette.neutral.c80",
  variant: "paragraph",
  fontWeight: "medium",
  mb: "14px",
}))``;

const AdvancedLogsContainer: ThemedComponent<{}> = styled(Flex).attrs(() => ({
  backgroundColor: "palette.neutral.c30",
  mt: 7,
  padding: 6,
}))`
  width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  ${p => p.theme.overflow.xy};
  user-select: text;
`;

type State = {
  accountName?: string;
  accountUnit?: Unit;
  endpointConfig?: string;
  accountNameError?: Error;
  endpointConfigError?: Error;
  isRemoveAccountModalOpen: boolean;
  data: any;
};

type Props = {
  setDataModal: Function;
  updateAccount: Function;
  removeAccount: Function;
  t: TFunction;
  onClose: () => void;
  data: any;
};

const unitGetOptionValue = unit => unit.magnitude;
const renderUnitItemCode = item => item.data.code;

const mapDispatchToProps = {
  setDataModal,
  updateAccount,
  removeAccount,
};

const defaultState: State = {
  accountName: null,
  accountUnit: null,
  endpointConfig: null,
  accountNameError: null,
  endpointConfigError: null,
  isRemoveAccountModalOpen: false,
};

class AccountSettingRenderBody extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...defaultState,
      data: props.data || {},
    };
  }

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
      this.setState({ data: { ...this.state.data, account } });
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
    const { accountUnit, accountNameError, data, isRemoveAccountModalOpen } = this.state;
    const { t, onClose } = this.props;
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
      <Container>
        <TrackPage category="Modal" name="AccountSettings" />
        <Text mb={12} alignSelf="center" variant="h3" color="palette.neutral.c100">
          {t("account.settings.title")}
        </Text>
        <BodyContainer>
          <InputZoneContainer>
            <Subtitle>{t("account.settings.accountName.title")}</Subtitle>
            <Description>{t("account.settings.accountName.desc")}</Description>
            <Input
              autoFocus
              value={account.name}
              maxLength={getEnv("MAX_ACCOUNT_NAME_SIZE")}
              onChange={this.handleChangeName}
              onEnter={onSubmit}
              onFocus={e => this.handleFocus(e, "accountName")}
              error={accountNameError}
              id="input-edit-name"
            />
          </InputZoneContainer>
          <InputZoneContainer>
            <Subtitle>{t("account.settings.unit.title")}</Subtitle>
            <Description>{t("account.settings.unit.desc")}</Description>
            <Select
              isSearchable={false}
              onChange={this.handleChangeUnit}
              getOptionValue={unitGetOptionValue}
              renderValue={renderUnitItemCode}
              renderOption={renderUnitItemCode}
              value={accountUnit || account.unit}
              options={account.currency.units}
            />
          </InputZoneContainer>
          <Spoiler textTransform title={t("account.settings.advancedLogs")}>
            {account.currency.family === "bitcoin" ? <Tips /> : null}
            <AdvancedLogsContainer>
              <Text variant="small" fontWeight="medium" color="palette.neutral.c80">
                {JSON.stringify(usefulData, null, 2)}
              </Text>
            </AdvancedLogsContainer>
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
        </BodyContainer>
        <FooterContainer>
          <Button
            variant="error"
            event="OpenAccountDelete"
            onClick={this.handleOpenRemoveAccountModal}
            id="account-settings-delete"
          >
            {t("common.delete")}
          </Button>
          <Button
            variant="main"
            id="account-settings-apply"
            event="DoneEditingAccount"
            ml="auto"
            onClick={onSubmit}
          >
            {t("common.confirm")}
          </Button>
        </FooterContainer>
      </Container>
    );
  }
}

const ConnectedAccountSettingRenderBody: React.ReactComponentType<{}> = compose(
  connect(null, mapDispatchToProps),
  withTranslation(),
)(AccountSettingRenderBody);

export default ConnectedAccountSettingRenderBody;

const Tips = memo(function Tips() {
  return (
    <Alert type="primary" learnMoreUrl={urls.xpubLearnMore}>
      <Trans i18nKey="account.settings.advancedTips" />
    </Alert>
  );
});
