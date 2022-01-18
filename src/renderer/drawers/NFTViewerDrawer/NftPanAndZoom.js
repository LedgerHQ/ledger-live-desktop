// @flow

import React from "react";
import { createPortal } from "react-dom";

import Image from "~/renderer/screens/nft/Image";

import PrismaZoom from "react-prismazoom";

import styled from "styled-components";

const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  padding: 60px 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NFTImageContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const domNode = document.getElementById("modals");

type NftPanAndZoomProps = {
  onClose: () => void,
  nft: NFTWithMetadata,
};

type BodyProps = { nft: NFTWithMetadata };

const NftPanAndZoomBody = ({ nft }: BodyProps) => {
  return (
    <NFTImageContainer>
      <div
        onClick={(e: Event) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <PrismaZoom>
          <Image nft={nft} full square={false} objectFit="scale-down" />
        </PrismaZoom>
      </div>
    </NFTImageContainer>
  );
};

const NftPanAndZoom = ({ onClose, nft }: NftPanAndZoomProps) => {
  const modal = (
    <Container onClick={onClose}>
      <NftPanAndZoomBody nft={nft} />
    </Container>
  );

  // we use the same portal as modals but don't use the modal component itself because we need
  // to handle the size of the model differently
  return domNode ? createPortal(modal, domNode) : null;
};

export default NftPanAndZoom;
