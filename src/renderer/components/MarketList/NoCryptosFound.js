// @flow
import React from "react";
import styled from "styled-components";
import NoCryptosFoundImg from "~/renderer/images/NoCryptosFound.png";

const Wrapper = styled.div`
  width: 100%;
  padding-top: 60px;
  text-align: center;

  .title {
    font-size: 18px;
    padding-top: 24px;
    font-weight: 600;
    color: ${p => p.theme.colors.palette.text.shade90};
  }

  .description {
    font-size: 13px;
    padding-top: 20px;
    color: ${p => p.theme.colors.palette.text.shade50};
    font-weight: 400;
  }
`;

const NoCryptosFoundImgStyled = styled.img`
  width: 112px;
`;

const NoCryptosFound = ({ searchValue }: { searchValue: string }) => (
  <Wrapper>
    <NoCryptosFoundImgStyled src={NoCryptosFoundImg} />
    <h4 className="title">No Cryptos found</h4>
    <p className="description">
      Sorry, we did not find any search results for &apos;{searchValue}&apos;. <br /> Please retry
      the search with another keyword.
    </p>
  </Wrapper>
);

export default NoCryptosFound;
