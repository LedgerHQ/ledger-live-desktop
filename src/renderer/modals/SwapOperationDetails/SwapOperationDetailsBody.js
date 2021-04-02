// @flow
import React, { useCallback } from "react";
import moment from "moment";
import { useTranslation, Trans } from "react-i18next";
import { useSelector } from "react-redux";
import type { MappedSwapOperation } from "@ledgerhq/live-common/lib/exchange/swap/types";
import {
  getAccountUnit,
  getAccountCurrency,
  getAccountName,
  getMainAccount,
} from "@ledgerhq/live-common/lib/account";
import { operationStatusList } from "@ledgerhq/live-common/lib/exchange/swap";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import Link from "~/renderer/components/Link";
import Tooltip from "~/renderer/components/Tooltip";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import Ellipsis from "~/renderer/components/Ellipsis";
import Button from "~/renderer/components/Button";
import CopyWithFeedback from "~/renderer/components/CopyWithFeedback";
import Text from "~/renderer/components/Text";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import FormattedVal from "~/renderer/components/FormattedVal";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import IconSwap from "~/renderer/icons/Swap";
import IconArrowDown from "~/renderer/icons/ArrowDown";
import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { getStatusColor } from "~/renderer/screens/exchange/swap/History/OperationRow";
import IconClock from "~/renderer/icons/Clock";
import { GradientHover } from "~/renderer/modals/OperationDetails/styledComponents";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import IconExclamationCircle from "~/renderer/icons/ExclamationCircle";
import useTheme from "~/renderer/hooks/useTheme";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { DataList } from "~/renderer/modals/OperationDetails";
import uniq from "lodash/uniq";

const Label = styled(Text).attrs(() => ({
  fontSize: 2,
  color: "palette.text.shade100",
  ff: "Inter|SemiBold",
}))`
  margin-bottom: 3px;
  text-transform: uppercase;
`;

const Value = styled(Box).attrs(() => ({
  fontSize: 4,
  color: "palette.text.shade50",
  ff: "Inter|Medium",
}))`
  flex: 1;
  ${p => (p.status ? `color:${getStatusColor(p.status, p.theme)};` : "")}
`;

const Row = styled(Box).attrs(p => ({
  py: p.py !== undefined ? p.py : 24,
}))`
  flex-direction: ${p => (p.vertical ? "column" : "row")};
  &:not(:last-child) {
    border-bottom: 1px solid
      ${p => (p.noBorder ? "transparent" : p.theme.colors.palette.text.shade10)};
  }
  & > * {
    flex: 50%;
    align-items: flex-start;
    overflow: hidden;
  }
`;

const Status: ThemedComponent<{}> = styled.div`
  height: 66px;
  width: 66px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  align-self: center;
  border-radius: 50%;
  background: ${p => rgba(getStatusColor(p.status, p.theme), 0.1)};
  & > * {
    color: ${p => getStatusColor(p.status, p.theme)};
  }
`;

const WrapperClock: ThemedComponent<{}> = styled(Box).attrs(() => ({
  bg: "palette.background.paper",
  color: "palette.text.shade60",
}))`
  border-radius: 50%;
  position: absolute;
  bottom: -2px;
  right: -2px;
  padding: 3px;
`;

const SelectableTextWrapper: ThemedComponent<{}> = styled(Box).attrs(p => ({
  ff: "Inter",
  color: p.color || "palette.text.shade80",
  fontSize: 4,
  relative: true,
}))`
  width: 100%;

  ${GradientHover} {
    display: none;
  }

  &:hover ${GradientHover} {
    display: flex;
    & > * {
      cursor: pointer;
    }
  }

  &:hover ${Value} {
    color: ${p => p.theme.colors.palette.text.shade100};
    font-weight: 400;
  }
}
`;

