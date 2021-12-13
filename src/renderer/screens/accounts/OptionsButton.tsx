import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Icons, Text } from "@ledgerhq/react-ui";

import Track from "~/renderer/analytics/Track";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import DropDownSelector, {
  DropDownItem,
  DropDownItemType,
} from "~/renderer/components/DropDownSelector";
import Switch from "~/renderer/components/Switch";
import Tooltip from "~/renderer/components/Tooltip";
import { openModal } from "~/renderer/actions/modals";
import { useHideEmptyTokenAccounts } from "~/renderer/actions/settings";

import ExportOperations from "~/renderer/drawers/ExportOperations";

const Item = styled(DropDownItem)`
  width: 230px;
  cursor: pointer;
  white-space: pre-wrap;
  justify-content: flex-start;
  align-items: center;
`;

type ItemType = DropDownItemType & {
  icon?: React.ReactElement<any>;
  onClick?: (e?: MouseEvent) => void;
  type?: "separator";
};

const OptionsButton = () => {
  const dispatch = useDispatch();
  const [isOperationsDrawerOpen, setIsOperationsDrawerOpen] = useState(false);
  const [hideEmptyTokenAccounts, setHideEmptyTokenAccounts] = useHideEmptyTokenAccounts();

  const openOperationsDrawer = useCallback(() => setIsOperationsDrawerOpen(true), [
    setIsOperationsDrawerOpen,
  ]);
  const closeOperationsDrawer = useCallback(() => setIsOperationsDrawerOpen(false), [
    setIsOperationsDrawerOpen,
  ]);

  const onOpenModal = useCallback(
    (modal: string) => {
      dispatch(openModal(modal));
    },
    [dispatch],
  );
  const { t } = useTranslation();

  const items: ItemType[] = [
    {
      key: "exportOperations",
      label: t("accounts.optionsMenu.exportOperations"),
      icon: <Icons.ExportMedium size="18px" />,
      onClick: openOperationsDrawer,
    },
    {
      key: "exportAccounts",
      label: t("accounts.optionsMenu.exportToMobile"),
      icon: <Icons.DevicesAltMedium size="18px" />,
      onClick: () => onOpenModal("MODAL_EXPORT_ACCOUNTS"),
    },
    {
      key: "hideEmpty",
      label: t("settings.accounts.hideEmptyTokens.title"),
      onClick: (e?: MouseEvent) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        setHideEmptyTokenAccounts(!hideEmptyTokenAccounts);
      },
    },
  ];

  const renderItem = ({ item }: { item: ItemType }) => {
    return (
      <Item
        id={`accounts-button-${item.key}`}
        horizontal
        flow={2}
        onClick={item.onClick}
        disableHover={item.key === "hideEmpty"}
      >
        {item.key === "hideEmpty" ? (
          <Box mr={4}>
            <Track
              onUpdate
              event={
                hideEmptyTokenAccounts
                  ? "hideEmptyTokenAccountsEnabled"
                  : "hideEmptyTokenAccountsDisabled"
              }
            />
            <Switch
              name="hide-empty-accounts"
              isChecked={hideEmptyTokenAccounts}
              onChange={setHideEmptyTokenAccounts}
            />
          </Box>
        ) : item.icon ? (
          <Box mr={4}>{item.icon}</Box>
        ) : null}
        <Text variant="small" fontWeight="semiBold" color="palette.neutral.c80">
          {item.label}
        </Text>
      </Item>
    );
  };

  return (
    <>
      <ExportOperations isOpen={isOperationsDrawerOpen} onClose={closeOperationsDrawer} />
      <DropDownSelector buttonId="accounts-options-button" items={items} renderItem={renderItem}>
        {() => (
          <Box horizontal>
            <Tooltip content={t("accounts.optionsMenu.title")}>
              <Button variant="shade" Icon={Icons.OthersMedium} />
            </Tooltip>
          </Box>
        )}
      </DropDownSelector>
    </>
  );
};

export default React.memo<{}>(OptionsButton);
