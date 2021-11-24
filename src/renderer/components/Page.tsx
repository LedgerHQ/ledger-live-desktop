import React, { useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import HSMStatusBanner from "~/renderer/components/HSMStatusBanner";
import TopBar from "~/renderer/components/TopBar";
import { Flex, TransitionInOut, Divider, Button, Icons } from "@ledgerhq/react-ui";

type Props = {
  children: any;
};

const PageScroller = styled(Flex)`
  ${p => p.theme.overflow.y};
`;

const Page = ({ children }: Props) => {
  const pageScrollerRef = useRef<HTMLDivElement>(null);
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
    <Flex position="relative" flex={1} flexDirection="column">
      <HSMStatusBanner />
      <TopBar />
      <TransitionInOut in={!isScrollAtUpperBound} unmountOnExit mountOnEnter>
        <Divider variant="light" />
      </TransitionInOut>
      <Flex overflow="hidden" position="relative" flex={1} flexDirection="column" id="scroll-area">
        <PageScroller id="page-scroller" ref={pageScrollerRef} flex={1} flexDirection="column">
          <Flex flexDirection="column" position="relative" flex={1}>
            {children}
          </Flex>
        </PageScroller>
      </Flex>
      <TransitionInOut in={isScrollUpButtonVisible} unmountOnExit mountOnEnter>
        <Flex position="absolute" bottom={6} right={6}>
          <Button onClick={() => scrolltoTop(true)} variant="shade">
            <Icons.ChevronTopMedium size={20} />
          </Button>
        </Flex>
      </TransitionInOut>
    </Flex>
  );
};

export default Page;
