// @flow
import { SettingsSection as Section, SettingsSectionRow as Row } from "../../SettingsSection";
import Text from "~/renderer/components/Text";
import React, { useCallback, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import IconCross from "~/renderer/icons/Cross";
import Image from "~/renderer/screens/nft/Image";
import Skeleton from "~/renderer/screens/nft/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { unhideNftCollection } from "~/renderer/actions/settings";
import { hiddenNftCollectionsSelector } from "~/renderer/reducers/settings";
import { accountSelector } from "~/renderer/reducers/accounts";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Track from "~/renderer/analytics/Track";
import IconAngleDown from "~/renderer/icons/AngleDown";

const HiddenNftCollectionRow = ({
  contractAddress,
  accountId,
  onUnhide,
}: {
  contractAddress: string,
  accountId: string,
  onUnhide: Function,
}) => {
  const account = useSelector(state => accountSelector(state, { accountId }));
  if (!account?.nfts) return null;

  const firstNft = account?.nfts.find(nft => nft.contract === contractAddress);

  const { metadata, status } = useNftMetadata(
    contractAddress,
    firstNft?.tokenId,
    firstNft?.currencyId,
  );
  const { tokenName } = metadata || {};

  const show = useMemo(() => status === "loading", [status]);

  return (
    <HiddenNftCollectionRowContainer>
      <Skeleton width={32} minHeight={32} show={show}>
        <Image nft={metadata} />
      </Skeleton>
      <Text
        style={{ marginLeft: 10, flex: 1 }}
        ff="Inter|Medium"
        color="palette.text.shade100"
        fontSize={3}
      >
        {tokenName || contractAddress}
      </Text>
      <IconContainer onClick={onUnhide}>
        <IconCross size={16} />
      </IconContainer>
    </HiddenNftCollectionRowContainer>
  );
};

export default function HiddenNftCollections() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [sectionVisible, setSectionVisible] = useState(false);

  const onUnhideCollection = useCallback(
    collectionId => {
      dispatch(unhideNftCollection(collectionId));
    },
    [dispatch],
  );

  const hiddenNftCollections = useSelector(hiddenNftCollectionsSelector);

  const toggleCurrencySection = useCallback(() => {
    setSectionVisible(prevState => !prevState);
  }, [setSectionVisible]);

  return (
    <Section style={{ flowDirection: "column" }}>
      <Track onUpdate event="HiddenNftCollections dropdown" opened={sectionVisible} />
      <Row
        title={t("settings.accounts.hiddenNftCollections.title")}
        desc={t("settings.accounts.hiddenNftCollections.desc")}
        onClick={toggleCurrencySection}
        style={hiddenNftCollections.length ? { cursor: "pointer" } : undefined}
      >
        {hiddenNftCollections.length ? (
          <Box horizontal flex alignItems="center">
            <Box ff="Inter" fontSize={3} mr={2}>
              {t("settings.accounts.hiddenNftCollections.count", {
                count: hiddenNftCollections.length,
              })}
            </Box>
            <Show visible={sectionVisible}>
              <IconAngleDown size={24} />
            </Show>
          </Box>
        ) : null}
      </Row>

      {sectionVisible && (
        <Body>
          {hiddenNftCollections.map(collectionId => {
            const [accountId, contractAddress] = collectionId.split("|");
            return (
              <HiddenNftCollectionRow
                key={collectionId}
                accountId={accountId}
                contractAddress={contractAddress}
                onUnhide={() => onUnhideCollection(collectionId)}
              />
            );
          })}
        </Body>
      )}
    </Section>
  );
}

const IconContainer: ThemedComponent<{}> = styled.div`
  color: ${p => p.theme.colors.palette.text.shade60};
  text-align: center;
  &:hover {
    cursor: pointer;
    color: ${p => p.theme.colors.palette.text.shade40};
  }
`;

const HiddenNftCollectionRowContainer: ThemedComponent<{}> = styled(Box).attrs({
  alignItems: "center",
  horizontal: true,
  flow: 1,
  py: 1,
})`
  margin: 0px;
  &:not(:last-child) {
    border-bottom: 1px solid ${p => p.theme.colors.palette.text.shade10};
  }
  padding: 14px 6px;
`;

const Body: ThemedComponent<{}> = styled(Box)`
  &:not(:empty) {
    padding: 0 20px;
  }
`;

const Show: ThemedComponent<{ visible: boolean }> = styled(Box)`
  transform: rotate(${p => (p.visible ? 0 : 270)}deg);
`;
