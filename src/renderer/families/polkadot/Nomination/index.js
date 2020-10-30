// @flow
import React, { useCallback, useState, useEffect, useMemo } from "react";
import invariant from "invariant";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { getValidators } from "@ledgerhq/live-common/lib/families/polkadot/validators";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import Box, { Card } from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import { Header } from "./Header";
import { Row } from "./Row";

type Props = {
  account: Account,
};

const Wrapper = styled(Box).attrs(() => ({
  p: 3,
  mt: 24,
  mb: 6,
}))`
  border: 1px dashed ${p => p.theme.colors.palette.text.shade20};
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;
`;

const Nomination = ({ account }: Props) => {
  const dispatch = useDispatch();

  const [validators, setValidators] = useState([]);

  const { polkadotResources } = account;
  invariant(polkadotResources, "cosmos account expected");
  const {
    nominations,
    // unbondings,
  } = polkadotResources;

  useEffect(() => {
    async function fetchValidators() {
      const validatorsIds = nominations?.map(n => n.address) || [];
      const validatorsList = await getValidators(validatorsIds);
      setValidators(validatorsList);
    }

    if (nominations && nominations?.length !== validators?.length) {
      fetchValidators();
    }
  }, [nominations, validators, setValidators]);

  const mappedNominations = useMemo(() => {
    return nominations?.map(nomination => {
      const validator = validators.find(v => v.address === nomination.address);
      return {
        nomination,
        validator,
      };
    });
  }, [nominations, validators]);

  // const onEarnRewards = useCallback(() => {
  //   dispatch(
  //     openModal("MODAL_POLKADOT_REWARDS_INFO", {
  //       account,
  //     }),
  //   );
  // }, [account, dispatch]);

  // const onDelegate = useCallback(() => {
  //   dispatch(
  //     openModal("MODAL_POLKADOT_NOMINATE", {
  //       account,
  //     }),
  //   );
  // }, [account, dispatch]);

  // const onClaimRewards = useCallback(() => {
  //   dispatch(
  //     openModal("MODAL_POLKADOT_CLAIM_REWARDS", {
  //       account,
  //     }),
  //   );
  // }, [account, dispatch]);

  const onRedirect = useCallback(
    (validatorAddress: string, modalName: string) => {
      dispatch(
        openModal(modalName, {
          account,
          validatorAddress,
        }),
      );
    },
    [account, dispatch],
  );

  const explorerView = getDefaultExplorerView(account.currency);

  const onExternalLink = useCallback(
    (address: string) => {
      const URL = explorerView && getAddressExplorer(explorerView, address);

      if (URL) openURL(URL);
    },
    [explorerView],
  );

  const hasNominations = nominations && nominations?.length > 0;

  return (
    <>
      <Box horizontal alignItems="center" justifyContent="space-between">
        <Text
          ff="Inter|Medium"
          fontSize={6}
          color="palette.text.shade100"
          data-e2e="title_Delegation"
        >
          <Trans i18nKey="polkadot.nomination.header" />
        </Text>
        {/* hasNominations ? (
          <Box horizontal>
            {hasNominations ? (
              <ToolTip
                content={
                  !delegationEnabled ? <Trans i18nKey="cosmos.delegation.minSafeWarning" /> : null
                }
              >
                <Button
                  id={"account-delegate-button"}
                  mr={2}
                  disabled={!delegationEnabled}
                  primary
                  small
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
            ) : null}
            <ToolTip content={!hasRewards ? <Trans i18nKey="cosmos.delegation.noRewards" /> : null}>
              <Button
                id={"account-rewards-button"}
                disabled={!hasRewards}
                primary
                small
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
          </Box>
              ) : null */}
      </Box>
      {hasNominations ? (
        <Card p={0} mt={24} mb={6}>
          <Header />
          {mappedNominations?.map(({ nomination, validator }, index) => (
            <Row
              key={index}
              account={account}
              nomination={nomination}
              validator={validator}
              onManageAction={onRedirect}
              onExternalLink={onExternalLink}
            />
          ))}
        </Card>
      ) : (
        <Wrapper horizontal>
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
        </Wrapper>
      )}
    </>
  );
};

const Nominations = ({ account }: Props) => {
  if (!account.polkadotResources) return null;

  return <Nomination account={account} />;
};

export default Nominations;
