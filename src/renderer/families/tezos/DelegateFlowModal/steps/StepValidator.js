// @flow
import React, { useCallback, useRef } from "react";
import invariant from "invariant";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { useBakers } from "@ledgerhq/live-common/lib/families/tezos/bakers";
import type { Baker } from "@ledgerhq/live-common/lib/families/tezos/bakers";
import bakersWhitelistDefault from "@ledgerhq/live-common/lib/families/tezos/bakers.whitelist-default";
import { openURL } from "~/renderer/linking";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import ModalContent from "~/renderer/components/Modal/ModalContent";
import UserPlusIcon from "~/renderer/icons/UserPlus";
import BakerImage from "../../BakerImage";
import type { StepProps } from "../types";

const Row = styled(Box).attrs(() => ({
  horizontal: true,
}))`
  cursor: pointer;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade20};
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 250ms ease-out;

  &:hover,
  &:active {
    background-color: ${p => p.theme.colors.palette.action.active};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const BakerRow = ({ baker, onClick }: { baker: Baker, onClick: Baker => void }) => (
  <Row onClick={() => onClick(baker)}>
    <Box horizontal alignItems="center">
      <BakerImage baker={baker} size={24} />
      <Text
        ff="Inter|SemiBold"
        fontSize={3}
        color="palette.text.shade100"
        style={{ marginLeft: 8 }}
      >
        {baker.name}
      </Text>
      {baker.capacityStatus === "full" ? (
        <Text ff="Inter|SemiBold" fontSize={3} color="warning" style={{ marginLeft: 8 }}>
          <Trans i18nKey="delegation.overdelegated" />
        </Text>
      ) : null}
    </Box>
    <Text
      style={{ opacity: baker.capacityStatus === "full" ? 0.5 : 1 }}
      ff="Inter|SemiBold"
      fontSize={3}
      color="palette.text.shade100"
    >
      {baker.nominalYield}
    </Text>
  </Row>
);

const StepValidator = ({
  account,
  parentAccount,
  transaction,
  transitionTo,
  onChangeTransaction,
  eventType,
}: StepProps) => {
  invariant(account, "account is required");
  const contentRef = useRef();
  const bakers = useBakers(bakersWhitelistDefault);
  const onBakerClick = useCallback(
    baker => {
      onChangeTransaction(
        getAccountBridge(account, parentAccount).updateTransaction(transaction, {
          recipient: baker.address,
        }),
      );
      transitionTo("summary");
    },
    [account, onChangeTransaction, parentAccount, transaction, transitionTo],
  );
  const openPartner = useCallback(() => {
    openURL("https://baking-bad.org/");
  }, []);

  return (
    <Box flow={4} mx={20}>
      <TrackPage
        category={`Delegation Flow${eventType ? ` (${eventType})` : ""}`}
        name="Step Validator"
      />
      <Box>
        <Text ff="Inter|Regular" color="palette.text.shade80" fontSize={4} textAlign="center">
          <Trans i18nKey="delegation.flow.steps.validator.description" />
        </Text>
      </Box>
      <Box my={24}>
        <Box mb={3} horizontal justifyContent="space-between">
          <Text ff="Inter|Medium" fontSize={3} color="palette.text.shade60">
            <Trans i18nKey="delegation.validator" />
          </Text>
          <Text ff="Inter|Medium" fontSize={3} color="palette.text.shade60">
            <Trans i18nKey="delegation.yield" />
          </Text>
        </Box>
        <Box style={{ maxHeight: 255, margin: -20, marginTop: 0 }}>
          <ModalContent ref={contentRef}>
            {bakers.map(baker => (
              <BakerRow baker={baker} key={baker.name} onClick={onBakerClick} />
            ))}
          </ModalContent>
        </Box>
      </Box>
      <Box alignItems="center">
        <Button onClick={() => transitionTo("custom")}>
          <Box horizontal flow={1} alignItems="center" color="palette.primary.main">
            <UserPlusIcon size={24} />
            <Box ml={10}>
              <Text ff="Inter|SemiBold" fontSize={4}>
                <Trans i18nKey="delegation.flow.steps.validator.customValidator" />
              </Text>
            </Box>
          </Box>
        </Button>
        <Box mt={5}>
          <Text ff="Inter|Medium" fontSize={2} color="palette.text.shade40">
            <Trans
              i18nKey="delegation.flow.steps.validator.providedBy"
              values={{ name: "Baking Bad" }}
            >
              {"Yield rates provided by"}
              <Text
                onClick={openPartner}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {"Baking Bad"}
              </Text>
            </Trans>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default StepValidator;
