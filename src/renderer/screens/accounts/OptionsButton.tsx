import React, { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Icons, Text } from "@ledgerhq/react-ui";

import { context as drawersContext } from "~/renderer/drawers/Provider";
import Track from "~/renderer/analytics/Track";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import DropDownSelector, {
  DropDownItem,
  DropDownItemType,
} from "~/renderer/components/DropDownSelector";
import Switch from "~/renderer/components/Switch";
import Tooltip from "~/renderer/components/Tooltip";
import IconDownloadCloud from "~/renderer/icons/DownloadCloud";
import IconSend from "~/renderer/icons/Send";
import { openModal } from "~/renderer/actions/modals";
import { useHideEmptyTokenAccounts } from "~/renderer/actions/settings";

import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import ExportOperations from "~/renderer/modals/ExportOperations";

const Item: ThemedComponent<{
  disableHover?: boolean;
}> = styled(DropDownItem)`
  width: 230px;
  cursor: pointer;
  white-space: pre-wrap;
  justify-content: flex-start;
  align-items: center;
`;

type ItemType = DropDownItemType & {
  icon?: React.ReactElement<any>;
  onClick?: () => void;
  type?: "separator";
};

const OptionsButton = () => {
  const dispatch = useDispatch();
  const { setDrawer } = useContext(drawersContext);
  const [hideEmptyTokenAccounts, setHideEmptyTokenAccounts] = useHideEmptyTokenAccounts();

  const onOpenModal = useCallback(
    (modal: string) => {
      dispatch(openModal(modal));
    },
    [dispatch],
  );
  const { t } = useTranslation();

  const items: DropDownItemType[] = [
    {
      key: "exportOperations",
      label: t("accounts.optionsMenu.exportOperations"),
      icon: <Icons.ExportMedium size="18px" />,
      onClick: () => setDrawer(ExportOperations),
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
      onClick: (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
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
            <Switch small isChecked={hideEmptyTokenAccounts} onChange={setHideEmptyTokenAccounts} />
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

  // TODO: replace this dropdown
  return (
    <DropDownSelector
      buttonId="accounts-options-button"
      horizontal
      items={items}
      renderItem={renderItem}
    >
      {() => (
        <Box horizontal>
          <Tooltip content={t("accounts.optionsMenu.title")}>
            <Button variant="shade" Icon={Icons.OthersMedium} />
          </Tooltip>
        </Box>
      )}
    </DropDownSelector>
  );
};

export default React.memo<{}>(OptionsButton);
