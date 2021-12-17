import React, { useCallback, useEffect, useState } from "react";

import { SectionRow as Row } from "../../Rows";
import { Text, Flex, Icons, Divider, Button } from "@ledgerhq/react-ui";
import { useTranslation } from "react-i18next";
import { findTokenById } from "@ledgerhq/live-common/lib/currencies";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import styled from "styled-components";
import IconCross from "~/renderer/icons/Cross";
import { useDispatch, useSelector } from "react-redux";
import { showToken } from "~/renderer/actions/settings";
import { blacklistedTokenIdsSelector } from "~/renderer/reducers/settings";
import { useBridgeSync } from "@ledgerhq/live-common/lib/bridge/react";
import Track from "~/renderer/analytics/Track";
import IconAngleDown from "~/renderer/icons/AngleDown";

export default function BlacklistedTokens() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const sync = useBridgeSync();
  const [sectionVisible, setSectionVisible] = useState(false);

  // Trigger a sync on unmounting the block
  useEffect(() => () => sync({ type: "SYNC_ALL_ACCOUNTS", priority: 5 }), [sync]);

  const onShowToken = useCallback(
    tokenId => {
      dispatch(showToken(tokenId));
    },
    [dispatch],
  );

  const blacklistedTokenIds = useSelector(blacklistedTokenIdsSelector);
  const sections = [];
  for (const tokenId of blacklistedTokenIds) {
    const token = findTokenById(tokenId);
    if (token) {
      const parentCurrency = token.parentCurrency;
      const index = sections.findIndex(s => s.parentCurrency === parentCurrency);
      if (index < 0) {
        sections.push({
          parentCurrency,
          tokens: [token],
        });
      } else {
        sections[index].tokens.push(token);
      }
    }
  }

  const toggleCurrencySection = useCallback(() => {
    setSectionVisible(prevState => !prevState);
  }, [setSectionVisible]);

  return (
    <Flex flexDirection="column">
      <Track onUpdate event="BlacklistedTokens dropdown" opened={sectionVisible} />
      <Row
        title={t("settings.accounts.tokenBlacklist.title")}
        desc={t("settings.accounts.tokenBlacklist.desc")}
      >
        {blacklistedTokenIds.length ? (
          <Button
            onClick={toggleCurrencySection}
            Icon={sectionVisible ? Icons.ChevronBottomMedium : Icons.ChevronRightMedium}
          >
            <Text ff="Inter|Regular" variant="paragraph" fontWeight="semiBold" mr={2}>
              {t("settings.accounts.tokenBlacklist.count", { count: blacklistedTokenIds.length })}
            </Text>
          </Button>
        ) : null}
      </Row>

      {sectionVisible && (
        <Flex flexDirection="column" mt={3}>
          {sections.map(({ parentCurrency, tokens }) => (
            <Flex key={parentCurrency.id} flexDirection="column" mt={5}>
              <BlacklistedTokensSectionHeader py={3} px={5} backgroundColor="neutral.c30">
                <Text
                  ff="Inter|Regular"
                  variant="paragraph"
                  fontWeight="semiBold"
                  color="neutral.c100"
                  textTransform="uppercase"
                >
                  {parentCurrency.name}
                </Text>
              </BlacklistedTokensSectionHeader>
              <Flex flexDirection="column">
                {tokens.map((token, i) => (
                  <>
                    <Flex flexGrow={1} alignItems="center" p={4} key={token.id}>
                      <CryptoCurrencyIcon currency={token} size={20} />
                      <Text
                        style={{ marginLeft: 10, flex: 1 }}
                        ff="Inter|Medium"
                        color="neutral.c80"
                        fontSize={3}
                      >
                        {token.name}
                      </Text>
                      <Button
                        onClick={() => onShowToken(token.id)}
                        Icon={Icons.CloseMedium}
                        color="neutral.c70"
                      />
                    </Flex>
                    {i < tokens.length - 1 && <Divider variant="light" />}
                  </>
                ))}
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
}

const BlacklistedTokensSectionHeader = styled(Flex)`
  border-radius: ${p => p.theme.radii[2]}px;
`;
