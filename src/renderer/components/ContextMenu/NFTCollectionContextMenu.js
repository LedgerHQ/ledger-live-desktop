// @flow
import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { openModal } from "~/renderer/actions/modals";
import ContextMenuItem from "./ContextMenuItem";
import type { Account } from "@ledgerhq/live-common/lib/types";

type Props = {
  account: Account,
  collectionAddress: string,
  collectionName?: string,
  children: any,
};

export default function NFTCollectionContextMenu({
  children,
  account,
  collectionAddress,
  collectionName,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const menuItems = [
    {
      key: "hide",
      label: t("hideNftCollection.hideCTA"),
      // Icon: TODO,
      callback: () =>
        dispatch(
          openModal("MODAL_HIDE_NFT_COLLECTION", {
            collectionName: collectionName ?? collectionAddress,
            collectionId: `${account.id}|${collectionAddress}`,
          }),
        ),
    },
  ];

  return <ContextMenuItem items={menuItems}>{children}</ContextMenuItem>;
}
