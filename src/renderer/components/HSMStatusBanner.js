// @flow

import React, { useState, useEffect, useCallback } from "react";
import { warnings } from "@ledgerhq/live-common/lib/api/socket";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import uniqueId from "lodash/uniqueId";

import { SHOW_MOCK_HSMWARNINGS } from "~/config/constants";
import { urls } from "~/config/urls";

import { openURL } from "~/renderer/linking";

import IconCross from "~/renderer/icons/Cross";
import IconExclamationCircle from "~/renderer/icons/ExclamationCircle";
import IconChevronRight from "~/renderer/icons/ChevronRight";

import Box from "~/renderer/components/Box";

type HSMStatus = {
  id: string,
  message: string,
};

const CloseIconContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-bottom-left-radius: 4px;
`;

const CloseIcon = (props: *) => (
  <CloseIconContainer {...props}>
    <IconCross size={16} color="palette.background.paper" />
  </CloseIconContainer>
);

const UnderlinedLink = styled.span`
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom-color: ${p => p.theme.colors.palette.background.paper};
  }
`;

const Banner = styled(Box)`
  background: ${p => p.theme.colors.orange};
  overflow: hidden;
  border-radius: 4px;
  font-size: 13px;
  color: ${p => p.theme.colors.palette.background.paper};
  font-weight: bold;
  padding: 17px 30px 15px 15px;
  width: 350px;
`;

type BannerItemLinkProps = {
  onClick: void => *,
};

const BannerItemLink = ({ onClick }: BannerItemLinkProps) => {
  const { t } = useTranslation();

  return (
    <Box
      mt={2}
      ml={4}
      flow={1}
      horizontal
      alignItems="center"
      cursor="pointer"
      onClick={onClick}
      color="palette.background.paper"
    >
      <IconChevronRight size={16} color="palette.background.paper" />
      <UnderlinedLink>{t("common.learnMore")}</UnderlinedLink>
    </Box>
  );
};

type BannerItemProps = {
  item: HSMStatus,
  onItemDismiss: HSMStatus => void,
};

const BannerItem = ({ item, onItemDismiss }: BannerItemProps) => {
  const { t } = useTranslation();

  const onLinkClick = useCallback(() => openURL(urls.contactSupport), []);
  const dismiss = useCallback(() => {
    onItemDismiss(item);
  }, [item, onItemDismiss]);

  return (
    <Banner relative key={item.id}>
      <CloseIcon onClick={dismiss} />
      <Box horizontal flow={2}>
        <IconExclamationCircle size={16} color="palette.background.paper" />
        <Box shrink ff="Inter|SemiBold" style={styles.message}>
          {item.message}
        </Box>
      </Box>
      <BannerItemLink t={t} onClick={onLinkClick} />
    </Banner>
  );
};

const initialState: HSMStatus[] = SHOW_MOCK_HSMWARNINGS
  ? [
      {
        id: "mock1",
        message: "Lorem Ipsum dolor sit amet #1",
      },
    ]
  : [];

const styles = {
  container: {
    position: "fixed",
    left: 32,
    bottom: 32,
    zIndex: 100,
  },
  message: {
    marginTop: -3,
  },
};

const HSMStatusBanner = () => {
  const [pendingMessages, setPendingMessages] = useState(initialState);
  const { t } = useTranslation();

  const setNewMessage = useCallback(
    (message: string) => {
      setPendingMessages([...pendingMessages, { id: uniqueId(), message }]);
    },
    [pendingMessages, setPendingMessages],
  );

  const dismissItem = useCallback(
    (dismissedItem: HSMStatus) => {
      setPendingMessages(pendingMessages.filter(item => item.id !== dismissItem.id));
    },
    [pendingMessages, setPendingMessages],
  );

  useEffect(() => {
    const sub = warnings.subscribe({
      next: message => {
        setNewMessage(message);
      },
    });

    return () => sub.unsubscribe();
  }, [setNewMessage]);

  const item = pendingMessages.length ? pendingMessages[0] : null;

  return item ? (
    <Box flow={2} style={styles.container}>
      <BannerItem key={item.id} t={t} item={item} onItemDismiss={dismissItem} />
    </Box>
  ) : null;
};

export default HSMStatusBanner;
