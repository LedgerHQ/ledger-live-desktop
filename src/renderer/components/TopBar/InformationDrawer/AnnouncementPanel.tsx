import React, { useCallback, useRef, useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";

import { useTranslation } from "react-i18next";
import { InView } from "react-intersection-observer";

import { useAnnouncements } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider";
import { groupAnnouncements } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider/helpers";

import { useDispatch } from "react-redux";

import { openURL } from "~/renderer/linking";
import { ScrollArea } from "~/renderer/components/Onboarding/ScrollArea";
import Box from "~/renderer/components/Box";
import { Text, Flex, Notification, Badge, Icons } from "@ledgerhq/react-ui";
import { useDeepLinkHandler } from "~/renderer/hooks/useDeeplinking";

import { closeInformationCenter } from "~/renderer/actions/UI";
import useDateTimeFormat from "~/renderer/hooks/useDateTimeFormat";

import lightUptoDateIllustration from "~/renderer/images/V3/announcements-light.png";
import darkUptoDateIllustration from "~/renderer/images/V3/announcements-dark.png";

type DateRowProps = {
  date: Date;
};

function DateRow({ date }: DateRowProps) {
  const dateFormatter = useDateTimeFormat({ dateStyle: "full" });

  return (
    <Flex my="24px">
      <Text color="palette.neutral.c60" fontSize="12px" fontWeight="600">
        {dateFormatter(date)}
      </Text>
    </Flex>
  );
}

type ArticleLevels = "info" | "warning" | "alert";

type ArticleProps = {
  level?: ArticleLevels;
  icon?: ArticleLevels;
  title: string;
  text?: string;
  uuid: string;
  link?: {
    label?: string;
    href: string;
  };
  utmCampaign?: string;
  isRead?: boolean;
};

function Article({
  level = "info",
  icon = "info",
  title,
  text,
  link,
  utmCampaign,
  isRead,
}: ArticleProps) {
  const [backgroundColor, iconColor] = useMemo(() => {
    switch (level) {
      case "info":
        return ["palette.primary.c30", "palette.primary.c90"];
      case "warning":
        return ["palette.warning.c40", "palette.warning.c100"];
      case "alert":
        return ["palette.error.c40", "palette.error.c100"];
    }
  }, [level]);

  const Icon = useMemo(() => {
    switch (icon) {
      case "info":
        return Icons.InfoRegular;
      case "warning":
        return Icons.WarningMedium;
      case "alert":
        return Icons.CircledAlertRegular;
    }
  }, [icon]);

  const { handler } = useDeepLinkHandler();
  const dispatch = useDispatch();
  const url = useMemo(() => {
    if (link) {
      const url = new URL(link.href);
      url.searchParams.set("utm_medium", "announcement");

      if (utmCampaign) {
        url.searchParams.set("utm_campaign", utmCampaign);
      }
      return url;
    } else {
      return null;
    }
  }, [link, utmCampaign]);

  const onLinkClick = useCallback(() => {
    if (url) {
      const isDeepLink = url.protocol === "ledgerlive:";

      if (isDeepLink) {
        handler(null, url.href);
        dispatch(closeInformationCenter());
      } else openURL(url.href);
    }
  }, [url, handler, dispatch]);

  return (
    <Notification
      badge={
        <Badge
          icon={
            <Badge
              backgroundColor={backgroundColor}
              active={!isRead}
              icon={<Icon size={17} color={iconColor} />}
            />
          }
        />
      }
      title={title}
      description={text}
      link={link?.label}
      onLinkClick={onLinkClick}
    />
  );
}

const Separator = styled.div`
  margin: 25px 0px;
  width: 100%;
  height: 1px;
  background-color: ${({ theme }: { theme: any }) => theme.colors.palette.text.shade10};
`;

const Illustration = styled.img`
  width: 100%;
`;

function AnnouncementPanel() {
  const { t } = useTranslation();

  const { cache, setAsSeen, seenIds, allIds } = useAnnouncements();
  let groupedAnnouncements = useMemo(() => groupAnnouncements(allIds.map(uuid => cache[uuid])), [
    cache,
    allIds,
  ]);

  const timeoutByUUID = useRef<{ [uuid: string]: NodeJS.Timeout }>({});
  const handleInView = useCallback(
    (visible, uuid) => {
      const timeouts = timeoutByUUID.current;
      if (!seenIds.includes(uuid) && visible && !timeouts[uuid]) {
        timeouts[uuid] = setTimeout(() => {
          setAsSeen(uuid);
          delete timeouts[uuid];
        }, 1000);
      }

      if (!visible && timeouts[uuid]) {
        clearTimeout(timeouts[uuid]);
        delete timeouts[uuid];
      }
    },
    [seenIds, setAsSeen],
  );

  groupedAnnouncements = [];

  const theme = useTheme();

  if (!groupedAnnouncements.length) {
    return (
      <Flex flexDirection="column" alignItems="center" justifyContent="center" flex={1} pt="20px">
        <Flex mt="70px" mx="80px">
          <Illustration
            src={
              theme.colors.palette.type === "light"
                ? lightUptoDateIllustration
                : darkUptoDateIllustration
            }
          />
        </Flex>
        <Text
          mt="50px"
          textTransform="uppercase"
          color="palette.neutral.c100"
          ff="Alpha|Medium"
          fontSize="28px"
          textAlign="center"
        >
          {t("informationCenter.announcement.emptyState.upToDate")}
        </Text>
        <Text
          mt="8px"
          color="palette.neutral.c100"
          ff="Inter|Regular"
          fontSize="13px"
          textAlign="center"
        >
          {t("informationCenter.announcement.emptyState.checkBackSoon")}
        </Text>
      </Flex>
    );
  }

  return (
    <ScrollArea hideScrollbar>
      <Box py="32px">
        {groupedAnnouncements.map((group, index) => (
          <React.Fragment key={index}>
            {group.day ? <DateRow date={group.day} /> : null}
            {// $FlowFixMe
            group.data.map(({ level, icon, content, uuid, utm_campaign: utmCampaign }, index) => (
              <React.Fragment key={uuid}>
                <InView as="div" onChange={visible => handleInView(visible, uuid)}>
                  {/* conversions are made here for level, icon, text and link. These types are comming from live-common
                  TODO: maybe sanitize the types in live-commos so they're more restrictive and we don't need this */}
                  <Article
                    level={level as ArticleLevels | undefined}
                    icon={icon as ArticleLevels | undefined}
                    title={content.title}
                    text={content.text ?? undefined}
                    link={content.link ?? undefined}
                    uuid={uuid}
                    utmCampaign={utmCampaign}
                    isRead={seenIds.includes(uuid)}
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

export default AnnouncementPanel;
