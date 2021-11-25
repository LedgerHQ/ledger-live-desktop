import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation, TFunction } from "react-i18next";
import { Operation, Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import keyBy from "lodash/keyBy";
import {
  groupAccountOperationsByDay,
  groupAccountsOperationsByDay,
  flattenAccounts,
} from "@ledgerhq/live-common/lib/account";
import { Button, Flex, Icons, Text } from "@ledgerhq/react-ui";
import logger from "~/logger";
import Box from "~/renderer/components/Box";
import { track } from "~/renderer/analytics/segment";
import { createStructuredSelector } from "reselect";
import { accountsSelector } from "~/renderer/reducers/accounts";
import SectionTitle from "./SectionTitle";
import OperationC from "./Operation";
import TableContainer, { TableHeader } from "../TableContainer";
import { OperationDetails } from "~/renderer/drawers/OperationDetails";
import { setDrawer } from "~/renderer/drawers/Provider";

type Props = {
  account: AccountLike;
  parentAccount?: Account;
  accounts: AccountLike[];
  allAccounts: AccountLike[];
  t: TFunction;
  withAccount?: boolean;
  withSubAccounts?: boolean;
  title?: string;
  filterOperation?: (arg0: Operation, arg1: AccountLike) => boolean;
};

type State = {
  nbToShow: number;
};

const initialState = {
  nbToShow: 20,
};

export class OperationsList extends PureComponent<Props, State> {
  static defaultProps = {
    withAccount: false,
  };

  state = initialState;

  handleClickOperation = (operation: Operation, account: AccountLike, parentAccount?: Account) =>
    setDrawer(OperationDetails, {
      operationId: operation.id,
      accountId: account.id,
      parentId: parentAccount && parentAccount.id,
    });

  // TODO: convert of async/await if fetching with the api
  fetchMoreOperations = () => {
    track("FetchMoreOperations");
    this.setState({ nbToShow: this.state.nbToShow + 20 });
  };

  render() {
    const {
      account,
      parentAccount,
      accounts,
      allAccounts,
      t,
      title,
      withAccount,
      withSubAccounts,
      filterOperation,
    } = this.props;
    const { nbToShow } = this.state;

    if (!account && !accounts) {
      console.warn("Preventing render OperationsList because not received account or accounts"); // eslint-disable-line no-console
      return null;
    }

    const groupedOperations = account
      ? groupAccountOperationsByDay(account, { count: nbToShow, withSubAccounts, filterOperation })
      : groupAccountsOperationsByDay(accounts, {
          count: nbToShow,
          withSubAccounts,
          filterOperation,
        });

    const all = flattenAccounts(accounts || []).concat([account, parentAccount].filter(Boolean));
    const accountsMap = keyBy(all, "id");

    return (
      <>
        <TableContainer id="operation-list">
          {title && (
            <TableHeader title={title} titleProps={{ "data-e2e": "dashboard_OperationList" }} />
          )}
          {groupedOperations.sections.map(group => (
            <Box key={group.day.toISOString()}>
              <SectionTitle day={group.day} />
              <Flex flexDirection="column" py={5}>
                {group.data.map(operation => {
                  const account = accountsMap[operation.accountId];
                  if (!account) {
                    logger.warn(`no account found for operation ${operation.id}`);
                    return null;
                  }
                  let parentAccount;
                  if (account.type !== "Account") {
                    const pa =
                      accountsMap[account.parentId] ||
                      allAccounts.find(a => a.id === account.parentId);
                    if (pa && pa.type === "Account") {
                      parentAccount = pa;
                    }
                    if (!parentAccount) {
                      logger.warn(`no token account found for token operation ${operation.id}`);
                      return null;
                    }
                  }
                  return (
                    <OperationC
                      compact
                      operation={operation}
                      account={account}
                      parentAccount={parentAccount}
                      key={`${account.id}_${operation.id}`}
                      onOperationClick={this.handleClickOperation}
                      t={t}
                      withAccount={withAccount}
                    />
                  );
                })}
              </Flex>
            </Box>
          ))}
        </TableContainer>
        {!groupedOperations.completed ? (
          <Button
            variant="shade"
            outline
            onClick={this.fetchMoreOperations}
            Icon={Icons.DropdownMedium}
            iconPosition="right"
          >
            <span>{t("common.showMore")}</span>
          </Button>
        ) : (
          <Box p={3} alignItems="center">
            <Text ff="Inter" fontSize={3}>
              {t("operationList.noMoreOperations")}
            </Text>
          </Box>
        )}
      </>
    );
  }
}

export default compose(
  withTranslation(),
  connect(
    createStructuredSelector({
      allAccounts: accountsSelector,
    }),
  ),
)(OperationsList);
