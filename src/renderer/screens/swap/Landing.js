// @flow

import React from "react";
import Box from "~/renderer/components/Box";
import { Trans, withTranslation } from "react-i18next";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import WorldMap from "~/renderer/icons/WorldMap";
import Card from "~/renderer/components/Box/Card";
import Spinner from "~/renderer/components/Spinner";
import IconExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import type { AvailableProvider } from "@ledgerhq/live-common/lib/swap/types";

const Body = styled(Box)`
  max-width: 480px;
  align-items: center;
  align-self: center;
  text-align: center;
  position: relative;
`;

const Illustration = styled.div`
  margin-bottom: 24px;
  position: absolute;
`;

const Content = styled.div`
  margin-top: 40px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Landing = ({
  providers,
  onContinue,
}: {
  providers?: ?(AvailableProvider[]),
  onContinue: any,
}) => {
  if (providers && providers.length) {
    onContinue();
  }

  return !providers || !providers.length ? (
    <Card px={80} py={53} style={{ minHeight: 380 }}>
      <Body>
        <Illustration>
          <WorldMap />
        </Illustration>
        <Content>
          <Box style={{ maxWidth: 256 }} mt={32} alignItems={"center"} color="palette.text.shade50">
            {!providers ? (
              <Spinner size={40} />
            ) : (
              <>
                <IconExclamationCircleThin size={40} />
                <Text mt={3} ff="Inter|SemiBold" fontSize={6} color="palette.text.shade100">
                  <Trans i18nKey="swap.landing.sorry" />
                </Text>
              </>
            )}
          </Box>
        </Content>
      </Body>
    </Card>
  ) : null;
};

export default withTranslation()(Landing);
