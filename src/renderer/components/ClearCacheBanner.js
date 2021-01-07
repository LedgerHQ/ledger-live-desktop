// @flow
import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import TopBanner from "~/renderer/components/TopBanner";
import TriangleWarning from "~/renderer/icons/TriangleWarning";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { showClearCacheBannerSelector } from "~/renderer/reducers/settings";
import Spinner from "~/renderer/components/Spinner";
import { useSoftReset } from "~/renderer/reset";
import { setShowClearCacheBanner } from "~/renderer/actions/settings";

export default function ClearCacheBanner() {
  const [isLoading, setIsLoading] = useState(false);
  const showClearCacheBanner = useSelector(showClearCacheBannerSelector);
  const dispatch = useDispatch();
  const softReset = useSoftReset();
  const onClick = useCallback(() => {
    try {
      setIsLoading(true);
      softReset();
      dispatch(setShowClearCacheBanner(false));
    } catch (err) {
      setIsLoading(false);
    }
  }, [dispatch, softReset]);

  if (!showClearCacheBanner && !isLoading) return null;
  return (
    <TopBanner
      status="orange"
      content={{
        message: <Trans i18nKey="banners.cleanCache.title" />,
        Icon: TriangleWarning,
        right: (
          <Link id="modal-migrate-accounts-button" onClick={onClick}>
            {isLoading ? <Spinner size={16} /> : <Trans i18nKey="banners.cleanCache.cta" />}
          </Link>
        ),
      }}
      bannerId={"migrate"}
    />
  );
}

const Link = styled.span`
  color: ${p => p.theme.colors.palette.primary.contrastText};
  text-decoration: underline;
  cursor: pointer;
`;
