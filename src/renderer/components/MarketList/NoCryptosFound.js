// @flow
import React, { useContext } from "react";
import styled from "styled-components";
import Button from "~/renderer/components/Button";
import NoCryptosFoundImg from "~/renderer/images/NoCryptosFound.png";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useTranslation } from "react-i18next";
import { MarketContext } from "~/renderer/contexts/MarketContext";
import { GET_MARKET_CRYPTO_CURRENCIES, SET_MARKET_FILTERS } from "~/renderer/contexts/actionTypes";

const Wrapper: ThemedComponent<{}> = styled("div")`
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

const NoCryptosFoundImgStyled: ThemedComponent<{}> = styled("img")`
  width: 112px;
`;

const NoCryptosFound = ({ searchValue }: { searchValue: string }) => {
  const { t } = useTranslation();
  const {
    contextState: { filters },
    contextDispatch,
  } = useContext(MarketContext);

  const cancelFavoriteFilter = () => {
    contextDispatch(SET_MARKET_FILTERS, { filters: { isFavorite: false } });
    contextDispatch(GET_MARKET_CRYPTO_CURRENCIES, { page: 1 });
  };

  const message = () => {
    if (filters.isFavorite) {
      return (
        <>
          <h4 className="title">{t("market.warnings.trackFavAssets")}</h4>
          <p className="description">{t("market.warnings.clickOnStarIcon")}</p>
          <Button onClick={cancelFavoriteFilter} primary>
            {t("market.warnings.browseAssets")}
          </Button>
        </>
      );
    }
    if (searchValue) {
      return (
        <>
          <h4 className="title">{t("market.warnings.noCryptosFound")}</h4>
          <p className="description">
            {t("market.warnings.noSearchResultsFor")} &apos;{searchValue}&apos;. <br />
            {t("market.warnings.retrySearchKeyword")}
          </p>
        </>
      );
    }
    return (
      <>
        <h4 className="title">{t("market.warnings.noCryptosFound")}</h4>
        <p className="description">
          {t("market.warnings.noSearchResults")} &apos;{searchValue}&apos;. <br />
          {t("market.warnings.retrySearchParams")}
        </p>
      </>
    );
  };
  return (
    <Wrapper>
      <NoCryptosFoundImgStyled src={NoCryptosFoundImg} />
      {message()}
    </Wrapper>
  );
};

export default NoCryptosFound;
