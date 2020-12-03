// @flow

import React, { useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import AngleUp from "~/renderer/icons/AngleUp";
import HSMStatusBanner from "~/renderer/components/HSMStatusBanner";
import TopBar from "~/renderer/components/TopBar";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type Props = {
  children: any,
};

const PageContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
`;

const PageScroller: ThemedComponent<{}> = styled.div`
  padding: ${p => p.theme.space[3]}px ${p => p.theme.space[6]}px;
  padding-right: ${p => p.theme.space[6] - p.theme.overflow.trackSize}px;
  ${p => p.theme.overflow.y};
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PageScrollerContainer: ThemedComponent<{}> = styled.div`
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PageScrollTopSeparator: ThemedComponent<{ isAtUpperBound: boolean }> = styled.div.attrs(
  p => ({
    style: {
      opacity: p.isAtUpperBound ? 0 : 1,
    },
  }),
)`
  position: absolute;
  pointer-events: none;
  left: 0;
  right: 0;
  height: 12px;
  box-sizing: border-box;
  z-index: 20;
  transition: opacity 250ms ease-in-out;
  background: linear-gradient(${p => p.theme.colors.palette.background.default}, rgba(0, 0, 0, 0));
  &:after {
    content: "";
    width: 100%;
    height: 1px;
    display: block;
    background-color: ${p => p.theme.colors.palette.text.shade10};
  }
`;

const PageContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
`;

const ScrollUpButton = styled.div.attrs(p => ({
  style: {
    opacity: p.isVisible ? 1 : 0,
    pointerEvents: p.isVisible ? "initial" : "none",
  },
}))`
  position: absolute;
  z-index: 10;
  bottom: 100px;
  right: 20px;
  border-radius: 50%;
  box-shadow: 0 2px 4px 0 rgba(102, 102, 102, 0.25);
  cursor: pointer;
  height: 36px;
  width: 36px;
  color: ${p => p.theme.colors.palette.primary.contrastText};
  background-color: ${p => p.theme.colors.palette.primary.main};
  transition: all 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Page = ({ children }: Props) => {
  const pageScrollerRef = useRef(null);
  const [isScrollUpButtonVisible, setScrollUpButtonVisibility] = useState(false);
  const [isScrollAtUpperBound, setScrollAtUpperBound] = useState(true);
  const { pathname } = useLocation();

  const scrolltoTop = (smooth = true) => {
    if (pageScrollerRef.current) {
      pageScrollerRef.current.scrollTo({ top: 0, behavior: smooth ? "smooth" : undefined });
    }
  };

  useLayoutEffect(() => {
    scrolltoTop(false);
  }, [pathname]);

  useLayoutEffect(() => {
    const pageContentElement = pageScrollerRef.current;
    const listener = () => {
      if (pageContentElement) {
        setScrollAtUpperBound(pageContentElement.scrollTop === 0);
        setScrollUpButtonVisibility(pageContentElement.scrollTop > 800);
      }
    };

    if (pageContentElement) {
      pageContentElement.addEventListener("scroll", listener, true);
    }

    return () => {
      if (pageContentElement) {
        pageContentElement.removeEventListener("scroll", listener);
      }
    };
  }, []);

  return (
    <PageContainer>
      <HSMStatusBanner />
      <TopBar />
      <PageScrollerContainer id="scroll-area">
        <PageScrollTopSeparator isAtUpperBound={isScrollAtUpperBound} />
        <PageScroller id="page-scroller" ref={pageScrollerRef}>
          <PageContentContainer>{children}</PageContentContainer>
        </PageScroller>
      </PageScrollerContainer>
      <ScrollUpButton isVisible={isScrollUpButtonVisible} onClick={scrolltoTop}>
        <AngleUp size={20} />
      </ScrollUpButton>
    </PageContainer>
  );
};

export default Page;
