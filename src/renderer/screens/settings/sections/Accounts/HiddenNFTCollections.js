// @flow
import React, { useCallback, useState, useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  useNftMetadata,
  useNftCollectionMetadata,
} from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import { SettingsSection as Section, SettingsSectionRow as Row } from "../../SettingsSection";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import IconCross from "~/renderer/icons/Cross";
import Image from "~/renderer/screens/nft/Image";
import Skeleton from "~/renderer/screens/nft/Skeleton";
import { unhideNftCollection } from "~/renderer/actions/settings";
import { hiddenNftCollectionsSelector } from "~/renderer/reducers/settings";
import { accountSelector } from "~/renderer/reducers/accounts";
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

  const firstNft = account?.nfts.find(nft => nft.contract === contractAddress);
  const { metadata: nftMetadata, status: nftStatus } = useNftMetadata(
    contractAddress,
    firstNft?.tokenId,
    firstNft?.currencyId,
  );
  const { metadata: collectionMetadata, status: collectionStatus } = useNftCollectionMetadata(
    contractAddress,
    firstNft?.currencyId,
  );

  const loading = useMemo(() => nftStatus === "loading" || collectionStatus === "loading", [
    collectionStatus,
    nftStatus,
  ]);

  return (
    <HiddenNftCollectionRowContainer>
      <Skeleton width={32} minHeight={32} show={loading}>
        <Image metadata={nftMetadata} tokenId={firstNft?.tokenId} />
      </Skeleton>
      <Text
        style={{ marginLeft: 10, flex: 1 }}
        ff="Inter|Medium"
        color="palette.text.shade100"
        fontSize={3}
      >
        {collectionMetadata?.tokenName || contractAddress}
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
