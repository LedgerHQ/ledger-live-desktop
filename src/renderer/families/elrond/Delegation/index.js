// @flow
import React, { Fragment, useCallback, useState, useEffect } from "react";
import invariant from "invariant";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import {
  useCosmosPreloadData,
  useCosmosMappedDelegations,
} from "@ledgerhq/live-common/lib/families/cosmos/react";
import { mapUnbondings, canDelegate } from "@ledgerhq/live-common/lib/families/cosmos/logic";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import IconChartLine from "~/renderer/icons/ChartLine";
import { Header, UnbondingHeader } from "./Header";
import { Row, UnbondingRow } from "./Row";

import ToolTip from "~/renderer/components/Tooltip";
import ClaimRewards from "~/renderer/icons/ClaimReward";
import DelegateIcon from "~/renderer/icons/Delegate";
import TableContainer, { TableHeader } from "~/renderer/components/TableContainer";
import axios from "axios";

type Props = {
  account: Account,
};

const Wrapper = styled(Box).attrs(() => ({
  p: 3,
}))`
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;
`;

const Delegation = ({ account }: Props) => {
  const [validators, setValidators] = useState();
  const [delegations, setDelegations] = useState();
  const [unbondings, setUnbondings] = useState();

  const dispatch = useDispatch();
  const delegationEnabled = true;
  const hasRewards = true;

  console.log({ account });

  const fetchData = () => {
    const fetchPayload = async (): Promise<void> => {
      const endpoints = {
        validators: "https://testnet-api.elrond.com/identities?identities=validblocks",
        delegations: `https://testnet-delegation-api.elrond.com/accounts/${account.freshAddress}/delegations`,
      };

      const [providers, stakings] = await axios.all([
        axios.get(endpoints.validators),
        axios.get(endpoints.delegations),
      ]);

      const findValidator = (needle: string) =>
        providers.data.find(item => item.providers.includes(needle));

      const allUnbondings = stakings.data.reduce(
        (total, item) =>
          total.concat(
            item.userUndelegatedList.map(unbonding => ({
              ...unbonding,
              contract: item.contract,
              validator: findValidator(item.contract),
            })),
          ),
        [],
      );

      setValidators(providers.data);
      setUnbondings(allUnbondings.sort((alpha, beta) => alpha.seconds - beta.seconds));
      setDelegations(
        stakings.data.map(staking => ({
          ...staking,
          validator: findValidator(staking.contract),
        })),
      );
    };

    const returnCallback = () => {
      setValidators();
      setDelegations();
      setUnbondings();
    };

    fetchPayload();

    return returnCallback;
  };

  useEffect(fetchData, [account.freshAddress]);

  const onEarnRewards = useCallback(() => {
    dispatch(
      openModal("MODAL_ELROND_REWARDS_INFO", {
        account,
      }),
    );
  }, [account, dispatch]);

  const onDelegate = useCallback(() => {
    if (validators) {
      dispatch(
        openModal("MODAL_ELROND_DELEGATE", {
          account,
          validators,
        }),
      );
    }
  }, [account, dispatch, validators]);

  const onClaimRewards = useCallback(() => {
    dispatch(
      openModal("MODAL_ELROND_CLAIM_REWARDS", {
        account,
      }),
    );
  }, [account, dispatch]);

  const onRedirect = useCallback(
    (contract: string, modalName: string, amount: string) => {
      dispatch(
        openModal(modalName, {
          account,
          contract,
          validators,
          amount,
        }),
      );
    },
    [account, dispatch, validators],
  );

  return (
    <Fragment>
      <TableContainer mb={6}>
        <TableHeader
          title={<Trans i18nKey="cosmos.delegation.header" />}
          titleProps={{ "data-e2e": "title_Delegation" }}
        >
          {(delegations || hasRewards) && (
            <Fragment>
              {delegations && (
                <ToolTip
                  content={
                    !delegationEnabled ? <Trans i18nKey="cosmos.delegation.minSafeWarning" /> : null
                  }
                >
                  <Button
                    id={"account-delegate-button"}
                    mr={2}
                    disabled={!delegationEnabled}
                    color="palette.primary.main"
                    small={true}
                    onClick={onDelegate}
                  >
                    <Box horizontal flow={1} alignItems="center">
                      <DelegateIcon size={12} />
                      <Box>
                        <Trans i18nKey="cosmos.delegation.delegate" />
                      </Box>
                    </Box>
                  </Button>
                </ToolTip>
              )}

              <ToolTip
                content={!hasRewards ? <Trans i18nKey="cosmos.delegation.noRewards" /> : null}
              >
                <Button
                  id={"account-rewards-button"}
                  disabled={!hasRewards}
                  color="palette.primary.main"
                  small={true}
                  onClick={onClaimRewards}
                >
                  <Box horizontal flow={1} alignItems="center">
                    <ClaimRewards size={12} />
                    <Box>
                      <Trans i18nKey="cosmos.delegation.claimRewards" />
                    </Box>
                  </Box>
                </Button>
              </ToolTip>
            </Fragment>
          )}
        </TableHeader>

        {delegations ? (
          <Fragment>
            <Header />

            {delegations.map((delegation, index) => (
              <Row
                key={index}
                account={account}
                delegation={delegation}
                onManageAction={onRedirect}
              />
            ))}
          </Fragment>
        ) : (
          <Wrapper horizontal={true}>
            <Box style={{ maxWidth: "65%" }}>
              <Text ff="Inter|Medium|SemiBold" color="palette.text.shade60" fontSize={4}>
                <Trans
                  i18nKey="cosmos.delegation.emptyState.description"
                  values={{ name: account.currency.name }}
                />
              </Text>
              <Box mt={2}>
                <LinkWithExternalIcon
                  label={<Trans i18nKey="cosmos.delegation.emptyState.info" />}
                  onClick={() => openURL(urls.stakingCosmos)}
                />
              </Box>
            </Box>
            <Box>
              <ToolTip
                content={
                  !delegationEnabled ? <Trans i18nKey="cosmos.delegation.minSafeWarning" /> : null
                }
              >
                <Button
                  primary={true}
                  small={true}
                  disabled={!delegationEnabled}
                  onClick={onEarnRewards}
                >
                  <Box horizontal flow={1} alignItems="center">
                    <IconChartLine size={12} />
                    <Box>
                      <Trans i18nKey="cosmos.delegation.emptyState.delegation" />
                    </Box>
                  </Box>
                </Button>
              </ToolTip>
            </Box>
          </Wrapper>
        )}
      </TableContainer>

      {unbondings && (
        <TableContainer mb={6}>
          <TableHeader
            title={<Trans i18nKey="cosmos.undelegation.header" />}
            titleProps={{ "data-e2e": "title_Undelegation" }}
            tooltip={<Trans i18nKey="cosmos.undelegation.headerTooltip" />}
          />

          <UnbondingHeader />

          {unbondings.map((unbonding, index) => (
            <UnbondingRow key={`${unbonding.contract}-${index}`} {...unbonding} />
          ))}
        </TableContainer>
      )}
    </Fragment>
  );
};

const Delegations = (props: Props) =>
  props.account.elrondResources ? <Delegation {...props} /> : null;

export default Delegations;