const SwapOperationDetailsBody = ({
  mappedSwapOperation,
  onClose,
}: {
  mappedSwapOperation: MappedSwapOperation,
  onClose: () => void,
}) => {
  const {
    fromAccount,
    toAccount,
    operation,
    provider,
    swapId,
    status,
    fromAmount,
    toAmount,
  } = mappedSwapOperation;
  const history = useHistory();
  const fromUnit = getAccountUnit(fromAccount);
  const fromCurrency = getAccountCurrency(fromAccount);
  const toUnit = getAccountUnit(toAccount);
  const toCurrency = getAccountCurrency(toAccount);
  const accounts = useSelector(shallowAccountsSelector);
  const normalisedFromAmount = fromAmount.times(-1);
  const theme = useTheme();
  const statusColor = getStatusColor(status, theme);
  const { t } = useTranslation();

  const openAccount = useCallback(
    account => {
      const parentAccount =
        account.type !== "Account" ? accounts.find(a => a.id === account.parentId) : null;
      const mainAccount = getMainAccount(account, parentAccount);

      const url = `/account/${mainAccount.id}/${parentAccount ? account.id : ""}`;
      setTrackingSource("swap operation details");
      history.push({ pathname: url });
      onClose();
    },
    [accounts, history, onClose],
  );

  // Fixme, at this point it might be a good idea to refactor into the op details modal
  const senders = uniq(operation.senders);
  const recipients = uniq(operation.recipients);

  return (
    <ModalBody
      onClose={onClose}
      subTitle={<Trans i18nKey="operationDetails.title" />}
      title={<Trans i18nKey="swap.operationDetailsModal.title" />}
      render={() => (
        <Box p={1}>
          <Status status={status}>
            <IconSwap size={27} />
            {operationStatusList.pending.includes(status) ? (
              <WrapperClock>
                <IconClock size={16} />
              </WrapperClock>
            ) : null}
          </Status>
          <Box my={4} mb={48} alignItems="center">
            <Box selectable>
              <FormattedVal
                color={normalisedFromAmount.isNegative() ? "palette.text.shade100" : undefined}
                unit={fromUnit}
                alwaysShowSign
                showCode
                val={normalisedFromAmount}
                fontSize={6}
                disableRounding
              />
            </Box>
            <Box my={12} color={"palette.text.shade50"}>
              <IconArrowDown size={16} />
            </Box>
            <Box selectable>
              <FormattedVal
                unit={toUnit}
                alwaysShowSign
                showCode
                val={toAmount}
                fontSize={6}
                disableRounding
                color={statusColor}
              />
            </Box>
          </Box>
          <Row>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.provider" />
              </Label>
              <LinkWithExternalIcon
                fontSize={12}
                style={{ textTransform: "capitalize" }}
                onClick={() => openURL(urls.swap.providers[provider]?.main)}
              >
                {provider}
              </LinkWithExternalIcon>
            </Box>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.txid" />
              </Label>
              <SelectableTextWrapper selectable>
                <Value>{swapId}</Value>
                <GradientHover>
                  <CopyWithFeedback text={swapId} />
                </GradientHover>
              </SelectableTextWrapper>
            </Box>
          </Row>
          <Row>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.status" />
              </Label>
              <Box horizontal alignItems={"center"}>
                <Value mr={1} status={status} style={{ textTransform: "capitalize" }}>
                  {status}
                </Value>
                <Tooltip
                  content={
                    <Box style={{ maxWidth: 180 }}>
                      <Trans i18nKey={`swap.operationDetailsModal.statusTooltips.${status}`} />
                    </Box>
                  }
                >
                  <IconExclamationCircle size={12} color={statusColor} />
                </Tooltip>
              </Box>
            </Box>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.date" />
              </Label>
              <Value>{moment(operation.date).format("MMMM, Do, YYYY")}</Value>
            </Box>
          </Row>
          <Row noBorder py={0} pt={24}>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.from" />
              </Label>
              <Value horizontal alignItems={"center"} style={{ width: "100%" }}>
                <Box mr={1} alignItems={"center"}>
                  <CryptoCurrencyIcon size={16} currency={fromCurrency} />
                </Box>
                <Box flex={1} color={"palette.text.shade100"}>
                  <Ellipsis>
                    <Link onClick={() => openAccount(fromAccount)}>
                      {getAccountName(fromAccount)}
                    </Link>
                  </Ellipsis>
                </Box>
              </Value>
            </Box>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.initialAmount" />
              </Label>
              <Value>
                <FormattedVal
                  unit={fromUnit}
                  showCode
                  val={fromAmount}
                  disableRounding
                  color={"palette.text.shade50"}
                />
              </Value>
            </Box>
          </Row>
          <Row vertical>
            <Label>
              <Trans i18nKey="swap.operationDetailsModal.fromAddress" count={senders?.length} />
            </Label>
            <Value horizontal alignItems={"center"} style={{ width: "100%" }}>
              <DataList lines={senders} t={t} />
            </Value>
          </Row>
          <Row>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.to" />
              </Label>
              <Value horizontal alignItems={"center"} style={{ width: "100%" }}>
                <Box mr={1} alignItems={"center"}>
                  <CryptoCurrencyIcon size={16} currency={toCurrency} />
                </Box>
                <Box flex={1} color={"palette.text.shade100"}>
                  <Ellipsis>
                    <Link onClick={() => openAccount(toAccount)}>{getAccountName(toAccount)}</Link>
                  </Ellipsis>
                </Box>
              </Value>
            </Box>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.creditedAmount" />
              </Label>
              <Value>
                <FormattedVal
                  unit={toUnit}
                  showCode
                  val={toAmount}
                  fotSize={6}
                  disableRounding
                  color={"palette.text.shade50"}
                />
              </Value>
            </Box>
          </Row>
          <Row vertical>
            <Label>
              <Trans i18nKey="swap.operationDetailsModal.toProvider" />
            </Label>
            <Value horizontal alignItems={"center"} style={{ width: "100%" }}>
              <DataList lines={recipients} t={t} />
            </Value>
          </Row>
        </Box>
      )}
      renderFooter={() => (
        <Box alignItems={"flex-end"}>
          <Button primary onClick={onClose}>
            <Text>{"Close"}</Text>
          </Button>
        </Box>
      )}
    />
  );
};
export default SwapOperationDetailsBody;
