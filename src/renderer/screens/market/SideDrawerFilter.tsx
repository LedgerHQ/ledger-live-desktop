import React, { useCallback, useState } from "react";
import { Flex, Text, Icons } from "@ledgerhq/react-ui";
import { SideDrawer } from "~/renderer/components/SideDrawer";
import CheckBox from "~/renderer/components/CheckBox";
import { Button } from ".";
import styled from "styled-components";
import Track from "~/renderer/analytics/Track";

const Label = styled(Text).attrs<{ disabled: boolean }>(({ disabled }) => ({
  color: disabled ? "neutral.c60" : "neutral.c100",
}))<{ disabled?: boolean }>`
  font-size: 12px;
`;

export default function SideDrawerFilter({
  refresh,
  filters,
  t,
}: {
  refresh: () => void;
  filters: Record<
    "starred" | "liveCompatible",
    { value: boolean; toggle: () => void; disabled?: boolean }
  >;
  t: any;
}) {
  const { starred, liveCompatible } = filters;
  const [isOpen, setIsOpen] = useState(false);

  const resetFilters = useCallback(() => refresh({ starred: [], liveCompatible: false }), []);

  const openDrawer = useCallback(() => setIsOpen(true), [setIsOpen]);
  const closeDrawer = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <>
      <Button Icon={Icons.FiltersRegular} variant="shade" outline onClick={openDrawer} />
      <SideDrawer
        isOpen={isOpen}
        onRequestClose={closeDrawer}
        direction="left"
        title={t("market.filters.title")}
      >
        <Track
          event="Page Market Filters"
          onMount
          onUpdate
          favourites={starred.length > 0}
          liveCompatible={liveCompatible.value}
        />
        <Flex flex="1" flexDirection="column" alignItems="stretch">
          <Flex p={4} flexDirection="column" alignItems="stretch">
            <Label
              borderRadius={4}
              px={3}
              py={1}
              mb={4}
              bg="neutral.c40"
              color="neutral.c100"
              variant="paragraph"
              style={{ textTransform: "uppercase" }}
            >
              {t("market.filters.show")}
            </Label>
            <Flex flexDirection="row">
              <CheckBox
                isChecked={!starred.value && !liveCompatible.value}
                onChange={resetFilters}
              />
              <Label variant="body" ml={2}>
                {t("market.filters.all")}
              </Label>
            </Flex>
            <Flex my={4} flexDirection="row">
              <CheckBox
                disabled={liveCompatible.disabled}
                isChecked={liveCompatible.value}
                onChange={liveCompatible.toggle}
              />
              <Label variant="body" disabled={liveCompatible.disabled} ml={2}>
                {t("market.filters.isLedgerCompatible")}
              </Label>
            </Flex>
            <Flex flexDirection="row">
              <CheckBox
                disabled={starred.disabled}
                isChecked={starred.value}
                onChange={starred.toggle}
              />
              <Label variant="body" disabled={starred.disabled} ml={2}>
                {t("market.filters.isFavorite")}
              </Label>
            </Flex>
          </Flex>
        </Flex>
      </SideDrawer>
    </>
  );
}
