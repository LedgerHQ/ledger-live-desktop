// @flow

import styled from "styled-components";
import Box from "~/renderer/components/Box";
import React from "react";
import {
  useAnnouncements,
  useGroupedAnnouncements,
} from "@ledgerhq/live-common/lib/announcements/react";
import Text from "~/renderer/components/Text";
import moment from "moment";
import InfoCircle from "~/renderer/icons/InfoCircle";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import { openURL } from "~/renderer/linking";

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
};

function Article({ level = "info", icon = "info", title, text, link }: ArticleProps) {
  const levelTheme = levelThemes[level];

  return (
    <ArticleContainer bg={levelTheme.background} p={levelTheme.padding} color={levelTheme.icon}>
      <ArticleLeftColumnContainer>
        <ArticleIconContainer>
          <InfoCircle size={15} />
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
          <LinkWithExternalIcon
            color={levelTheme.link}
            onClick={() => openURL(link.href)}
            style={{
              marginTop: 15,
            }}
          >
            {link.label || link.href}
          </LinkWithExternalIcon>
        ) : null}
      </ArticleRightColumnContainer>
    </ArticleContainer>
  );
}

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Separator = styled.div`
  margin: 15px 0px;
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.palette.text.shade10};
`;

export function AnnouncementPanel() {
  const { cache } = useAnnouncements();
  const groups = useGroupedAnnouncements(cache);

  console.log(groups);

  return (
    <PanelContainer>
      {groups.map((group, index) => (
        <React.Fragment key={index}>
          {group.day ? <DateRow date={group.day} /> : null}
          {group.data.map(({ level, icon, content, uuid }, index) => (
            <React.Fragment key={uuid}>
              <Article
                level={level}
                icon={icon}
                title={content.title}
                text={content.text}
                link={content.link}
                uuid={uuid}
              />
              {index < group.data.length - 1 ? <Separator /> : null}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </PanelContainer>
  );
}
