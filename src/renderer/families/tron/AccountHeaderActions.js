// @flow
import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import { getAccountCurrency, getMainAccount } from "@ledgerhq/live-common/lib/account";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box/Box";
import IconChartLine from "~/renderer/icons/ChartLine";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { openModal } from "~/renderer/actions/modals";
import useTheme from "~/renderer/hooks/useTheme";

const ButtonBase: ThemedComponent<*> = styled(Button)`
  height: 34px;
  padding-top: 0;
  padding-bottom: 0;
`;

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

const AccountHeaderActions = ({ account, parentAccount }: Props) => {
  const contrastText = useTheme("colors.palette.primary.contrastText");
  const dispatch = useDispatch();
  const currency = getAccountCurrency(account);
  const mainAccount = getMainAccount(account, parentAccount);

  const { tronResources } = mainAccount;
  if (parentAccount) return null;
  const tronPower = tronResources?.tronPower ?? 0;

  const onClick = () => {
    if (tronPower > 0) {
      dispatch(
        openModal("MODAL_MANAGE_TRON", {
          parentAccount,
          account,
        }),
      );
    } else {
      dispatch(
        openModal("MODAL_TRON_REWARDS_INFO", {
          parentAccount,
          account,
        }),
      );
    }
  };

  return (
    <ButtonBase primary onClick={onClick}>
      <Box horizontal flow={1} alignItems="center">
        {tronPower > 0 ? (
          <CryptoCurrencyIcon overrideColor={contrastText} currency={currency} size={12} />
        ) : (
          <IconChartLine size={12} />
        )}
        <Box fontSize={3}>
          <Trans i18nKey={tronPower > 0 ? "tron.voting.manageTP" : "delegation.title"} />
        </Box>
      </Box>
    </ButtonBase>
  );
};

export default AccountHeaderActions;
