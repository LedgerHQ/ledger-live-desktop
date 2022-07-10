import React, { Fragment, useCallback, useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { BigNumber } from "bignumber.js";

import type { Account } from "@ledgerhq/live-common/lib/types";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { openModal } from "~/renderer/actions/modals";
import { denominate } from "~/renderer/families/elrond/helpers";
import { constants } from "~/renderer/families/elrond/constants";

import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import IconChartLine from "~/renderer/icons/ChartLine";

import ToolTip from "~/renderer/components/Tooltip";
import ClaimRewards from "~/renderer/icons/ClaimReward";
import DelegateIcon from "~/renderer/icons/Delegate";
import TableContainer, { TableHeader } from "~/renderer/components/TableContainer";
import axios from "axios";

import Unbondings from "~/renderer/families/elrond/components/Unbondings";
import Delegations from "~/renderer/families/elrond/components/Delegations";

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

const withDelegation = Component => props =>
  props.account.elrondResources ? <Component {...props} /> : null;

const Delegation = (props: Props) => {
  const { account } = props;
  const [validators, setValidators] = useState([]);
  const [delegationResources, setDelegationResources] = useState(
    account.elrondResources.delegations || [],
  );

  const dispatch = useDispatch();
  const delegationEnabled = useMemo(() => BigNumber(denominate({ input: account.balance })).gt(1), [
    account.balance,
  ]);

  const findValidator = useCallback(
    (needle: string) => validators.find(item => item.providers.includes(needle)),
    [validators],
  );

  const hasRewards = useMemo(
    () =>
      delegationResources
        .reduce(
          (total, delegation) => BigNumber(delegation.claimableRewards).plus(total),
          BigNumber(0),
        )
        .gt(0),
    [delegationResources],
  );

  const delegations = useMemo(() => {
    const transform = (input: string) =>
      BigNumber(denominate({ input, showLastNonZeroDecimal: true }));

    const assignValidator = delegation => ({
      ...delegation,
      validator: findValidator(delegation.contract),
    });

    const sortDelegations = (alpha, beta) =>
      transform(alpha.userActiveStake).isGreaterThan(transform(beta.userActiveStake)) ? -1 : 1;

    return delegationResources.map(assignValidator).sort(sortDelegations);
  }, [findValidator, delegationResources]);

  const unbondings = useMemo(
    () =>
      delegationResources
        .reduce(
          (total, item) =>
            total.concat(
              item.userUndelegatedList.map(unbonding => ({
                ...unbonding,
                contract: item.contract,
                validator: findValidator(item.contract),
              })),
            ),
          [],
        )
        .sort((alpha, beta) => alpha.seconds - beta.seconds),
    [delegationResources, findValidator],
  );

  const fetchValidators = () => {
    const fetchData = async (): Promise<void> => {
      try {
        const providers = await axios.get(constants.identities);

        const randomize = providers =>
          providers
            .map(provider => ({ provider, sort: Math.random() }))
            .sort((alpha, beta) => alpha.sort - beta.sort)
            .map(item => item.provider);

        setValidators(randomize(providers.data.filter(validator => validator.providers)));
      } catch (error) {
        setValidators([]);
      }
    };

    fetchData();

    return setValidators;
  };

  const fetchDelegations = () => {
    const fetchData = async () => {
      try {
        const delegations = await axios.get(
          `${constants.delegations}/accounts/${account.freshAddress}/delegations`,
        );

        setDelegationResources(delegations.data);
      } catch (error) {
        setDelegationResources([]);
      }
    };

    if (account.elrondResources && !account.elrondResources.delegations) {
      fetchData();
    }

    return () => setDelegationResources(account.elrondResources.delegations || []);
  };

  const onEarnRewards = useCallback(() => {
    dispatch(
      openModal(constants.modals.rewards, {
        account,
        validators,
        delegations,
      }),
    );
  }, [account, dispatch, validators, delegations]);

  const onDelegate = useCallback(() => {
    if (validators) {
      dispatch(
        openModal(constants.modals.stake, {
          account,
          validators,
          delegations,
        }),
      );
    }
  }, [account, dispatch, validators, delegations]);

  const onClaimRewards = useCallback(() => {
    if (validators && delegations) {
      dispatch(
        openModal(constants.modals.claim, {
          account,
          validators,
          delegations,
        }),
      );
    }
  }, [account, delegations, validators, dispatch]);

  const hasDelegations = delegations.length > 0;
  const hasUnbondings = unbondings.length > 0;

  useEffect(fetchValidators, []);
  useEffect(fetchDelegations, [account]);

  return (
    <Fragment>
      <TableContainer mb={6}>
        <TableHeader
          title={<Trans i18nKey="elrond.delegation.header" />}
          titleProps={{ "data-e2e": "title_Delegation" }}
        >
          {(hasDelegations || hasRewards) && (
            <Fragment>
              {delegations && (
                <ToolTip
                  content={
                    !delegationEnabled ? <Trans i18nKey="elrond.delegation.minSafeWarning" /> : null
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
                    <Box horizontal={true} flow={1} alignItems="center">
                      <DelegateIcon size={12} />
                      <Box>
                        <Trans i18nKey="elrond.delegation.delegate" />
                      </Box>
                    </Box>
                  </Button>
                </ToolTip>
              )}

              <ToolTip
                content={!hasRewards ? <Trans i18nKey="elrond.delegation.noRewards" /> : null}
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
                      <Trans i18nKey="elrond.delegation.claimRewards" />
                    </Box>
                  </Box>
                </Button>
              </ToolTip>
            </Fragment>
          )}
        </TableHeader>

        {hasDelegations ? (
          <Delegations delegations={delegations} validators={validators} account={account} />
        ) : (
          <Wrapper horizontal={true}>
            <Box style={{ maxWidth: "65%" }}>
              <Text ff="Inter|Medium|SemiBold" color="palette.text.shade60" fontSize={4}>
                <Trans
                  i18nKey="elrond.delegation.emptyState.description"
                  values={{ name: account.currency.name }}
                />
              </Text>

              <Box mt={2}>
                <LinkWithExternalIcon
                  label={<Trans i18nKey="elrond.delegation.emptyState.info" />}
                  onClick={() => openURL(urls.elrondStaking)}
                />
              </Box>
            </Box>

            <Box>
              <ToolTip
                content={
                  !delegationEnabled ? <Trans i18nKey="elrond.delegation.minSafeWarning" /> : null
                }
              >
                <Button
                  primary={true}
                  small={true}
                  disabled={!delegationEnabled}
                  onClick={onEarnRewards}
                >
                  <Box horizontal={true} flow={1} alignItems="center">
                    <IconChartLine size={12} />

                    <Box>
                      <Trans i18nKey="elrond.delegation.emptyState.delegation" />
                    </Box>
                  </Box>
                </Button>
              </ToolTip>
            </Box>
          </Wrapper>
        )}
      </TableContainer>

      {hasUnbondings && <Unbondings unbondings={unbondings} account={account} />}
    </Fragment>
  );
};

export default withDelegation(Delegation);
