// @flow
import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { openModal } from "~/renderer/actions/modals";
import ContextMenuItem from "./ContextMenuItem";

type Props = {
  collectionAddress: string,
  collectionName?: string,
  children: any,
};

export default function NFTCollectionContextMenu({
  children,
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
        dispatch(openModal("MODAL_HIDE_NFT_COLLECTION", { collectionName, collectionAddress })),
    }
  ];

  return (
    <ContextMenuItem items={menuItems}>
      {children}
    </ContextMenuItem>
  );
}
