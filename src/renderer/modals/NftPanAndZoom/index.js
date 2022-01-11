// @flow

import React, { useMemo } from "react";

import Skeleton from "~/renderer/screens/nft/Skeleton";
import Image from "~/renderer/screens/nft/Image";

import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import { getNFTById } from "~/renderer/reducers/accounts";
import { useSelector } from "react-redux";

import PrismaZoom from "react-prismazoom";

import Modal, { ModalBody } from "~/renderer/components/Modal";

type ModalRenderProps = {
  onClose: () => void,
  data?: {
    nftId: string,
  },
};

type ModalBodyProps = { nftId: string, onClose: () => void };

const NftPanAndZoomModalBody = ({ nftId, onClose }: ModalBodyProps) => {
  const nft = useSelector(state => getNFTById(state, { nftId }));
  const { status, metadata } = useNftMetadata(nft.collection.contract, nft.tokenId);
  const show = useMemo(() => status === "loading", [status]);
  const name = metadata?.nftName || nft.tokenId;

  return (
    <ModalBody
      onClose={onClose}
      title={name}
      render={() => (
        <Skeleton show={show}>
          <PrismaZoom>
            <Image nft={metadata} full square={false} />
          </PrismaZoom>
        </Skeleton>
      )}
    />
  );
};

const NftPanAndZoomModal = () => {
  return (
    <Modal
      name="MODAL_NFT_PAN_ZOOM"
      render={({ onClose, data }: ModalRenderProps) => {
        return <NftPanAndZoomModalBody nftId={data.nftId} onClose={onClose} />;
      }}
    />
  );
};

export default NftPanAndZoomModal;
