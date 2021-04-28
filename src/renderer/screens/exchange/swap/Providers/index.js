// @flow

import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import InfoBox from "~/renderer/components/InfoBox";
import IconChangelly from "~/renderer/icons/swap/Changelly";
import IconParaswap from "~/renderer/icons/swap/Paraswap";
import IconWyre from "~/renderer/icons/swap/Wyre";
import Item from "./Item";
import Card from "~/renderer/components/Box/Card";

const Grid = styled.div`
  display: grid;
  grid-gap: 18px;
  grid-template-columns: 33% 33% 33%;
`;

const Footer = styled(Box)`
  border-top: 1px solid ${p => p.theme.colors.palette.text.shade10};
  margin-top: 8px;
  padding: 20px 24px;
  align-items: flex-end;
`;

const Provider = ({ onContinue }: { onContinue: string => void }) => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState();
  const rows = false;

  return (
    <>
      <Box mb={20}>
        <InfoBox type={"security"}>
          {
            "{{DEVNOTE}} We are currently not discriminating available providers, this needs to be integrated with backend"
          }
        </InfoBox>
      </Box>
      <Card justifyContent={"center"}>
        <Box px={80} pt={40} alignSelf={"normal"} alignItems={"center"}>
          <Text ff="Inter|SemiBold" mr={1} fontSize={18} color="palette.text.shade100">
            <Trans i18nKey={"swap.providers.title"} />
          </Text>
          <Box mb={48} mt={12}>
            <LinkWithExternalIcon onClick={() => {}} color="palette.primary.main">
              <Text ff="Inter|SemiBold" fontSize={11}>
                <Trans i18nKey={"swap.providers.whatIsSwap"} />
              </Text>
            </LinkWithExternalIcon>
          </Box>
          <Grid>
            <Item
              rows={rows}
              id={"wyre"}
              onSelect={setSelectedItem}
              selected={selectedItem}
              Icon={IconWyre}
              kyc={"REQUIRED"}
              title={t("swap.providers.wyre.title")}
              bullets={[
                t("swap.providers.wyre.bullet.0"),
                t("swap.providers.wyre.bullet.1"),
                t("swap.providers.wyre.bullet.2"),
              ]}
            />
            <Item
              rows={rows}
              id={"changelly"}
              onSelect={setSelectedItem}
              selected={selectedItem}
              Icon={IconChangelly}
              title={t("swap.providers.changelly.title")}
              bullets={[
                t("swap.providers.changelly.bullet.0"),
                t("swap.providers.changelly.bullet.1"),
                t("swap.providers.changelly.bullet.2"),
              ]}
            />
            <Item
              rows={rows}
              id={"paraswap"}
              onSelect={setSelectedItem}
              selected={selectedItem}
              Icon={IconParaswap}
              title={t("swap.providers.paraswap.title")}
              bullets={[
                t("swap.providers.paraswap.bullet.0"),
                t("swap.providers.paraswap.bullet.1"),
                t("swap.providers.paraswap.bullet.2"),
              ]}
            />
          </Grid>
        </Box>
        <Footer>
          <Button
            primary
            onClick={() => {
              selectedItem && onContinue(selectedItem);
            }}
            disabled={!selectedItem}
          >
            {t("swap.providers.cta")}
          </Button>
        </Footer>
      </Card>
    </>
  );
};

export default Provider;
