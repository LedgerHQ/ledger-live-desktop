// @flow

import styled from "styled-components";
import Box from "~/renderer/components/Box";
import { InView } from "react-intersection-observer";
import React, { useCallback, useRef, useMemo } from "react";
import { useAnnouncements } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider";

import { groupAnnouncements } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider/helpers";
import Text from "~/renderer/components/Text";
import moment from "moment";
import InfoCircle from "~/renderer/icons/InfoCircle";
import TriangleWarning from "~/renderer/icons/TriangleWarning";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import { openURL } from "~/renderer/linking";
import { ScrollArea } from "~/renderer/components/Onboarding/ScrollArea";

const DateRowContainer = styled.div`
  padding: 4px 16px;
  background-color: ${({ theme }) => theme.colors.palette.background.default};
  border-radius: 4px;
  margin: 25px 0px;
`;

const levelThemes = {
  info: {
    title: "palette.text.shade100",
    text: "palette.text.shade50",
  },
  warning: {
    title: "white",
    text: "white",
    background: "orange",
    icon: "white",
    link: "white",
    padding: "16px",
  },
  alert: {
    title: "palette.text.shade100",
    text: "palette.text.shade50",
    background: "red",
    icon: "white",
    link: "white",
  },
};

type DateRowProps = {
  date: Date,
};

function DateRow({ date }: DateRowProps) {
  return (
    <DateRowContainer>
      <Text color="palette.text.shade60" ff="Inter|SemiBold" fontSize="11px" lineHeight="18px">
        {moment(date).format("L")}
      </Text>
    </DateRowContainer>
  );
}

const ArticleContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  border-radius: 4px;
`;

const ArticleRightColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ArticleLeftColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ArticleIconContainer = styled.div`
  padding-right: 14.5px;
`;

type ArticleProps = {
  level: string,
  icon: string,
  title: string,
  text: string,
  link?: {
    label?: string,
    href: string,
  },
  utmCampaign?: string,
};

const icons = {
  warning: {
    defaultIconColor: "orange",
    Icon: TriangleWarning,
  },
  info: {
    defaultIconColor: "wallet",
    Icon: InfoCircle,
  },
};

type ArticleLinkProps = {
  label?: string,
  href: string,
  utmCampaign?: string,
  color: string,
};

function ArticleLink({ label, href, utmCampaign, color }: ArticleLinkProps) {
  const url = useMemo(() => {
    const url = new URL(href);

    url.searchParams.set("utm_medium", "announcement");

    if (utmCampaign) {
      url.searchParams.set("utm_campaign", utmCampaign);
    }
    return url;
  }, [href, utmCampaign]);

  return (
    <LinkWithExternalIcon
      color={color}
      onClick={() => openURL(url.toString())}
      style={{
        marginTop: 15,
      }}
    >
      {label || href}
    </LinkWithExternalIcon>
  );
}

function Article({ level = "info", icon = "info", title, text, link, utmCampaign }: ArticleProps) {
  const levelTheme = levelThemes[level];

  const { Icon, defaultIconColor } = icons[icon];

  return (
    <ArticleContainer
      bg={levelTheme.background}
      py={levelTheme.padding}
      px="16px"
      color={levelTheme.icon || defaultIconColor}
    >
      <ArticleLeftColumnContainer>
        <ArticleIconContainer>
          <Icon size={15} />
        </ArticleIconContainer>
      </ArticleLeftColumnContainer>
      <ArticleRightColumnContainer>
        <Text color={levelTheme.title} ff="Inter|SemiBold" fontSize="14px" lineHeight="16.94px">
          {title}
        </Text>
        <Text mt="4px" color={levelTheme.text} ff="Inter|Medium" fontSize="12px" lineHeight="18px">
          {text}
        </Text>
        {link ? (
          <ArticleLink
            href={link.href}
            label={link.label}
            utmCampaign={utmCampaign}
            color={levelTheme.link}
          />
        ) : null}
      </ArticleRightColumnContainer>
    </ArticleContainer>
  );
}

const Separator = styled.div`
  margin: 25px 0px;
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.palette.text.shade10};
`;

export function AnnouncementPanel() {
  const { cache, setAsSeen, seenIds, allIds } = useAnnouncements();
  const groupedAnnouncements = useMemo(() => groupAnnouncements(allIds.map(uuid => cache[uuid])), [
    cache,
    allIds,
  ]);

  const timeoutByUUID = useRef({});
  const handleInView = useCallback(
    (visible, uuid) => {
      const timeouts = timeoutByUUID.current;
      if (!seenIds.includes(uuid) && visible && !timeouts[uuid]) {
        timeouts[uuid] = setTimeout(() => {
          setAsSeen(uuid);
          delete timeouts[uuid];
        }, 2000);
      }

      if (!visible && timeouts[uuid]) {
        clearTimeout(timeouts[uuid]);
        delete timeouts[uuid];
      }
    },
    [seenIds, setAsSeen],
  );

  return (
    <ScrollArea hideScrollbar>
      <Box py="32px">
        {groupedAnnouncements.map((group, index) => (
          <React.Fragment key={index}>
            {group.day ? <DateRow date={group.day} /> : null}
            {/* eslint-disable-next-line camelcase */}
            {group.data.map(({ level, icon, content, uuid, utm_campaign }, index) => (
              <React.Fragment key={uuid}>
                <InView as="div" onChange={visible => handleInView(visible, uuid)}>
                  <Article
                    level={level}
                    icon={icon}
                    title={content.title}
                    text={content.text}
                    link={content.link}
                    uuid={uuid}
                    /* eslint-disable-next-line camelcase */
                    utmCampaign={utm_campaign}
                  />
                </InView>
                {index < group.data.length - 1 ? <Separator /> : null}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </Box>
    </ScrollArea>
  );
}
