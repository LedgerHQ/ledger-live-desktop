// @flow
import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import IconBan from "~/renderer/icons/Ban";
import { openModal } from "~/renderer/actions/modals";
import ContextMenuItem from "./ContextMenuItem";
import type { Account } from "@ledgerhq/live-common/lib/types";

type Props = {
  account: Account,
  collectionAddress: string,
  collectionName?: string,
  children: any,
  leftClick?: boolean,
};

export default function NFTCollectionContextMenu({
  children,
  account,
  collectionAddress,
  collectionName,
  leftClick,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const menuItems = [
    {
      key: "hide",
      label: t("hideNftCollection.hideCTA"),
      Icon: IconBan,
      callback: () =>
        dispatch(
          openModal("MODAL_HIDE_NFT_COLLECTION", {
            collectionName: collectionName ?? collectionAddress,
            collectionId: `${account.id}|${collectionAddress}`,
          }),
        ),
    },
  ];

  return (
    <ContextMenuItem items={menuItems} leftClick={leftClick}>
      {children}
    </ContextMenuItem>
  );
}
