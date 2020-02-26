// @flow
import React, { useMemo, useCallback } from "react";
import { Trans } from "react-i18next";

import type { Action, InstalledItem } from "@ledgerhq/live-common/lib/apps/types";

import { listTokens } from "@ledgerhq/live-common/lib/currencies";

import Text from "~/renderer/components/Text";
import NoResults from "~/renderer/icons/NoResults";
import Box from "~/renderer/components/Box/Box";
import Button from "~/renderer/components/Button";

const tokens = listTokens();

type Props = {
  query: string,
  addAccount: (*) => void,
  dispatch: Action => void,
  installed: InstalledItem[],
};

const Placeholder = ({ query, addAccount, dispatch, installed }: Props) => {
  const found = useMemo(
    () =>
      tokens.find(
        token =>
          token.name.toLowerCase().includes(query.toLowerCase()) ||
          token.ticker.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  const install = useCallback(
    () =>
      found &&
      found.parentCurrency &&
      dispatch({ type: "install", name: found.parentCurrency.name }),
    [found, dispatch],
  );

  const parentInstalled = useMemo(
    () =>
      found &&
      found.parentCurrency &&
      installed.find(({ name }) => name === found.parentCurrency.name),
    [found, installed],
  );

  const goToAccounts = useCallback(() => addAccount(found), [addAccount, found]);

  return found && found.parentCurrency ? (
    <Box alignItems="center" pt={5} py={6}>
      <Box ff="Inter|Regular" fontSize={5} color="palette.text.shade100">
        <Trans
          i18nKey="manager.applist.item.noAppNeededForToken"
          values={{
            appName: found.parentCurrency.name,
            tokenName: `${found.name} (${found.ticker})`,
          }}
        />
      </Box>
      <Box pt={2} style={{ maxWidth: 500 }} alignItems="center">
        <Text
          ff="Inter|Regular"
          color="palette.text.shade80"
          fontSize={4}
          textAlign="center"
          style={{ lineHeight: 1.6 }}
        >
          <Trans
            i18nKey={
              !parentInstalled
                ? "manager.applist.item.tokenAppDisclaimer"
                : "manager.applist.item.tokenAppDisclaimerInstalled"
            }
            values={{
              appName: found.parentCurrency.name,
              tokenName: found.name,
              tokenType: found.tokenType.toUpperCase(),
            }}
          >
            {"placeholder"}
            <Text ff="Inter|SemiBold" color="palette.text.shade100">
              {"placeholder"}
            </Text>
            {"placeholder"}
            <Text ff="Inter|SemiBold" color="palette.text.shade100">
              {"placeholder"}
            </Text>
          </Trans>
        </Text>
      </Box>
      <Box pt={5} horizontal>
        <Button
          outline
          outlineColor="palette.text.shade60"
          onClick={goToAccounts}
          style={{ marginRight: 32 }}
        >
          <Trans i18nKey="manager.applist.item.goToAccounts" />
        </Button>
        {!parentInstalled && (
          <Button primary onClick={install}>
            <Trans
              i18nKey="manager.applist.item.intallParentApp"
              values={{ appName: found.parentCurrency.name }}
            />
          </Button>
        )}
      </Box>
    </Box>
  ) : (
    <Box vertical py={6} flex alignContent="center">
      <Box mb={4} horizontal color="palette.text.shade30" justifyContent="center">
        <NoResults />
      </Box>
      <Text textAlign="center" ff="Inter|SemiBold" fontSize={6}>
        <Trans i18nKey="manager.applist.noResultsFound" />
      </Text>
      <Text textAlign="center" fontSize={4}>
        <Trans i18nKey="manager.applist.noResultsDesc" />
      </Text>
    </Box>
  );
};

export default Placeholder;
