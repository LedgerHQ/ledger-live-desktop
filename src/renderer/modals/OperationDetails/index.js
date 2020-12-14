// @flow

import React, { Component, useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Trans, withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import styled from "styled-components";
import uniq from "lodash/uniq";
import moment from "moment";

import {
  findSubAccountById,
  getAccountCurrency,
  getAccountUnit,
  getMainAccount,
} from "@ledgerhq/live-common/lib/account";
import { listTokenTypesForCryptoCurrency } from "@ledgerhq/live-common/lib/currencies";
import {
  getDefaultExplorerView,
  getTransactionExplorer,
} from "@ledgerhq/live-common/lib/explorers";
import {
  findOperationInAccount,
  getOperationAmountNumber,
  getOperationConfirmationNumber,
  getOperationConfirmationDisplayableNumber,
} from "@ledgerhq/live-common/lib/operation";
import type { Account, AccountLike, Operation } from "@ledgerhq/live-common/lib/types";

import { urls } from "~/config/urls";
import { openModal } from "~/renderer/actions/modals";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import CopyWithFeedback from "~/renderer/components/CopyWithFeedback";
import CounterValue from "~/renderer/components/CounterValue";
import Ellipsis from "~/renderer/components/Ellipsis";
import FakeLink from "~/renderer/components/FakeLink";
import FormattedVal from "~/renderer/components/FormattedVal";
import LabelInfoTooltip from "~/renderer/components/LabelInfoTooltip";
import Link from "~/renderer/components/Link";
import LinkHelp from "~/renderer/components/LinkHelp";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import ConfirmationCheck from "~/renderer/components/OperationsList/ConfirmationCheck";
import OperationComponent from "~/renderer/components/OperationsList/Operation";
import Text from "~/renderer/components/Text";
import byFamiliesOperationDetails from "~/renderer/generated/operationDetails";
import IconChevronRight from "~/renderer/icons/ChevronRight";
import IconExternalLink from "~/renderer/icons/ExternalLink";
import { openURL } from "~/renderer/linking";
import { accountSelector } from "~/renderer/reducers/accounts";
import {
  confirmationsNbForCurrencySelector,
  marketIndicatorSelector,
} from "~/renderer/reducers/settings";
import { getMarketColor } from "~/renderer/styles/helpers";

import {
  OpDetailsSection,
  OpDetailsTitle,
  GradientHover,
  OpDetailsData,
  NoMarginWrapper,
  B,
  TextEllipsis,
  Separator,
  HashContainer,
} from "./styledComponents";
import ToolTip from "~/renderer/components/Tooltip";

const mapStateToProps = (state, { operationId, accountId, parentId }) => {
  const marketIndicator = marketIndicatorSelector(state);
  const parentAccount: ?Account = parentId && accountSelector(state, { accountId: parentId });
  let account: ?AccountLike;
  if (parentAccount) {
    account = findSubAccountById(parentAccount, accountId);
  } else {
    account = accountSelector(state, { accountId });
  }
  const mainCurrency = parentAccount
    ? parentAccount.currency
    : account && account.type !== "TokenAccount"
    ? account.currency
    : null;
  const confirmationsNb = mainCurrency
    ? confirmationsNbForCurrencySelector(state, { currency: mainCurrency })
    : 0;
  const operation = account ? findOperationInAccount(account, operationId) : null;
  return {
    marketIndicator,
    account,
    parentAccount,
    operation,
    confirmationsNb,
  };
};

type OwnProps = {
  t: TFunction,
  operation: ?Operation,
  account: ?AccountLike,
  onClose: () => void,
};
type Props = OwnProps & {
  parentAccount: ?Account,
  confirmationsNb: number,
  marketIndicator: *,
  parentOperation?: Operation,
};
type openOperationType = "goBack" | "subOperation" | "internalOperation";

const OperationDetails: React$ComponentType<OwnProps> = connect(mapStateToProps)((props: Props) => {
  const {
    t,
    onClose,
    operation,
    account,
    parentAccount,
    confirmationsNb,
    marketIndicator,
    parentOperation,
  } = props;

  if (!operation || !account) return null;

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const mainAccount = getMainAccount(account, parentAccount);
  const { extra, hash, date, senders, type, fee, recipients: _recipients } = operation;
  const recipients = _recipients.filter(Boolean);
  const { name } = mainAccount;

  const currency = getAccountCurrency(account);

  const unit = getAccountUnit(account);

  const amount = getOperationAmountNumber(operation);
  const isNegative = amount.isNegative();
  const marketColor = getMarketColor({
    marketIndicator,
    isNegative,
  });
  const confirmations = getOperationConfirmationNumber(operation, mainAccount);
  const confirmationsString = getOperationConfirmationDisplayableNumber(operation, mainAccount);
  const isConfirmed = confirmations >= confirmationsNb;

  const specific = byFamiliesOperationDetails[mainAccount.currency.family];

  const IconElement =
    specific && specific.confirmationCell ? specific.confirmationCell[operation.type] : null;

  const AmountTooltip =
    specific && specific.amountTooltip ? specific.amountTooltip[operation.type] : null;

  const urlWhatIsThis =
    specific && specific.getURLWhatIsThis && specific.getURLWhatIsThis(operation);
  const urlFeesInfo = specific && specific.getURLFeesInfo && specific.getURLFeesInfo(operation);
  const url = getTransactionExplorer(getDefaultExplorerView(mainAccount.currency), operation.hash);
  const uniqueSenders = uniq(senders);

  const OpDetailsExtra =
    specific && specific.OperationDetailsExtra
      ? specific.OperationDetailsExtra
      : OperationDetailsExtra;

  const { hasFailed } = operation;
  const subOperations = operation.subOperations || [];
  const internalOperations = operation.internalOperations || [];

  const isToken = listTokenTypesForCryptoCurrency(mainAccount.currency).length > 0;

  const openOperation = useCallback(
    (type: openOperationType, operation: Operation, parentOperation?: Operation) => {
      const data = {
        operationId: operation.id,
        accountId: operation.accountId,
        parentOperation: undefined,
        parentId: undefined,
      };
      if (["subOperation", "internalOperation"].includes(type)) {
        data.parentOperation = parentOperation;
        if (type === "subOperation") {
          data.parentId = account.id;
        }
      }
      dispatch(openModal("MODAL_OPERATION_DETAILS", data));
    },
    [dispatch, account],
  );

  const goToMainAccount = useCallback(() => {
    const url = `/account/${mainAccount.id}`;
    if (location !== url) {
      history.push({ pathname: url, state: { source: "operation details" } });
    }
    onClose();
  }, [mainAccount, history, onClose, location]);

  const goToSubAccount = useCallback(() => {
    const url = `/account/${mainAccount.id}/${account.id}`;
    if (location !== url) {
      history.push({ pathname: url, state: { source: "operation details" } });
    }
    onClose();
  }, [mainAccount, account, history, onClose, location]);

  return (
    <ModalBody
      title={t(`operation.type.${operation.type}`)}
      subTitle={t("operationDetails.title")}
      onClose={onClose}
      onBack={parentOperation ? () => openOperation("goBack", parentOperation) : undefined}
      render={() => (
        <Box flow={3}>
          <TrackPage
            category={location.pathname !== "/" ? "Account" : "Portfolio"}
            name="Operation Details"
            currencyName={currency.name}
          />
          <Box alignItems="center" mt={1}>
            {IconElement ? (
              <IconElement
                operation={operation}
                marketColor={marketColor}
                isConfirmed={isConfirmed}
                hasFailed={hasFailed}
                style={{
                  transform: "scale(1.5)",
                  paddingLeft: 0,
                }}
                t={t}
                type={type}
                withTooltip={false}
              />
            ) : (
              <ConfirmationCheck
                marketColor={marketColor}
                isConfirmed={isConfirmed}
                hasFailed={hasFailed}
                t={t}
                style={{
                  transform: "scale(1.5)",
                }}
                type={type}
                withTooltip={false}
              />
            )}
          </Box>
          <Box my={4} alignItems="center">
            {!amount.isZero() && (
              <>
                <Box selectable>
                  {hasFailed ? (
                    <Box color="alertRed">
                      <Trans i18nKey="operationDetails.failed" />
                    </Box>
                  ) : (
                    <ToolTip
                      content={
                        AmountTooltip ? (
                          <AmountTooltip operation={operation} amount={amount} unit={unit} />
                        ) : null
                      }
                    >
                      <FormattedVal
                        color={amount.isNegative() ? "palette.text.shade80" : undefined}
                        unit={unit}
                        alwaysShowSign
                        showCode
                        val={amount}
                        fontSize={7}
                        disableRounding
                      />
                    </ToolTip>
                  )}
                </Box>
                <Box mt={1} selectable>
                  {hasFailed ? null : (
                    <CounterValue
                      alwaysShowSign
                      color="palette.text.shade60"
                      fontSize={5}
                      date={date}
                      currency={currency}
                      value={amount}
                    />
                  )}
                </Box>
              </>
            )}
          </Box>
          {subOperations.length > 0 && account.type === "Account" && (
            <>
              <OpDetailsSection>
                {t(
                  isToken
                    ? "operationDetails.tokenOperations"
                    : "operationDetails.subAccountOperations",
                )}
                &nbsp;
                <LabelInfoTooltip
                  text={t(
                    isToken
                      ? "operationDetails.tokenTooltip"
                      : "operationDetails.subAccountTooltip",
                  )}
                  style={{ marginLeft: 4 }}
                />
              </OpDetailsSection>
              <Box style={{ overflowX: "hidden" }}>
                {subOperations.map((op, i) => {
                  const opAccount = findSubAccountById(account, op.accountId);

                  if (!opAccount) return null;

                  const subAccountName =
                    opAccount.type === "ChildAccount"
                      ? opAccount.name
                      : getAccountCurrency(opAccount).name;
                  return (
                    <div key={`${op.id}`}>
                      <OperationComponent
                        text={subAccountName}
                        operation={op}
                        account={opAccount}
                        parentAccount={account}
                        onOperationClick={() => openOperation("subOperation", op, operation)}
                        t={t}
                        withAddress={false}
                      />
                      {i < subOperations.length - 1 && <B />}
                    </div>
                  );
                })}
              </Box>
            </>
          )}

          {internalOperations.length > 0 && account.type === "Account" && (
            <>
              <OpDetailsSection>
                {t("operationDetails.internalOperations")}
                <LabelInfoTooltip
                  text={t("operationDetails.internalOpTooltip")}
                  style={{ marginLeft: 4 }}
                />
              </OpDetailsSection>
              <Box>
                {internalOperations.map((op, i) => (
                  <NoMarginWrapper key={`${op.id}`}>
                    <OperationComponent
                      text={account.currency.name}
                      operation={op}
                      account={account}
                      onOperationClick={() => openOperation("internalOperation", op, operation)}
                      t={t}
                    />
                    {i < internalOperations.length - 1 && <B />}
                  </NoMarginWrapper>
                ))}
              </Box>
            </>
          )}

          {internalOperations.length || subOperations.length ? (
            <OpDetailsSection mb={2}>
              {t("operationDetails.details", { currency: currency.name })}
            </OpDetailsSection>
          ) : null}

          <Box horizontal flow={2}>
            <Box flex={1}>
              <OpDetailsTitle>{t("operationDetails.account")}</OpDetailsTitle>
              <OpDetailsData horizontal>
                <TextEllipsis style={parentAccount ? { maxWidth: "50%", flexShrink: 0 } : {}}>
                  <Link onClick={goToMainAccount}>{name}</Link>
                </TextEllipsis>

                {parentAccount ? (
                  <>
                    <Separator>{"/"}</Separator>
                    <TextEllipsis>
                      <Link onClick={goToSubAccount}>{currency.name}</Link>
                    </TextEllipsis>
                  </>
                ) : null}
              </OpDetailsData>
            </Box>
            <Box flex={1}>
              <OpDetailsTitle>{t("operationDetails.date")}</OpDetailsTitle>
              <OpDetailsData>{moment(date).format("LLL")}</OpDetailsData>
            </Box>
          </Box>
          <B />
          <Box horizontal flow={2}>
            {(isNegative || fee) && (
              <Box flex={1}>
                <Box horizontal>
                  <OpDetailsTitle>{t("operationDetails.fees")}</OpDetailsTitle>

                  {urlFeesInfo ? (
                    <Link>
                      <FakeLink
                        underline
                        fontSize={3}
                        ml={2}
                        color="palette.text.shade80"
                        onClick={() => openURL(urlFeesInfo)}
                        iconFirst
                      >
                        <Box mr={1}>
                          <IconExternalLink size={12} />
                        </Box>
                        {t("common.learnMore")}
                      </FakeLink>
                    </Link>
                  ) : null}
                </Box>

                {fee ? (
                  <>
                    <OpDetailsData>
                      <FormattedVal
                        unit={mainAccount.unit}
                        showCode
                        val={fee}
                        color="palette.text.shade80"
                      />
                      <Box horizontal>
                        <CounterValue
                          color="palette.text.shade60"
                          date={date}
                          fontSize={3}
                          currency={mainAccount.currency}
                          value={fee}
                          subMagnitude={1}
                          prefix={
                            <Box mr={1} color="palette.text.shade60" style={{ lineHeight: 1.2 }}>
                              {"≈"}
                            </Box>
                          }
                        />
                      </Box>
                    </OpDetailsData>
                  </>
                ) : (
                  <OpDetailsData>{t("operationDetails.noFees")}</OpDetailsData>
                )}
              </Box>
            )}
            <Box flex={1}>
              <OpDetailsTitle>{t("operationDetails.status")}</OpDetailsTitle>
              <OpDetailsData
                color={hasFailed ? "alertRed" : isConfirmed ? "positiveGreen" : undefined}
                horizontal
                flow={1}
              >
                <Box>
                  {hasFailed
                    ? t("operationDetails.failed")
                    : isConfirmed
                    ? t("operationDetails.confirmed")
                    : t("operationDetails.notConfirmed")}
                </Box>
                {hasFailed ? null : (
                  <Box>{`${confirmationsString ? `(${confirmationsString})` : ``}`}</Box>
                )}
              </OpDetailsData>
            </Box>
          </Box>
          <B />
          <Box>
            <OpDetailsTitle>{t("operationDetails.identifier")}</OpDetailsTitle>
            <OpDetailsData>
              <HashContainer>{hash}</HashContainer>
              <GradientHover>
                <CopyWithFeedback text={hash} />
              </GradientHover>
            </OpDetailsData>
          </Box>
          <B />
          <Box>
            <OpDetailsTitle>{t("operationDetails.from")}</OpDetailsTitle>
            <DataList lines={uniqueSenders} t={t} />
          </Box>

          {recipients.length ? (
            <>
              <B />
              <Box>
                <Box horizontal>
                  <OpDetailsTitle>{t("operationDetails.to")}</OpDetailsTitle>
                  {recipients.length > 1 ? (
                    <Link>
                      <FakeLink
                        underline
                        fontSize={3}
                        ml={2}
                        color="palette.text.shade80"
                        onClick={() => openURL(urls.multipleDestinationAddresses)}
                        iconFirst
                      >
                        <Box mr={1}>
                          <IconExternalLink size={12} />
                        </Box>
                        {t("operationDetails.multipleAddresses")}
                      </FakeLink>
                    </Link>
                  ) : null}
                </Box>
                <DataList lines={recipients} t={t} />
              </Box>
            </>
          ) : null}
          <OpDetailsExtra extra={extra} type={type} account={account} />
        </Box>
      )}
      renderFooter={() => (
        <Box horizontal grow>
          {urlWhatIsThis ? (
            <Box ff="Inter|SemiBold" fontSize={4}>
              <LinkHelp
                label={<Trans i18nKey="operationDetails.whatIsThis" />}
                onClick={() => openURL(urlWhatIsThis)}
              />
            </Box>
          ) : null}
          <div style={{ flex: 1 }} />
          {url ? (
            <Button primary onClick={() => openURL(url)}>
              {t("operationDetails.viewOperation")}
            </Button>
          ) : null}
        </Box>
      )}
    >
      <TrackPage category="Modal" name="OperationDetails" />
    </ModalBody>
  );
});

type OperationDetailsExtraProps = {
  extra: { [key: string]: string },
  type: string,
  account: ?AccountLike,
};

const OperationDetailsExtra = ({ extra }: OperationDetailsExtraProps) => {
  return Object.entries(extra).map(([key, value]) => (
    <Box key={key}>
      <OpDetailsTitle>
        <Trans i18nKey={`operationDetails.extra.${key}`} defaults={key} />
      </OpDetailsTitle>
      <OpDetailsData>{value}</OpDetailsData>
    </Box>
  ));
};

type ModalRenderProps = {
  data: {|
    account: AccountLike,
    operation: Operation,
  |},
  onClose: Function,
};

const OperationDetailsWrapper = ({ t }: { t: TFunction }) => (
  <Modal
    name={"MODAL_OPERATION_DETAILS"}
    centered
    render={(props: ModalRenderProps) => {
      const { data, onClose } = props;
      return <OperationDetails t={t} {...data} onClose={onClose} />;
    }}
  />
);

export default withTranslation()(OperationDetailsWrapper);

const More = styled(Text).attrs(p => ({
  ff: p.ff ? p.ff : "Inter|Bold",
  fontSize: p.fontSize ? p.fontSize : 2,
  color: p.color || "palette.text.shade100",
  tabIndex: 0,
}))`
  text-transform: ${p => (!p.textTransform ? "auto" : "uppercase")};
  outline: none;
`;

export class DataList extends Component<{ lines: string[], t: TFunction }, *> {
  state = {
    showMore: false,
  };

  onClick = () => {
    this.setState(({ showMore }) => ({ showMore: !showMore }));
  };

  render() {
    const { lines, t } = this.props;
    const { showMore } = this.state;
    // Hardcoded for now
    const numToShow = 2;
    const shouldShowMore = lines.length > 3;
    const renderLine = line => (
      <OpDetailsData key={line}>
        <Ellipsis canSelect>{line}</Ellipsis>
        <GradientHover>
          <CopyWithFeedback text={line} />
        </GradientHover>
      </OpDetailsData>
    );

    return (
      <Box>
        {(shouldShowMore ? lines.slice(0, numToShow) : lines).map(renderLine)}
        {shouldShowMore && !showMore && (
          <Box onClick={this.onClick} py={1}>
            <More fontSize={4} color="wallet" ff="Inter|SemiBold" mt={1}>
              <IconChevronRight size={12} style={{ marginRight: 5 }} />
              {t("operationDetails.showMore", { recipients: lines.length - numToShow })}
            </More>
          </Box>
        )}
        {showMore ? lines.slice(numToShow).map(renderLine) : null}
        {shouldShowMore && showMore && (
          <Box onClick={this.onClick} py={1}>
            <More fontSize={4} color="wallet" ff="Inter|SemiBold" mt={1}>
              <IconChevronRight size={12} style={{ marginRight: 5 }} />
              {t("operationDetails.showLess")}
            </More>
          </Box>
        )}
      </Box>
    );
  }
}
